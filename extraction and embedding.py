import fitz  # PyMuPDF
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json


# === CONFIG ===
PDF_PATH = "optimized/meezaan1.pdf"
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
TOP_K = 3
EMBEDDINGS_FILE = "embeddings.npy"
INDEX_FILE = "faiss.index"

# === PDF Text Extraction ===
def extract_text_from_pdf(path):
    doc = fitz.open(path)
    return "\n".join(page.get_text() for page in doc)

# === Load and Chunk PDF ===
print("Extracting text from PDF...")
raw_text = extract_text_from_pdf(PDF_PATH)

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_text(raw_text)
with open("CHUNKS_FILE", "w") as f:
    json.dump(chunks, f, indent=2)
# === Embed Chunks ===
print("Embedding chunks...")
embedder = SentenceTransformer(EMBEDDING_MODEL)
embeddings = embedder.encode(chunks)

# === Save Embeddings and FAISS Index ===
print("Saving embeddings and FAISS index...")
np.save(EMBEDDINGS_FILE, embeddings)

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

faiss.write_index(index, INDEX_FILE)
print(f"Index saved to {INDEX_FILE} and embeddings saved to {EMBEDDINGS_FILE}")
