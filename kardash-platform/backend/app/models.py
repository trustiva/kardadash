from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    FREELANCER = "freelancer"
    ADMIN = "admin"

class JobStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class BotStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.FREELANCER)
    is_active = Column(Boolean, default=True)
    skill_tags = Column(Text)  # Comma-separated skills
    hourly_rate = Column(Float, default=0.0)
    total_earnings = Column(Float, default=0.0)
    rating = Column(Float, default=0.0)
    completed_jobs = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    jobs = relationship("Job", back_populates="user")
    applications = relationship("JobApplication", back_populates="user")
    bot_accounts = relationship("BotAccount", back_populates="owner")
    jobs_assigned = relationship("Job", back_populates="assigned_to_user", foreign_keys="Job.assigned_to_user_id")
    notifications = relationship("Notification", back_populates="user")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    budget = Column(Float)
    platform = Column(String)
    status = Column(String, default="available")  # "available", "in_progress", "delivered", "completed", "cancelled"
    original_platform_job_id = Column(String, unique=True, index=True)  # ID on original platform
    bot_account_id = Column(Integer, ForeignKey("bot_accounts.id"))
    assigned_to_user_id = Column(Integer, ForeignKey("users.id"))
    commission_rate = Column(Float, default=0.08)  # 8% default
    client_response = Column(Text)  # Response from original client
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    delivery_notes = Column(Text)
    delivery_files_url = Column(Text)
    client_feedback = Column(Text)
    freelancer_rating = Column(Float)  # Rating given by admin/client to freelancer
    completed_at = Column(DateTime(timezone=True))  # When job was completed
    deadline = Column(DateTime(timezone=True))
    type = Column(String)  # "fixed", "hourly", "recurring"
    tags = Column(Text)  # Comma-separated tags
    urgency = Column(String, default="medium")  # "low", "medium", "high", "urgent"
    client_rating = Column(Float)
    estimated_hours = Column(String)
    is_urgent = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="jobs")
    applications = relationship("JobApplication", back_populates="job")
    bot_account = relationship("BotAccount", back_populates="jobs_applied")
    assigned_to_user = relationship("User", back_populates="jobs_assigned", foreign_keys=[assigned_to_user_id])

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    proposal = Column(Text)
    bid_amount = Column(Float)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="applications")
    user = relationship("User", back_populates="applications")

class BotAccount(Base):
    __tablename__ = "bot_accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    platform = Column(String, nullable=False)  # e.g., "Upwork", "Fiverr", "LinkedIn"
    status = Column(String, default="active")  # "active", "paused", "disabled"
    jobs_applied = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    last_activity = Column(DateTime(timezone=True), onupdate=func.now())
    profile = Column(Text)  # Bot's profile description/credentials
    owner_id = Column(Integer, ForeignKey("users.id"))  # Optional: if bots can be owned by specific admins
    config = Column(Text)  # JSON configuration
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="bot_accounts")
    jobs_applied = relationship("Job", back_populates="bot_account")

class Bot(Base):
    __tablename__ = "bots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    platform = Column(String)
    status = Column(Enum(BotStatus), default=BotStatus.INACTIVE)
    config = Column(Text)  # JSON configuration
    last_active = Column(DateTime(timezone=True))
    success_rate = Column(Float, default=0.0)
    jobs_scraped = Column(Integer, default=0)
    jobs_applied = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BotActivity(Base):
    __tablename__ = "bot_activities"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    activity_type = Column(String)  # scrape, apply, error
    details = Column(Text)  # JSON details
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # e.g., "job_accepted", "payment", "deadline"
    message = Column(Text, nullable=False)
    time = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="notifications")

class DashboardStats(Base):
    __tablename__ = "dashboard_stats"

    id = Column(Integer, primary_key=True, index=True)
    total_jobs = Column(Integer, default=0)
    active_jobs = Column(Integer, default=0)
    total_users = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    monthly_earnings = Column(Float, default=0.0)
    commission_rate = Column(Float, default=0.15)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 