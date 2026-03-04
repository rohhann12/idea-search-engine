# SubSearch

semantic search engine for reddit. type a concept, get back relevant posts — no keyword matching.

---

## how it works

**scraping** — hits the reddit API for a given subreddit, pulls recent posts + metadata.

**vectorizing** — a small docker sidecar we built (`./embedding-service`): FastAPI + `all-MiniLM-L6-v2`. hit `POST /embed` with text, get back a vector. runs on port 8001, starts before the backend.

**storage** — embeddings go into ChromaDB, a lightweight vector database running in its own container.

**search** — your query gets embedded the same way, then ChromaDB finds the closest matches by cosine similarity.

**backend** — Express server wires it all together. exposes endpoints to index a subreddit and search across it.

**frontend** — Next.js UI, dark theme, nothing fancy. just a search box that hits the backend.

---

## stack

- `chromadb` — vector store, port 8000
- `embedding-service` — sentence-transformers (`all-MiniLM-L6-v2`), port 8001
- `backend` — Express/TypeScript, port 3004
- `ui` — Next.js 16 + Tailwind v4, port 3000

---

## running it

```bash
docker-compose up
```

everything starts together. hit `localhost:3000` when it's up.

---

## indexing a subreddit

```
GET /index?subreddit=sideprojects&limit=100
```

then search:

```
POST /search
{ "query": "indie hackers building in public", "limit": 10 }
```