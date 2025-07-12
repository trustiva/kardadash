from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from ..database import get_db
from ..models import Bot, BotStatus, BotActivity, User
from ..schemas import BotCreate, BotUpdate, BotResponse, BotActivityResponse
from ..routers.auth import get_current_admin_user

router = APIRouter(prefix="/bots", tags=["Bots"])

# Using schemas from schemas.py

# Routes
@router.get("/", response_model=List[BotResponse])
def get_bots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all bots (admin only)"""
    bots = db.query(Bot).all()
    return bots

@router.post("/", response_model=BotResponse)
def create_bot(
    bot: BotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new bot (admin only)"""
    # Check if bot name already exists
    existing_bot = db.query(Bot).filter(Bot.name == bot.name).first()
    if existing_bot:
        raise HTTPException(status_code=400, detail="Bot name already exists")
    
    db_bot = Bot(
        name=bot.name,
        platform=bot.platform,
        config=json.dumps(bot.config),
        status=BotStatus.INACTIVE
    )
    db.add(db_bot)
    db.commit()
    db.refresh(db_bot)
    return db_bot

@router.get("/{bot_id}", response_model=BotResponse)
def get_bot(
    bot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get a specific bot (admin only)"""
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot

@router.put("/{bot_id}", response_model=BotResponse)
def update_bot(
    bot_id: int,
    bot_update: BotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a bot (admin only)"""
    db_bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if db_bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    update_data = bot_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "config" and value is not None:
            setattr(db_bot, field, json.dumps(value))
        else:
            setattr(db_bot, field, value)
    
    db.commit()
    db.refresh(db_bot)
    return db_bot

@router.delete("/{bot_id}")
def delete_bot(
    bot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a bot (admin only)"""
    db_bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if db_bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    db.delete(db_bot)
    db.commit()
    return {"message": "Bot deleted successfully"}

@router.post("/{bot_id}/start")
def start_bot(
    bot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Start a bot (admin only)"""
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    bot.status = BotStatus.ACTIVE
    bot.last_active = datetime.utcnow()
    db.commit()
    
    # Log activity
    activity = BotActivity(
        bot_id=bot_id,
        activity_type="start",
        details=json.dumps({"status": "started"})
    )
    db.add(activity)
    db.commit()
    
    return {"message": f"Bot {bot.name} started successfully"}

@router.post("/{bot_id}/stop")
def stop_bot(
    bot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Stop a bot (admin only)"""
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    bot.status = BotStatus.INACTIVE
    db.commit()
    
    # Log activity
    activity = BotActivity(
        bot_id=bot_id,
        activity_type="stop",
        details=json.dumps({"status": "stopped"})
    )
    db.add(activity)
    db.commit()
    
    return {"message": f"Bot {bot.name} stopped successfully"}

@router.get("/{bot_id}/activities", response_model=List[BotActivityResponse])
def get_bot_activities(
    bot_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get bot activities (admin only)"""
    activities = db.query(BotActivity).filter(
        BotActivity.bot_id == bot_id
    ).order_by(BotActivity.created_at.desc()).limit(limit).all()
    return activities

@router.get("/stats/overview")
def get_bots_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get bots overview statistics (admin only)"""
    total_bots = db.query(Bot).count()
    active_bots = db.query(Bot).filter(Bot.status == BotStatus.ACTIVE).count()
    total_jobs_scraped = db.query(Bot).with_entities(
        db.func.sum(Bot.jobs_scraped)
    ).scalar() or 0
    total_jobs_applied = db.query(Bot).with_entities(
        db.func.sum(Bot.jobs_applied)
    ).scalar() or 0
    
    return {
        "total_bots": total_bots,
        "active_bots": active_bots,
        "total_jobs_scraped": total_jobs_scraped,
        "total_jobs_applied": total_jobs_applied
    } 