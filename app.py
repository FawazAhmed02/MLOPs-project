from flask import Flask, request, jsonify
from flask_cors import CORS
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import json

app = Flask(__name__)
CORS(app)

# Load model and data
GEMINI_API_KEY = "AIzaSyBddcUcZrqNSkNvMZKTufipP8Kg9pXdBkM"
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
TOP_K = 3
EMBEDDINGS_FILE = "embeddings.npy"
INDEX_FILE = "faiss.index"
CHUNKS_FILE = "CHUNKS_FILE"

genai.configure(api_key=GEMINI_API_KEY)
gemini = genai.GenerativeModel(model_name="gemini-2.0-flash")
embedder = SentenceTransformer(EMBEDDING_MODEL)

embeddings = np.load(EMBEDDINGS_FILE)
index = faiss.read_index(INDEX_FILE)
with open(CHUNKS_FILE, "r") as f:
    chunks = json.load(f)

def rag_query(query):
    query_embedding = embedder.encode([query])
    D, I = index.search(np.array(query_embedding), TOP_K)
    context = "\n".join([chunks[i] for i in I[0]])
    prompt = f"""Answer the user's question using the context below.

Context:
{context}

Question: {query}
Answer:"""
    response = gemini.generate_content(prompt)
    return response.text.strip()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query", "")
    response = rag_query(query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
