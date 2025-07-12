from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from ..database import get_db
from ..models import Job, JobApplication, User, Bot, BotActivity
from ..schemas import AutoApplyConfig, AutoApplyResponse, AutoApplyStats
from ..routers.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/auto-applier", tags=["Auto Applier"])

# Using schemas from schemas.py

# Routes
@router.post("/configure")
def configure_auto_applier(
    config: AutoApplyConfig,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Configure auto-applier settings for current user"""
    # Store configuration in user preferences or bot config
    # For now, return success message
    return {
        "message": "Auto-applier configuration updated",
        "config": config.dict()
    }

@router.get("/config")
def get_auto_applier_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's auto-applier configuration"""
    # Mock configuration
    return {
        "keywords": ["React", "Python", "Web Development"],
        "min_budget": 100.0,
        "max_budget": 5000.0,
        "platforms": ["Upwork", "Fiverr", "Freelancer"],
        "auto_apply": True,
        "custom_proposal_template": "I'm interested in this project and have relevant experience..."
    }

@router.post("/start")
def start_auto_applier(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start auto-applier for current user"""
    # Create or update bot for user
    bot_name = f"auto_applier_{current_user.id}"
    existing_bot = db.query(Bot).filter(Bot.name == bot_name).first()
    
    if existing_bot:
        existing_bot.status = BotStatus.ACTIVE
        existing_bot.last_active = datetime.utcnow()
    else:
        config = {
            "user_id": current_user.id,
            "keywords": ["React", "Python", "Web Development"],
            "min_budget": 100.0,
            "max_budget": 5000.0,
            "platforms": ["Upwork", "Fiverr", "Freelancer"]
        }
        
        new_bot = Bot(
            name=bot_name,
            platform="auto_applier",
            status=BotStatus.ACTIVE,
            config=json.dumps(config),
            last_active=datetime.utcnow()
        )
        db.add(new_bot)
    
    db.commit()
    
    # Log activity
    activity = BotActivity(
        bot_id=existing_bot.id if existing_bot else new_bot.id,
        activity_type="start",
        details=json.dumps({"user_id": current_user.id, "action": "started_auto_applier"})
    )
    db.add(activity)
    db.commit()
    
    return {"message": "Auto-applier started successfully"}

@router.post("/stop")
def stop_auto_applier(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Stop auto-applier for current user"""
    bot_name = f"auto_applier_{current_user.id}"
    bot = db.query(Bot).filter(Bot.name == bot_name).first()
    
    if bot:
        bot.status = BotStatus.INACTIVE
        db.commit()
        
        # Log activity
        activity = BotActivity(
            bot_id=bot.id,
            activity_type="stop",
            details=json.dumps({"user_id": current_user.id, "action": "stopped_auto_applier"})
        )
        db.add(activity)
        db.commit()
    
    return {"message": "Auto-applier stopped successfully"}

@router.get("/status")
def get_auto_applier_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get auto-applier status for current user"""
    bot_name = f"auto_applier_{current_user.id}"
    bot = db.query(Bot).filter(Bot.name == bot_name).first()
    
    if bot:
        return {
            "active": bot.status == BotStatus.ACTIVE,
            "last_active": bot.last_active,
            "jobs_scraped": bot.jobs_scraped,
            "jobs_applied": bot.jobs_applied,
            "success_rate": bot.success_rate
        }
    else:
        return {
            "active": False,
            "last_active": None,
            "jobs_scraped": 0,
            "jobs_applied": 0,
            "success_rate": 0.0
        }

@router.get("/applications", response_model=List[AutoApplyResponse])
def get_auto_applications(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get auto-applied jobs for current user"""
    # Get user's applications
    applications = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    results = []
    for app in applications:
        job = db.query(Job).filter(Job.id == app.job_id).first()
        if job:
            results.append(AutoApplyResponse(
                job_id=job.id,
                job_title=job.title,
                platform=job.platform,
                budget=job.budget,
                applied=True,
                proposal=app.proposal,
                bid_amount=app.bid_amount,
                timestamp=app.created_at
            ))
    
    return results

@router.get("/stats", response_model=AutoApplyStats)
def get_auto_applier_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get auto-applier statistics for current user"""
    bot_name = f"auto_applier_{current_user.id}"
    bot = db.query(Bot).filter(Bot.name == bot_name).first()
    
    # Get user's applications
    applications = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    ).all()
    
    total_jobs_found = bot.jobs_scraped if bot else 0
    jobs_applied = len(applications)
    success_rate = (jobs_applied / total_jobs_found * 100) if total_jobs_found > 0 else 0
    
    # Calculate potential earnings
    total_earnings_potential = sum(app.bid_amount for app in applications if app.bid_amount)
    
    return AutoApplyStats(
        total_jobs_found=total_jobs_found,
        jobs_applied=jobs_applied,
        success_rate=success_rate,
        total_earnings_potential=total_earnings_potential,
        last_activity=bot.last_active if bot else None
    )

@router.post("/apply/{job_id}")
def manual_auto_apply(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually trigger auto-apply for a specific job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="Job is not open for applications")
    
    # Check if already applied
    existing_application = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.user_id == current_user.id
    ).first()
    
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    # Generate AI proposal (mock)
    proposal = f"I'm interested in your project '{job.title}'. I have relevant experience and can deliver high-quality results within your budget and timeline."
    bid_amount = job.budget * 0.9  # 10% discount
    
    # Create application
    application = JobApplication(
        job_id=job_id,
        user_id=current_user.id,
        proposal=proposal,
        bid_amount=bid_amount
    )
    db.add(application)
    db.commit()
    
    return {
        "message": "Auto-application submitted successfully",
        "job_id": job_id,
        "proposal": proposal,
        "bid_amount": bid_amount
    }

@router.get("/suggestions")
def get_job_suggestions(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get job suggestions based on user's auto-applier configuration"""
    # Mock job suggestions based on user preferences
    suggestions = db.query(Job).filter(
        Job.status == JobStatus.OPEN,
        Job.budget >= 100,
        Job.budget <= 5000
    ).limit(limit).all()
    
    return [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description[:200] + "..." if len(job.description) > 200 else job.description,
            "budget": job.budget,
            "platform": job.platform,
            "is_urgent": job.is_urgent,
            "match_score": 0.85  # Mock match score
        }
        for job in suggestions
    ] 