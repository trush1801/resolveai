import os
import time
import shutil
from pathlib import Path
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load local .env variables before importing other modules
load_dotenv()

from agents.faq_agent import FAQAgentError, query_faq_agent
from rag.retriever import get_retriever, embeddings, COLLECTION_NAME, client
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_qdrant import QdrantVectorStore

# 1. Initialize the FastAPI app instance
app = FastAPI(
    title="ResolveAI Agents Engine",
    description="LangGraph Multi-Agent Orchestrator Platform API",
    version="1.0.0"
)

# 2. Enable CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Payload Schemas
class Message(BaseModel):
    role: str       # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

# 4. Telemetry Liveness Health Probe
@app.get("/health", status_code=200)
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "framework": "FastAPI integration ready",
        "orchestrator": "LangGraph setup clean"
    }

# 5. Production RAG FAQ Agent Endpoint
@app.post("/agent/chat")
async def agent_chat(payload: ChatRequest):
    try:
        user_message = payload.message.strip()

        if not user_message:
            raise HTTPException(status_code=400, detail="Message content is required.")

        bot_response = query_faq_agent(user_message)

        return {
            "status": "success",
            "response": bot_response
        }
    except FAQAgentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. PDF Ingestion Pipeline Endpoint
@app.post("/agent/upload-pdf")
async def upload_pdf_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Create a temporary directory structure to store the file for parsing
    tmp_dir = Path("./tmp")
    tmp_dir.mkdir(exist_ok=True)
    file_path = tmp_dir / file.filename
    
    try:
        # Save uploaded file to disk temporarily
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Load the PDF content
        loader = PyPDFLoader(str(file_path))
        documents = loader.load()
        
        if not documents:
            raise HTTPException(status_code=400, detail="The PDF file appears to be empty or unreadable.")
        
        # Chunk the text split structures accurately
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=600,
            chunk_overlap=120
        )
        chunks = text_splitter.split_documents(documents)
        
        # Inject directly into the existing Qdrant collection
        vector_store = QdrantVectorStore(
            client=client,
            collection_name=COLLECTION_NAME,
            embedding=embeddings
        )
        vector_store.add_documents(chunks)
        
        return {
            "status": "success",
            "message": f"Successfully processed '{file.filename}'.",
            "chunks_embedded": len(chunks)
        }
        
    except Exception as e:
        print(f"💥 PDF Ingestion Failure: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
        
    finally:
        # Clean up file text artifact out of tmp directory safely
        if file_path.exists():
            os.remove(file_path)