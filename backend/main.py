from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Instância da aplicação
app = FastAPI(
    title="ChatBot Inteligente - IA",
    description="API de Chat Simples com FastAPI",
    version="1.0.0"
)

# Configuração de CORS (permite requisições externas)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Troque por ['https://seusite.com'] em produção para mais segurança
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo da mensagem recebida
class Message(BaseModel):
    message: str

# Rota principal
@app.get("/")
def read_root():
    return {"message": "🚀 API do ChatBot Inteligente está rodando perfeitamente!"}

# Endpoint do chatbot
@app.post("/chat")
def chat_endpoint(msg: Message):
    user_message = msg.message.lower().strip()

    # Respostas simples baseadas em palavras-chave
    if any(greeting in user_message for greeting in ["oi", "olá", "opa", "eae"]):
        response = "Olá! 👋 Como posso te ajudar hoje?"
    elif "tempo" in user_message:
        response = "🌤️ Hoje está um dia bonito! (Pelo menos aqui no servidor... 😄)"
    elif "seu nome" in user_message or "quem é você" in user_message:
        response = "🤖 Eu sou o ChatBot Inteligente criado pelo Natã!"
    elif "tchau" in user_message or "até" in user_message:
        response = "👋 Até mais! Volte quando quiser."
    else:
        response = "❓ Desculpe, ainda estou aprendendo. Pode reformular sua pergunta?"

    return {"response": response}
