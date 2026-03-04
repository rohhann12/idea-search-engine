const express = require('express');
const cors = require('cors');
const { dataExtractor } = require('../utils/dataExtractor');
const { ChromaClient } = require('chromadb');

const app = express();
app.use(cors());
app.use(express.json());

const chroma = new ChromaClient({ path: 'http://chromadb:8000' });
const COLLECTION = 'reddit_posts';

async function getOrCreateCollection() {
  return await chroma.getOrCreateCollection({ name: COLLECTION });
}

async function embedText(text: string): Promise<number[]> {
  const res = await fetch('http://embedding-service:8001/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data: any = await res.json();
  return data.embedding;
}

app.get('/', (req: any, res: any) => {
  res.json({ status: 'ok', service: 'SubSearch API' });
});

app.get('/status', async (req: any, res: any) => {
  try {
    const collection = await getOrCreateCollection();
    const count = await collection.count();
    res.json({ indexed: count > 0, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/index', async (req: any, res: any) => {
  const subreddit = req.query.subreddits;
  const limit = parseInt(req.query.limit) || 50;

  try {
    const posts = await dataExtractor(subreddit, limit);
    if (!posts.length) return res.status(400).json({ error: 'No posts fetched' });

    const collection = await getOrCreateCollection();

    const embeddings = await Promise.all(
      posts.map((p:any) => embedText(`${p.title} ${p.body}`))
    );

    await collection.add({
      ids: posts.map((p:any) => p.id),
      embeddings,
      metadatas: posts.map(p => ({
        title: p.title,
        url: p.url,
        score: p.score,
        author: p.author,
        subreddit: p.subreddit,
        numComments: p.numComments,
        createdAt: p.createdAt,
      })),
      documents: posts.map(p => `${p.title} ${p.body}`),
    });

    res.json({ indexed: posts.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/search', async (req: any, res: any) => {
  const { query, limit = 10 } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    const embedding = await embedText(query);
    const collection = await getOrCreateCollection();

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: limit,
    });
    
    const hits = results.ids[0].map((id: string, i: number) => ({
      id,
      ...results.metadatas[0][i],
      document: results.documents[0][i],
      distance: results.distances?.[0][i],
    }));

    res.json({ results: hits });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3004, () => {
  console.log('SubSearch API running on http://localhost:3004');
});
