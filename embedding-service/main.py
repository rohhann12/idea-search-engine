from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app=FastAPI()

model=SentenceTransformer("all-MiniLM-L6-v2")
class TextReq(BaseModel):
    text:str


@app.post("/embed")
def embed_text(req:TextReq):
    embed=model.encode(req.text).tolist()
    return {"embedding":embed}