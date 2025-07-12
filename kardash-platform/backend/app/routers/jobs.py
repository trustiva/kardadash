from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models import Job, JobStatus, User, JobApplication, Notification
from ..schemas import JobCreate, JobUpdate, JobResponse, JobApplicationCreate, JobApplicationResponse, JobCompletionCreate
from ..routers.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# Using schemas from schemas.py

# Routes
@router.get("/", response_model=List[JobResponse])
def get_jobs(
    skip: int = 0,
    limit: int = 100,
    status: Optional[JobStatus] = None,
    platform: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all jobs (admin only)"""
    query = db.query(Job)
    
    if status:
        query = query.filter(Job.status == status)
    if platform:
        query = query.filter(Job.platform == platform)
    if search:
        query = query.filter(Job.title.contains(search) | Job.description.contains(search))
    
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/available", response_model=List[JobResponse])
def get_available_jobs(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("created_at"),
    filter_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get available jobs for freelancers"""
    query = db.query(Job).filter(Job.status == JobStatus.OPEN)
    
    if search:
        query = query.filter(Job.title.contains(search) | Job.description.contains(search))
    if filter_type == "urgent":
        query = query.filter(Job.is_urgent == True)
    
    if sort_by == "budget-high":
        query = query.order_by(Job.budget.desc())
    elif sort_by == "budget-low":
        query = query.order_by(Job.budget.asc())
    else:
        query = query.order_by(Job.created_at.desc())
    
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/my", response_model=List[JobResponse])
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get jobs assigned to current freelancer"""
    jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    return jobs

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new job (admin only)"""
    db_job = Job(
        title=job.title,
        description=job.description,
        budget=job.budget,
        platform=job.platform,
        is_urgent=job.is_urgent,
        user_id=current_user.id
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a specific job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_update: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a job (admin only)"""
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_job, field, value)
    
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a job (admin only)"""
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}

@router.post("/{job_id}/apply", response_model=JobApplicationResponse)
def apply_for_job(
    job_id: int,
    application: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Apply for a job"""
    # Check if job exists and is open
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="Job is not open for applications")
    
    # Check if user already applied
    existing_application = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.user_id == current_user.id
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")
    
    # Create application
    db_application = JobApplication(
        job_id=job_id,
        user_id=current_user.id,
        proposal=application.proposal,
        bid_amount=application.bid_amount
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@router.post("/{job_id}/deliver")
def deliver_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit delivery for a job"""
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != JobStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Job is not in progress")
    
    job.status = "delivered"
    db.commit()
    return {"message": "Job delivered successfully"}

@router.post("/{job_id}/complete", response_model=JobResponse)
def complete_job(
    job_id: int,
    completion: JobCompletionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Complete a delivered job (admin only)"""
    from datetime import datetime, timezone
    
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if db_job.status != "delivered":
        raise HTTPException(
            status_code=400,
            detail=f"Job must be in 'delivered' status to complete. Current status: {db_job.status}"
        )
    
    # Calculate payment to freelancer (subtract commission)
    commission = db_job.commission_rate if db_job.commission_rate else 0.08  # Default 8%
    payment_amount = float(db_job.budget) * (1 - commission)
    
    update_data = {
        "status": "completed",
        "client_feedback": completion.feedback,
        "freelancer_rating": completion.rating,
        "completed_at": datetime.now(timezone.utc)
    }
    
    # Update freelancer earnings
    db_freelancer = db.query(User).filter(User.id == db_job.assigned_to_user_id).first()
    if db_freelancer:
        db_freelancer.total_earnings = db_freelancer.total_earnings + payment_amount
        db_freelancer.completed_jobs = db_freelancer.completed_jobs + 1
    
    # Update job
    for field, value in update_data.items():
        setattr(db_job, field, value)
    
    db.commit()
    db.refresh(db_job)
    
    # Create notification for freelancer
    notification = Notification(
        user_id=db_job.assigned_to_user_id,
        type="job_completed",
        message=f"Your job '{db_job.title}' was completed. Earned: ${payment_amount:.2f}"
    )
    db.add(notification)
    db.commit()
    
    return db_job 