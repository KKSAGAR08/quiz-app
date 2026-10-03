import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from functools import lru_cache


load_dotenv()


@lru_cache()
def get_llm():
    return ChatGroq(model_name="openai/gpt-oss-120b")

@lru_cache()
def get_embeddings():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")