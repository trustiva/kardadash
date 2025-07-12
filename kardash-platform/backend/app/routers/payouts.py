from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter()

class PayoutMethod(BaseModel):
    id: str
    name: str
    type: str
    address: str

class PayoutRequest(BaseModel):
    amount: float
    method_id: str

@router.get("/methods")
async def get_payout_methods(db: Session = Depends(get_db)):
    """Get available payout methods"""
    # TODO: Implement payout methods logic
    return [
        {
            "id": "1",
            "name": "Bitcoin Wallet",
            "type": "bitcoin",
            "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        },
        {
            "id": "2", 
            "name": "Ethereum Wallet",
            "type": "ethereum",
            "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
        }
    ]

@router.post("/request")
async def request_payout(payout: PayoutRequest, db: Session = Depends(get_db)):
    """Request a payout"""
    # TODO: Implement payout request logic
    return {"message": "Payout request submitted successfully", "request_id": "temp_id"}

@router.get("/history")
async def get_payout_history(db: Session = Depends(get_db)):
    """Get payout transaction history"""
    # TODO: Implement payout history logic
    return [] 