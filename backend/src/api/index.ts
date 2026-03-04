const express = require('express');
const cors = require('cors');
const { dataExtractor } = require('../utils/dataExtractor');
const { ChromaClient } = require('chromadb');

const app = express();
app.use(cors());
app.use(express.json());

const chroma = new ChromaClient({ path: 'http://chromadb:8000' });
const COLLECTION = 'reddit_posts';



async function embedText(text: string): Promise<number[]> {
  const res = await fetch('http://embedding-service:8001/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data: any = await res.json();
  return data.embedding;
}

app.get('/', (_req: any, res: any) => {
  res.json({ status: 'ok', service: 'SubSearch API' });
});

app.get('/status', async (_req: any, res: any) => {
});

app.get('/index', async (req: any, res: any) => {
  
});

app.post('/search', async (req: any, res: any) => {
 
});

app.listen(3004, () => {
  console.log('SubSearch API running on http://localhost:3004');
});
