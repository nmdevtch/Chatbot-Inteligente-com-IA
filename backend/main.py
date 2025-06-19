from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Lead
from pydantic import BaseModel
from datetime import datetime
from typing import List

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Permite qualquer origem (libera CORS)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 TOKEN simples (altere para sua senha segura)
API_TOKEN = "Admin123"

# ✅ Conexão com o banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Schema para entrada de dados (POST)
class LeadCreate(BaseModel):
    nome: str
    telefone: str
    idade: str
    email: str
    cidade: str

# ✅ Schema para resposta (GET)
class LeadResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    idade: str
    email: str
    cidade: str
    datahora: datetime

    class Config:
        orm_mode = True

# 🏠 Rota inicial para teste
@app.get("/")
def read_root():
    return {
        "message": "API do Chatbot Inteligente está online!"
    }

# 🚀 Endpoint para receber dados (Cadastrar lead)
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

# 📊 Endpoint para listar os leads (Dashboard)
@app.get("/leads", response_model=List[LeadResponse])
def get_leads(authorization: str = Header(None), db: Session = Depends(get_db)):
    # 🔐 Verifica o token
    if authorization != API_TOKEN:
        raise HTTPException(status_code=401, detail="Não autorizado")
    # 🔍 Busca no banco
    leads = db.query(Lead).order_by(Lead.datahora.desc()).all()
    return leads
