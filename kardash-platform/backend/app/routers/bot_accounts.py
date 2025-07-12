from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from ..database import get_db
from ..models import BotAccount, User
from ..schemas import BotAccountCreate, BotAccountUpdate, BotAccountResponse
from ..routers.auth import get_current_admin_user, get_current_user

router = APIRouter(prefix="/bot-accounts", tags=["Bot Accounts"])

# Routes
@router.get("/", response_model=List[BotAccountResponse])
def get_bot_accounts(
    skip: int = 0,
    limit: int = 100,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all bot accounts (admin only)"""
    query = db.query(BotAccount)
    
    if platform:
        query = query.filter(BotAccount.platform == platform)
    if status:
        query = query.filter(BotAccount.status == status)
    
    bot_accounts = query.offset(skip).limit(limit).all()
    return bot_accounts

@router.post("/", response_model=BotAccountResponse)
def create_bot_account(
    bot_account: BotAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new bot account (admin only)"""
    # Check if bot account name already exists
    existing_bot = db.query(BotAccount).filter(BotAccount.name == bot_account.name).first()
    if existing_bot:
        raise HTTPException(status_code=400, detail="Bot account name already exists")
    
    db_bot_account = BotAccount(
        name=bot_account.name,
        platform=bot_account.platform,
        profile=bot_account.profile,
        owner_id=current_user.id
    )
    db.add(db_bot_account)
    db.commit()
    db.refresh(db_bot_account)
    return db_bot_account

@router.get("/{bot_account_id}", response_model=BotAccountResponse)
def get_bot_account(
    bot_account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get a specific bot account (admin only)"""
    bot_account = db.query(BotAccount).filter(BotAccount.id == bot_account_id).first()
    if bot_account is None:
        raise HTTPException(status_code=404, detail="Bot account not found")
    return bot_account

@router.put("/{bot_account_id}", response_model=BotAccountResponse)
def update_bot_account(
    bot_account_id: int,
    bot_account_update: BotAccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a bot account (admin only)"""
    db_bot_account = db.query(BotAccount).filter(BotAccount.id == bot_account_id).first()
    if db_bot_account is None:
        raise HTTPException(status_code=404, detail="Bot account not found")
    
    update_data = bot_account_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_bot_account, field, value)
    
    db.commit()
    db.refresh(db_bot_account)
    return db_bot_account

@router.delete("/{bot_account_id}")
def delete_bot_account(
    bot_account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a bot account (admin only)"""
    db_bot_account = db.query(BotAccount).filter(BotAccount.id == bot_account_id).first()
    if db_bot_account is None:
        raise HTTPException(status_code=404, detail="Bot account not found")
    
    db.delete(db_bot_account)
    db.commit()
    return {"message": "Bot account deleted successfully"}

@router.post("/{bot_account_id}/activate")
def activate_bot_account(
    bot_account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Activate a bot account (admin only)"""
    bot_account = db.query(BotAccount).filter(BotAccount.id == bot_account_id).first()
    if bot_account is None:
        raise HTTPException(status_code=404, detail="Bot account not found")
    
    bot_account.status = "active"
    db.commit()
    return {"message": f"Bot account {bot_account.name} activated successfully"}

@router.post("/{bot_account_id}/pause")
def pause_bot_account(
    bot_account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Pause a bot account (admin only)"""
    bot_account = db.query(BotAccount).filter(BotAccount.id == bot_account_id).first()
    if bot_account is None:
        raise HTTPException(status_code=404, detail="Bot account not found")
    
    bot_account.status = "paused"
    db.commit()
    return {"message": f"Bot account {bot_account.name} paused successfully"}

@router.get("/stats/overview")
def get_bot_accounts_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get bot accounts overview statistics (admin only)"""
    total_bot_accounts = db.query(BotAccount).count()
    active_bot_accounts = db.query(BotAccount).filter(BotAccount.status == "active").count()
    paused_bot_accounts = db.query(BotAccount).filter(BotAccount.status == "paused").count()
    
    # Get total jobs applied by all bot accounts
    total_jobs_applied = db.query(BotAccount).with_entities(
        db.func.sum(BotAccount.jobs_applied)
    ).scalar() or 0
    
    # Calculate average success rate
    avg_success_rate = db.query(BotAccount).with_entities(
        db.func.avg(BotAccount.success_rate)
    ).scalar() or 0.0
    
    return {
        "total_bot_accounts": total_bot_accounts,
        "active_bot_accounts": active_bot_accounts,
        "paused_bot_accounts": paused_bot_accounts,
        "total_jobs_applied": total_jobs_applied,
        "average_success_rate": avg_success_rate
    } 