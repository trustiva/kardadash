# KARDASH Freelance Aggregator Platform

This repository contains the frontend components for the KARDASH AI-powered freelance aggregator platform.

## Project Overview

KARDASH is a modern platform that scrapes freelance jobs from various external platforms using bots and APIs. These jobs are then reposted internally, and automated applications are sent using AI-powered bot accounts. Once a client shows interest, the job is listed for local freelancers to pick up and complete. Upon successful delivery and client acceptance, KARDASH takes a commission and releases the payment to the freelancer.

## Tech Stack (Frontend)

*   **React.js**: For building the user interface.
*   **TailwindCSS**: For rapid and utility-first CSS styling.
*   **Lucide React**: For icons.

## Tech Stack (Backend)

*   **FastAPI**: High-performance web framework for building APIs with Python.
*   **SQLAlchemy**: Python SQL toolkit and Object Relational Mapper (ORM).
*   **PostgreSQL**: Robust relational database.
*   **Passlib**: For password hashing.
*   **Python-Jose**: For JSON Web Token (JWT) handling.

## Frontend Components

1.  **Landing Page (`/kardash-landing.tsx`)**:
    *   Auto-rotating banners showcasing platform features.
    *   Main action buttons ("Get Work", "Learn").
    *   Features and statistics sections.
    *   Dark/Light mode theme switcher.

2.  **Freelancer Dashboard (`/kardash-dashboard.tsx`)**:
    *   Personalized statistics (earnings, completed jobs, success rate).
    *   Tabs for "Available Jobs", "My Jobs", and "Earnings".
    *   Job listing with search, sort, and filter functionalities.
    *   Job detail modal.
    *   Payout methods section.

3.  **Admin Panel (`/kardash-admin-panel.tsx`)**:
    *   System-wide dashboard with key metrics.
    *   Job management (view, edit, delete, add new jobs).
    *   Bot account management (view, configure, activate/pause bots).
    *   Placeholder sections for User Management, Earnings, and Settings.

## API Endpoints (Backend)

The frontend components currently use mock data. The following API endpoints are implemented or planned for the backend:

### **Authentication & User System**
*   `POST /api/auth/register`: User registration.
*   `POST /api/auth/token`: User login (returns JWT token).
*   `GET /api/auth/me`: Fetch logged-in user's profile (protected).

### **Freelancer Dashboard**
*   `GET /api/jobs/available`: Fetch a list of available jobs.
    *   **Query Parameters**: `search`, `sortBy`, `filterType`
*   `GET /api/jobs/my`: Fetch jobs assigned to the current freelancer (protected).
*   `GET /api/user/stats`: Fetch the logged-in freelancer's dashboard statistics (protected).
*   `POST /api/jobs/{jobId}/apply`: Submit an application for a job (protected).
*   `POST /api/jobs/{jobId}/deliver`: Upload delivery files and notes for a job (protected).
*   `GET /api/payouts/methods`: Fetch available payout methods (protected).
*   `POST /api/payouts/request`: Request a payout to a specified method (protected).
*   `GET /api/payouts/history`: Fetch payout transaction history (protected).

### **Admin Panel**
*   `GET /api/admin/dashboard/stats`: Fetch overall system dashboard statistics (admin protected).
*   `GET /api/jobs/`: Fetch all jobs for admin management.
    *   **Query Parameters**: `status`, `search` (admin protected).
*   `POST /api/jobs/`: Add a new job manually (admin protected).
*   `PUT /api/jobs/{jobId}`: Edit an existing job (admin protected).
*   `DELETE /api/jobs/{jobId}`: Delete a job (admin protected).
*   `GET /api/admin/bots/`: Fetch a list of all bot accounts (admin protected).
*   `POST /api/admin/bots/`: Add a new bot account (admin protected).
*   `PUT /api/admin/bots/{botId}`: Update bot account settings (e.g., profile, status) (admin protected).
*   `DELETE /api/admin/bots/{botId}`: Delete a bot account (admin protected).
*   `GET /api/admin/users/`: Fetch a list of all users (admin protected).
    *   **Query Parameters**: `search`, `filterRole`, `filterStatus`
*   `GET /api/admin/users/{userId}`: Fetch a specific user by ID (admin protected).
*   `PUT /api/admin/users/{userId}`: Update a user's details (admin protected).
*   `DELETE /api/admin/users/{userId}`: Delete a user (admin protected).
*   `GET /api/admin/earnings/summary`: Fetch platform earnings summary (admin protected).
*   `GET /api/admin/payouts/pending`: Fetch pending payout requests (admin protected).
*   `POST /api/admin/payouts/{payoutId}/process`: Process a specific payout (admin protected).
*   `GET /api/admin/settings`: Fetch platform settings (e.g., commission rates) (admin protected).
*   `PUT /api/admin/settings`: Update platform settings (admin protected).

### **Job Scraper Bot Endpoints**
*   `POST /api/jobs/internal/create`: Endpoint for scraper bots to submit new jobs to the platform (protected by internal bot auth/admin auth).

### **AI Auto-Applier Bot Endpoints**
*   `GET /api/bot/auto-applier/jobs-to-apply`: For auto-applier bots to fetch jobs matching their criteria (protected by internal bot auth/admin auth).
*   `POST /api/bot/auto-applier/record-application`: For auto-applier bots to record an application and update job/bot stats (protected by internal bot auth/admin auth).
*   `POST /api/bot/auto-applier/report-outcome`: For auto-applier bots to report the success/failure of an application (protected by internal bot auth/admin auth).

## Getting Started (Frontend)

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install` or `yarn install`
3.  Run the development server: `npm start` or `yarn start`

## Getting Started (Backend)

1.  **Install PostgreSQL**: Ensure PostgreSQL is installed and running on your system.
2.  **Create Database**:
    ```bash
    psql -U postgres
    CREATE DATABASE kardash_db;
    CREATE USER kardash_user WITH PASSWORD 'your_strong_password';
    GRANT ALL PRIVILEGES ON DATABASE kardash_db TO kardash_user;
    \q
    ```
3.  **Configure Environment**:
    *   Navigate to the `backend` directory: `cd backend`
    *   Copy `.env.example` to `.env`: `cp .env.example .env`
    *   Edit `.env` and replace `your_strong_password` and `your_super_secret_key_for_jwt` with actual values.
4.  **Install Dependencies**: `pip install -r requirements.txt`
5.  **Run Migrations (Initial Table Creation)**: The `create_db_and_tables()` function in `app/database.py` will run on startup.
6.  **Run the FastAPI application**: `uvicorn app.main:app --reload` 