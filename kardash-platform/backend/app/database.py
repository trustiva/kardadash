from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from .config import settings

# Use psycopg2-binary for synchronous operations, or asyncpg for async
# For simplicity with initial setup, we'll use psycopg2-binary for now.
# If you want full async, you'd use `create_async_engine` from `sqlalchemy.ext.asyncio`
# and `async_sessionmaker` with `asyncpg`.

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables (for initial setup/migrations)
def create_db_and_tables():
    Base.metadata.create_all(engine) 