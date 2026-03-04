const fs = require('fs');

export interface RedditPost {
  id: string;
  title: string;
  body: string;
  url: string;
  score: number;
  numComments: number;
  author: string;
  createdAt: number;
  subreddit: string;
}

async function dataExtractor(subreddit = 'sideprojects', limit = 100): Promise<RedditPost[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
    const req: any = await fetch(url, {
      headers: { 'User-Agent': 'SubSearch/1.0' }
    });
    const data = await req.json();
    const posts: RedditPost[] = data.data.children.map((post: any) => ({
      id: post.data.id,
      title: post.data.title,
      body: post.data.selftext || '',
      url: `https://reddit.com${post.data.permalink}`,
      score: post.data.score,
      numComments: post.data.num_comments,
      author: post.data.author,
      createdAt: post.data.created_utc,
      subreddit: post.data.subreddit,
    }));
    writeToFile(posts);
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function writeToFile(data: any) {
  const dir = '/app/data';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/init.json`, JSON.stringify(data, null, 2));
}

module.exports = { dataExtractor };
