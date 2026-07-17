import os
from pathlib import Path
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from langchain_qdrant import QdrantVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

# Load environment variables (including HUGGINGFACEHUB_API_TOKEN)
load_dotenv()

# 1. Initialize Qdrant Client (Persists locally inside your ai-agents directory)
BASE_DIR = Path(__file__).resolve().parents[1]
client = QdrantClient(path=str(BASE_DIR / "qdrant_local_db"))
COLLECTION_NAME = "resolveai_faq"
SEED_DATA = [
    Document(
        page_content="ResolveAI's return policy allows customers to return products within 30 days of purchase. Refunds are processed within 5-7 business days.",
        metadata={"category": "billing"}
    ),
    Document(
        page_content="To track your order, navigate to the Dashboard 'Orders' section, enter your Order ID, or query the ResolveAI tracking router.",
        metadata={"category": "shipping"}
    ),
    Document(
        page_content="ResolveAI technical support can be reached via email at support@resolveai.com or through our live Agent Core console.",
        metadata={"category": "support"}
    )
]

# 2. Initialize Hugging Face Embeddings (Explicitly pass token to override expired ones)
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"token": hf_token}  # Force using your active token!
)

def get_retriever():
    try:
        client.get_collection(COLLECTION_NAME)
    except Exception:
        print(f"Creating fresh Qdrant collection: {COLLECTION_NAME}...")
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding=embeddings
    )

    try:
        document_count = client.count(collection_name=COLLECTION_NAME, exact=True).count
    except Exception:
        document_count = 0

    if document_count == 0:
        vector_store.add_documents(SEED_DATA)
        print("Successfully seeded collection with default system documents.")

    return vector_store.as_retriever(search_kwargs={"k": 2})
