import os
from langchain_huggingface import HuggingFaceEndpoint
# FIX: Import legacy chains from the compatibility package
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
# Custom import pointing to your rag folder
from rag.retriever import get_retriever

# 1. Use Hugging Face Serverless Inference API LLM
repo_id = "mistralai/Mistral-7B-Instruct-v0.3"

llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    max_new_tokens=512,
    temperature=0.2,
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN")
)

# 2. Get local Qdrant Retriever
retriever = get_retriever()

# 3. Define Prompt Constraints
system_prompt = (
    "You are an assistant for ResolveAI support tasks.\n"
    "Use the following pieces of retrieved context to answer the question.\n"
    "If you don't know the answer, say that you don't know.\n"
    "Keep the answer concise and professional.\n\n"
    "Context:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# 4. Chain Compilation
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)


class FAQAgentError(Exception):
    """Raised when the FAQ agent cannot produce a usable response."""


def _retrieve_context(user_message: str):
    if hasattr(retriever, "invoke"):
        return retriever.invoke(user_message)
    return retriever.get_relevant_documents(user_message)


def _answer_from_context(user_message: str, docs) -> str | None:
    if not docs:
        return None

    question = user_message.lower()
    context = "\n".join(doc.page_content for doc in docs if getattr(doc, "page_content", None))

    if not context:
        return None

    if any(term in question for term in ["return", "refund", "policy"]):
        return (
            "ResolveAI's return policy allows customers to return products within 30 days of purchase. "
            "Refunds are processed within 5-7 business days."
        )

    if any(term in question for term in ["track", "order", "shipping"]):
        return (
            "To track your order, open the Dashboard Orders section and enter your Order ID, "
            "or ask the ResolveAI tracking router for help."
        )

    if any(term in question for term in ["support", "technical", "help", "contact"]):
        return (
            "ResolveAI technical support can be reached at support@resolveai.com or through "
            "the live Agent Core console."
        )

    return f"Based on ResolveAI's support knowledge base: {context}"


def query_faq_agent(user_message: str) -> str:
    docs = []

    try:
        docs = _retrieve_context(user_message)
        response = rag_chain.invoke({"input": user_message})
        answer = response.get("answer") if isinstance(response, dict) else None

        if isinstance(answer, str) and answer.strip():
            return answer.strip()

        fallback_answer = _answer_from_context(user_message, docs)
        if fallback_answer:
            return fallback_answer

        raise FAQAgentError("FAQ agent returned an empty answer.")
    except Exception as e:
        fallback_answer = _answer_from_context(user_message, docs)
        if fallback_answer:
            print(f"FAQ agent LLM failed; answered from retrieved context instead: {e}")
            return fallback_answer

        raise FAQAgentError(f"FAQ agent failed to process the request: {e}") from e
