# recommend_app/services/embedding.py
from openai import OpenAI
from config.config import OPENAI_API_KEY, EMBEDDING_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

def get_embedding(text: str, model: str = EMBEDDING_MODEL):
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding
