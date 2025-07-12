from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from sqlalchemy import func

from ..database import get_db
from ..models import User, Job, JobStatus, Bot, BotStatus, DashboardStats
from ..schemas import DashboardOverview, JobStats, UserStats, BotStats, RecentActivity
from ..routers.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Using schemas from schemas.py

# Routes
@router.get("/overview", response_model=DashboardOverview)
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get dashboard overview (admin only)"""
    # Get or create dashboard stats
    stats = db.query(DashboardStats).first()
    if not stats:
        stats = DashboardStats()
        db.add(stats)
        db.commit()
        db.refresh(stats)
    
    # Update stats with real data
    total_jobs = db.query(Job).count()
    active_jobs = db.query(Job).filter(Job.status == JobStatus.OPEN).count()
    total_users = db.query(User).count()
    
    # Calculate earnings (mock data for now)
    total_earnings = 15000.0
    monthly_earnings = 2500.0
    
    return DashboardOverview(
        total_jobs=total_jobs,
        active_jobs=active_jobs,
        total_users=total_users,
        total_earnings=total_earnings,
        monthly_earnings=monthly_earnings,
        commission_rate=stats.commission_rate
    )

@router.get("/jobs/stats", response_model=JobStats)
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get job statistics (admin only)"""
    total_jobs = db.query(Job).count()
    open_jobs = db.query(Job).filter(Job.status == JobStatus.OPEN).count()
    in_progress_jobs = db.query(Job).filter(Job.status == JobStatus.IN_PROGRESS).count()
    completed_jobs = db.query(Job).filter(Job.status == JobStatus.COMPLETED).count()
    urgent_jobs = db.query(Job).filter(Job.is_urgent == True).count()
    
    return JobStats(
        total_jobs=total_jobs,
        open_jobs=open_jobs,
        in_progress_jobs=in_progress_jobs,
        completed_jobs=completed_jobs,
        urgent_jobs=urgent_jobs
    )

@router.get("/users/stats", response_model=UserStats)
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get user statistics (admin only)"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    freelancers = db.query(User).filter(User.role == UserRole.FREELANCER).count()
    admins = db.query(User).filter(User.role == UserRole.ADMIN).count()
    
    # Count new users this month
    first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_users_this_month = db.query(User).filter(
        User.created_at >= first_day_of_month
    ).count()
    
    return UserStats(
        total_users=total_users,
        active_users=active_users,
        freelancers=freelancers,
        admins=admins,
        new_users_this_month=new_users_this_month
    )

@router.get("/bots/stats", response_model=BotStats)
def get_bot_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get bot statistics (admin only)"""
    total_bots = db.query(Bot).count()
    active_bots = db.query(Bot).filter(Bot.status == BotStatus.ACTIVE).count()
    total_jobs_scraped = db.query(func.sum(Bot.jobs_scraped)).scalar() or 0
    total_jobs_applied = db.query(func.sum(Bot.jobs_applied)).scalar() or 0
    
    # Calculate average success rate
    avg_success_rate = db.query(func.avg(Bot.success_rate)).scalar() or 0.0
    
    return BotStats(
        total_bots=total_bots,
        active_bots=active_bots,
        total_jobs_scraped=total_jobs_scraped,
        total_jobs_applied=total_jobs_applied,
        average_success_rate=avg_success_rate
    )

@router.get("/recent-activity", response_model=List[RecentActivity])
def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get recent activity (admin only)"""
    # This would typically combine activities from multiple sources
    # For now, return recent jobs
    recent_jobs = db.query(Job).order_by(Job.created_at.desc()).limit(limit).all()
    
    activities = []
    for job in recent_jobs:
        activities.append(RecentActivity(
            id=job.id,
            type="job_created",
            title=f"New job: {job.title}",
            description=f"Job created on {job.platform} with budget ${job.budget}",
            timestamp=job.created_at
        ))
    
    return activities

@router.get("/earnings/overview")
def get_earnings_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get earnings overview (admin only)"""
    # Mock earnings data
    return {
        "total_earnings": 15000.0,
        "monthly_earnings": 2500.0,
        "weekly_earnings": 600.0,
        "daily_earnings": 85.0,
        "commission_rate": 0.15,
        "platform_fees": 2250.0,
        "net_earnings": 12750.0
    }

@router.get("/earnings/chart")
def get_earnings_chart(
    period: str = "monthly",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get earnings chart data (admin only)"""
    # Mock chart data
    if period == "monthly":
        return {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [1200, 1800, 2200, 1900, 2500, 2800]
        }
    elif period == "weekly":
        return {
            "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
            "data": [500, 600, 700, 800]
        }
    else:  # daily
        return {
            "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "data": [100, 120, 90, 110, 130, 80, 95]
        }

@router.get("/freelancer/stats")
def get_freelancer_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get freelancer-specific statistics"""
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get freelancer's jobs
    my_jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    completed_jobs = [job for job in my_jobs if job.status == JobStatus.COMPLETED]
    active_jobs = [job for job in my_jobs if job.status == JobStatus.IN_PROGRESS]
    
    total_earnings = sum(job.budget for job in completed_jobs)
    success_rate = len(completed_jobs) / len(my_jobs) if my_jobs else 0
    
    return {
        "total_jobs": len(my_jobs),
        "completed_jobs": len(completed_jobs),
        "active_jobs": len(active_jobs),
        "total_earnings": total_earnings,
        "success_rate": success_rate,
        "average_job_value": total_earnings / len(completed_jobs) if completed_jobs else 0
    } 