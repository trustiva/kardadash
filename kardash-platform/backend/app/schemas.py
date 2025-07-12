from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import UserRole, JobStatus, BotStatus

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.FREELANCER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    skill_tags: Optional[str] = None
    hourly_rate: Optional[float] = None
    # Add other fields that admin can update

class UserResponse(UserBase):
    id: int
    is_active: bool
    skill_tags: Optional[str] = None
    hourly_rate: float
    total_earnings: float
    rating: float
    completed_jobs: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For SQLAlchemy ORM compatibility

class UserInDB(UserBase):
    hashed_password: str

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    budget: str
    deadline: Optional[datetime] = None
    type: Optional[str] = None
    platform: Optional[str] = None  # Original platform: "Upwork", "Fiverr", etc.
    tags: Optional[str] = None  # Comma-separated string or JSON string
    urgency: Optional[str] = "medium"
    client_rating: Optional[float] = None
    estimated_hours: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[datetime] = None
    type: Optional[str] = None
    tags: Optional[str] = None
    urgency: Optional[str] = None
    is_urgent: Optional[bool] = None

class JobResponse(JobBase):
    id: int
    status: str
    original_platform_job_id: Optional[str] = None
    bot_account_id: Optional[int] = None
    assigned_to_user_id: Optional[int] = None
    commission_rate: float
    client_response: Optional[str] = None
    applied_at: Optional[datetime] = None
    delivery_notes: Optional[str] = None
    delivery_files_url: Optional[str] = None
    client_feedback: Optional[str] = None
    freelancer_rating: Optional[float] = None
    completed_at: Optional[datetime] = None
    is_urgent: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Job Application Schemas ---
class JobApplicationCreate(BaseModel):
    proposal: str
    bid_amount: float

class JobApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    proposal: str
    bid_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Bot Account Schemas ---
class BotAccountBase(BaseModel):
    name: str
    platform: str
    profile: Optional[str] = None

class BotAccountCreate(BotAccountBase):
    pass

class BotAccountUpdate(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    status: Optional[str] = None
    profile: Optional[str] = None
    config: Optional[str] = None

class BotAccountResponse(BotAccountBase):
    id: int
    status: str
    jobs_applied: int
    success_rate: float
    last_activity: Optional[datetime] = None
    owner_id: Optional[int] = None
    config: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Bot Schemas ---
class BotBase(BaseModel):
    name: str
    platform: str

class BotCreate(BotBase):
    config: dict

class BotUpdate(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    config: Optional[dict] = None
    status: Optional[BotStatus] = None

class BotResponse(BotBase):
    id: int
    status: BotStatus
    config: str
    last_active: Optional[datetime] = None
    success_rate: float
    jobs_scraped: int
    jobs_applied: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Bot Activity Schemas ---
class BotActivityResponse(BaseModel):
    id: int
    bot_id: int
    activity_type: str
    details: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationBase(BaseModel):
    type: str
    message: str

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    time: datetime
    is_read: bool

    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardStats(BaseModel):
    totalJobs: int
    activeJobs: int
    completedJobs: int
    totalUsers: int
    activeUsers: int
    totalEarnings: float
    pendingPayouts: float
    platformCommission: float
    successRate: float
    avgCompletionTime: float

class DashboardOverview(BaseModel):
    total_jobs: int
    active_jobs: int
    total_users: int
    total_earnings: float
    monthly_earnings: float
    commission_rate: float

class JobStats(BaseModel):
    total_jobs: int
    open_jobs: int
    in_progress_jobs: int
    completed_jobs: int
    urgent_jobs: int

class UserStats(BaseModel):
    total_users: int
    active_users: int
    freelancers: int
    admins: int
    new_users_this_month: int

class BotStats(BaseModel):
    total_bots: int
    active_bots: int
    total_jobs_scraped: int
    total_jobs_applied: int
    average_success_rate: float

class RecentActivity(BaseModel):
    id: int
    type: str
    title: str
    description: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Auto Applier Schemas ---
class AutoApplyConfig(BaseModel):
    keywords: List[str]
    min_budget: float
    max_budget: float
    platforms: List[str]
    auto_apply: bool = True
    custom_proposal_template: Optional[str] = None

class AutoApplyResponse(BaseModel):
    job_id: int
    job_title: str
    platform: str
    budget: float
    applied: bool
    proposal: Optional[str] = None
    bid_amount: Optional[float] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class AutoApplyStats(BaseModel):
    total_jobs_found: int
    jobs_applied: int
    success_rate: float
    total_earnings_potential: float
    last_activity: Optional[datetime]

# --- Authentication Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Earnings Schemas ---
class EarningsOverview(BaseModel):
    total_earnings: float
    monthly_earnings: float
    weekly_earnings: float
    daily_earnings: float
    commission_rate: float
    platform_fees: float
    net_earnings: float

class EarningsChart(BaseModel):
    labels: List[str]
    data: List[float]

# --- Job Completion Schemas ---
class JobCompletionCreate(BaseModel):
    feedback: str
    rating: float  # Rating given to freelancer (1-5)

class JobCompletionResponse(BaseModel):
    id: int
    status: str
    client_feedback: Optional[str] = None
    freelancer_rating: Optional[float] = None
    completed_at: Optional[datetime] = None
    payment_amount: float
    commission_amount: float

    class Config:
        from_attributes = True 

class JobAssignment(BaseModel):
    freelancer_id: int

class JobDelivery(BaseModel):
    notes: str
    files_url: str

class JobCompletion(BaseModel):
    feedback: str
    rating: float = Field(..., ge=1, le=5) 