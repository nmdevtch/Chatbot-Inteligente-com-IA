from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Libera o CORS para acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Troque pelo seu domínio GitHub Pages para mais segurança
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/chat")
def chat(msg: Message):
    user_message = msg.message.lower()

    # Respostas simples baseadas em palavras-chave
    if "oi" in user_message or "olá" in user_message:
        response = "Olá! Como posso te ajudar?"
    elif "tempo" in user_message:
        response = "Hoje está um dia bonito!"
    elif "seu nome" in user_message:
        response = "Eu sou o ChatBot Inteligente desenvolvido pelo Natã!"
    else:
        response = "Desculpe, ainda estou aprendendo. Pode reformular sua pergunta?"

    return {"response": response}
