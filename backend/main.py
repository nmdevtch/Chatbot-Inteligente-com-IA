from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🚀 Habilitar CORS para aceitar requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Endpoint para o chatbot
@app.post("/chat")
async def chat(message: dict):
    user_message = message.get("message", "").lower().strip()

    if any(greet in user_message for greet in ["oi", "olá", "opa", "eae"]):
        response = "👋 Olá! Como posso te ajudar hoje?"

    elif "tempo" in user_message:
        response = "🌤️ Aqui no servidor está sempre ensolarado! 😄"

    elif any(q in user_message for q in ["seu nome", "quem é você"]):
        response = "🤖 Eu sou o ChatBot Inteligente, criado pelo Natã!"

    elif any(f in user_message for f in ["tchau", "até", "falou"]):
        response = "👋 Até mais! Foi um prazer conversar com você."

    else:
        response = "❓ Desculpe, ainda estou aprendendo. Pode reformular sua pergunta?"

    return {"response": response}
