# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Lead
from pydantic import BaseModel
from datetime import datetime

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Permite qualquer origem (frontend externo)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota raiz para testar se está funcionando
@app.get("/")
def read_root():
    return {"message": "API do Chatbot Inteligente está online! Vá para /docs para acessar a documentação."}

# Conexão com banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema do lead (entrada de dados)
class LeadCreate(BaseModel):
    nome: str
    telefone: str
    idade: str
    email: str
    cidade: str

# Endpoint para receber dados
@app.post("/lead")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = Lead(
        nome=lead.nome,
        telefone=lead.telefone,
        idade=lead.idade,
        email=lead.email,
        cidade=lead.cidade,
        datahora=datetime.utcnow()
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return {"message": "Lead salvo com sucesso!"}
