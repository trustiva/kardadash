from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import create_db_and_tables, get_db
from .models import User
from .routers import jobs, bots, auth, users, dashboard, auto_applier, bot_accounts, notifications

app = FastAPI(
    title="KARDASH API",
    description="Backend API for the KARDASH AI-powered freelance aggregator platform.",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup (for development, use Alembic for production)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(bots.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(auto_applier.router)  # New router for auto-applier bot
app.include_router(bot_accounts.router)  # Bot accounts management
app.include_router(notifications.router)  # User notifications

@app.get("/")
async def root():
    return {"message": "Welcome to KARDASH API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Example protected route (for testing)
@app.get("/protected-test")
def protected_route(current_user: User = Depends(auth.get_current_user)):
    return {"message": f"Hello {current_user.name}, you are a {current_user.role}!"}

@app.get("/admin-protected-test")
def admin_protected_route(current_user: User = Depends(auth.get_current_admin_user)):
    return {"message": f"Hello Admin {current_user.name}, you have admin access!"} 