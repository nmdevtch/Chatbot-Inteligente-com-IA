from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# 🚀 Instância da aplicação FastAPI
app = FastAPI(
    title="ChatBot Inteligente - IA",
    description="API de Chat Simples com FastAPI",
    version="1.0.0"
)

# ✅ Configuração de CORS (permite requisições externas, como do frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 Em produção, troque por ['https://seusite.com']
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Modelo da requisição
class Message(BaseModel):
    message: str

# ✅ Rota de status (GET)
@app.get("/")
def read_root():
    return {"message": "🚀 API do ChatBot Inteligente está online e funcionando!"}

# ✅ Endpoint principal do chatbot (POST)
@app.post("/chat")
def chat_endpoint(msg: Message):
    user_message = msg.message.lower().strip()

    # 🔎 Respostas automáticas simples
    if any(greet in user_message for greet in ["oi", "olá", "opa", "eae"]):
        response = "👋 Olá! Como posso te ajudar hoje?"

    elif "tempo" in user_message:
        response = "🌤️ Aqui no servidor está sempre ensolarado! 😄"

    elif any(q in user_message for q in ["seu nome", "quem é você"]):
        response = "🤖 Eu sou o ChatBot Inteligente, criado pelo desenvolvedor Natã!"

    elif any(f in user_message for f in ["tchau", "até", "falou"]):
        response = "👋 Até mais! Foi um prazer conversar com você."

    else:
        response = "❓ Desculpe, ainda estou aprendendo. Poderia reformular sua pergunta?"

    return {"response": response}
