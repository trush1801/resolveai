# 🤖 AI Customer Support Agent

> An enterprise-grade AI customer support platform powered by LangGraph multi-agent orchestration, RAG over company documentation, automated ticket generation, and real-time human escalation.

---


## 📁 Project Structure

```
ai-customer-support/
├── frontend/               # React + Tailwind + Shadcn UI
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── FileUpload.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── TicketTable.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── SatisfactionChart.jsx
│   │   │   └── Admin/
│   │   │       ├── KnowledgeUpload.jsx
│   │   │       └── AgentMonitor.jsx
│   │   ├── pages/
│   │   │   ├── CustomerChat.jsx
│   │   │   ├── SupportDashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── backend/                # Node.js + Express (API Gateway & Auth)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js           # Login, register, JWT issue
│   │   │   ├── chat.js           # Receive chat, forward to ai-agents
│   │   │   ├── tickets.js        # Ticket CRUD
│   │   │   ├── knowledge.js      # File upload handler
│   │   │   └── dashboard.js      # Stats aggregation
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── ticketController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verify
│   │   │   ├── upload.js         # Multer file upload
│   │   │   └── errorHandler.js
│   │   ├── models/               # Mongoose / Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   └── ChatSession.js
│   │   ├── config/
│   │   │   └── db.js             # MongoDB + PostgreSQL connections
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── ai-agents/              # LangGraph Agent Logic
│   ├── agents/
│   │   ├── faq_agent.py
│   │   ├── billing_agent.py
│   │   ├── order_agent.py
│   │   ├── ticket_agent.py
│   │   ├── sentiment_agent.py
│   │   └── escalation_agent.py
│   ├── graph/
│   │   ├── workflow.py        # LangGraph state machine
│   │   └── state.py           # Shared state schema
│   ├── rag/
│   │   ├── embedder.py        # Embed docs into Qdrant
│   │   ├── retriever.py       # Semantic search
│   │   └── loader.py          # PDF / text ingestion
│   ├── memory/
│   │   └── conversation.py    # Short-term memory per session
│   ├── tools/
│   │   ├── order_tools.py     # Mock order API calls
│   │   └── ticket_tools.py    # Ticket creation tools
│   ├── requirements.txt
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

## 🧠 System Architecture

```
Customer (Browser)
       │
       ▼
React Frontend (Chat UI + Dashboard + Admin)
       │
       ▼
Node.js + Express Backend (Auth, REST APIs, File Upload)
       │
       ▼
LangGraph Agent Workflow
  ┌──────────┬──────────┬──────────┬──────────┐
  ▼          ▼          ▼          ▼          ▼
FAQ       Billing    Order     Ticket   Sentiment
Agent     Agent      Agent     Agent     Agent
  └──────────┴──────────┴──────────┴──────────┘
                      │
                      ▼
           Qdrant Vector Database
                      │
                      ▼
          Company Knowledge Base
          (PDFs, Policies, FAQs)
                      │
                      ▼
           LLM (Groq / OpenAI)
```

---

## ✨ Features

### 1. AI Chat Interface
- Customers type queries naturally ("I forgot my password", "My order hasn't arrived")
- AI responds using retrieved knowledge — no hallucinations
- Supports file attachment for order screenshots or receipts

### 2. RAG Knowledge Base
- Upload PDFs, manuals, company policies, and FAQs via Admin Panel
- Documents are chunked, embedded, and stored in Qdrant
- Each AI response is grounded in real documentation

### 3. Multi-Agent Orchestration (LangGraph)
| Agent | Responsibility |
|---|---|
| FAQ Agent | Answers general policy and documentation questions |
| Billing Agent | Handles refunds, invoices, payment failures |
| Order Agent | Checks real-time order status via API tool calls |
| Ticket Agent | Auto-creates support tickets with priority and category |
| Sentiment Agent | Detects frustration and escalates priority automatically |
| Escalation Agent | Routes to human support with context summary |

### 4. Conversation Memory
- Each session retains full chat history
- AI understands references ("What warranty does it have?" after "I bought a laptop")

### 5. Automated Ticket Generation
- When AI cannot resolve: auto-creates ticket with
  - Priority level
  - Category (Billing / Technical / Shipping)
  - AI-generated summary and suggested fix

### 6. Human Escalation
- Confidence score threshold (default: 70%)
- Sends full chat history + AI summary to human agent
- Includes suggested resolution steps

### 7. Support Dashboard (Manager View)
- Today's tickets (resolved vs escalated)
- AI resolution rate
- Average response time
- Customer satisfaction scores
- Top 10 most asked questions

### 8. Admin Panel
- Upload knowledge base documents
- Monitor active agents
- Configure escalation thresholds
- View agent decision logs

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Shadcn UI |
| Backend | Node.js, Express.js, Multer (file upload) |
| Auth | JWT (jsonwebtoken), bcrypt |
| AI Agents | FastAPI (Python), LangGraph, LangChain |
| LLM | OpenAI GPT-4o / Groq (Llama 3) |
| Vector DB | Qdrant |
| Database | PostgreSQL (tickets/users via Sequelize), MongoDB (chat logs via Mongoose) |
| Deployment | Docker, Docker Compose, Render / Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- OpenAI or Groq API key
- Qdrant (local via Docker or Qdrant Cloud)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-customer-support.git
cd ai-customer-support
```

### 2. Set up environment variables

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5001
```

**backend/.env**
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/support_db
POSTGRES_URL=postgresql://user:password@localhost/support_tickets
JWT_SECRET=your_jwt_secret_key
AI_AGENTS_URL=http://localhost:8001
```

**ai-agents/.env**
```
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=support_kb
```

### 3. Start with Docker Compose
```bash
docker-compose up --build
```

This starts:
- React frontend on `http://localhost:5173`
- Node.js/Express backend on `http://localhost:5001`
- FastAPI AI Agents service on `http://localhost:8001`
- Qdrant on `http://localhost:6333`
- PostgreSQL on port `5432`
- MongoDB on port `27017`

### 4. Manual setup (without Docker)

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend (Node.js + Express)**
```bash
cd backend
npm install
npm run dev       # uses nodemon
```

**AI Agents (FastAPI + Python)**
```bash
cd ai-agents
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

## 📦 Key Dependencies

### backend/package.json (Node.js + Express)
```json
{
  "dependencies": {
    "express": "^4.19.0",
    "mongoose": "^8.4.0",
    "sequelize": "^6.37.0",
    "pg": "^8.11.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "axios": "^1.7.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express-validator": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

### ai-agents/requirements.txt
```
langgraph>=0.2.0
langchain>=0.3.0
langchain-openai>=0.2.0
langchain-groq>=0.2.0
qdrant-client>=1.11.0
fastapi>=0.115.0
uvicorn>=0.30.0
pydantic>=2.7.0
python-dotenv>=1.0.0
pypdf>=4.3.0
sentence-transformers>=3.2.0
```

### frontend/package.json (key deps)
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "tailwindcss": "^3.4.0",
    "axios": "^1.7.0",
    "recharts": "^2.12.0",
    "@radix-ui/react-dialog": "^1.1.0"
  }
}
```

---

## 🔌 API Endpoints (Node.js + Express Backend)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Customer / admin login → returns JWT |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/chat/message` | Send message → forwards to ai-agents |
| GET | `/api/chat/history/:sessionId` | Fetch chat history |
| GET | `/api/tickets` | List all tickets |
| POST | `/api/tickets` | Create ticket manually |
| PATCH | `/api/tickets/:id` | Update ticket status |
| POST | `/api/knowledge/upload` | Upload PDF to knowledge base (Multer) |
| GET | `/api/dashboard/stats` | Manager dashboard stats |

### Example Express route — chat.js
```javascript
// backend/src/routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/message', verifyToken, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Forward to FastAPI AI agents service
    const agentResponse = await axios.post(
      `${process.env.AI_AGENTS_URL}/agent/chat`,
      { message, session_id: sessionId, user_id: req.user.id }
    );

    // Save to MongoDB
    await ChatSession.findOneAndUpdate(
      { sessionId },
      { $push: { messages: { role: 'user', content: message },
                 { role: 'assistant', content: agentResponse.data.reply } } },
      { upsert: true }
    );

    res.json(agentResponse.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

## 🧩 Agent Workflow (LangGraph)

```python
# ai-agents/graph/workflow.py (simplified)

from langgraph.graph import StateGraph, END
from agents.sentiment_agent import detect_sentiment
from agents.faq_agent import answer_faq
from agents.order_agent import check_order
from agents.billing_agent import handle_billing
from agents.ticket_agent import create_ticket
from agents.escalation_agent import escalate_to_human

def route_query(state):
    intent = state["intent"]
    if state["sentiment"] == "angry":
        return "escalate"
    if intent == "faq":
        return "faq"
    if intent == "order":
        return "order"
    if intent == "billing":
        return "billing"
    return "ticket"

workflow = StateGraph(SupportState)
workflow.add_node("sentiment", detect_sentiment)
workflow.add_node("faq", answer_faq)
workflow.add_node("order", check_order)
workflow.add_node("billing", handle_billing)
workflow.add_node("ticket", create_ticket)
workflow.add_node("escalate", escalate_to_human)

workflow.set_entry_point("sentiment")
workflow.add_conditional_edges("sentiment", route_query)

app = workflow.compile()
```

---

## 📄 RAG Pipeline

```python
# ai-agents/rag/embedder.py (simplified)

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from qdrant_client import QdrantClient

def ingest_document(file_path: str, collection: str):
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings()
    vectors = embeddings.embed_documents([c.page_content for c in chunks])

    client = QdrantClient(url="http://localhost:6333")
    # upsert vectors into collection
    ...
```

---

## 🎯 Resume Bullet Points

```
• Built an enterprise AI customer support platform using LangGraph, RAG, and 
  multi-agent workflows capable of resolving customer queries through company 
  knowledge retrieval and automated ticket generation.

• Developed intelligent agent orchestration for FAQ resolution, billing support, 
  sentiment analysis, and human escalation, reducing manual support workload 
  through context-aware automation.

• Implemented semantic document search using Qdrant vector database and 
  LangChain, enabling accurate responses from company manuals, policies, 
  and support documentation.

• Designed a full-stack platform with React, FastAPI, and PostgreSQL, featuring 
  a real-time support dashboard and admin panel for knowledge base management.
```

---

## ❓ Expected Interview Questions

| Question | Concept Tested |
|---|---|
| Explain how RAG reduces hallucinations | RAG architecture |
| Why LangGraph over simple LangChain chains? | Agent orchestration |
| Why Qdrant over Pinecone or ChromaDB? | Vector DB tradeoffs |
| How do agents communicate state? | LangGraph state machine |
| How do you set the escalation threshold? | System design |
| How would you scale this to 10,000 users? | System scalability |

---

## 🚢 Deployment

```bash
# Build and deploy to Render (backend + ai-agents)
# Frontend auto-deploys to Vercel on git push

docker build -t ai-support-backend ./backend
docker build -t ai-support-agents ./ai-agents
```

Refer to `docker-compose.yml` for full service configuration.

---

## 📜 License

MIT License — free to use for portfolio and personal projects.
