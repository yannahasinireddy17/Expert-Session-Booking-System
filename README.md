# Real-Time Expert Session Booking System

A React + Node.js booking system for finding experts, reserving live time slots, and tracking booking status.

## Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB
- Real-time sync: Socket.io

## What Works

- Expert listing with search, category filter, pagination, loading, and error states
- Expert detail view with slots grouped by date
- Live slot updates when another user books the same expert
- Booking form with validation, success state, and booked-slot disabling
- Booking lookup by email with status labels: Pending, Confirmed, Completed
- Double-booking protection using a unique compound index on expert + date + timeSlot

## API Endpoints

- GET /experts
- GET /experts/:id
- POST /bookings
- PATCH /bookings/:id/status
- GET /bookings?email=

## Local Setup

### Backend

1. Open a terminal in the backend folder
2. Install dependencies
3. Copy `.env.example` to `.env`
4. Start MongoDB locally, or point `MONGODB_URI` to a live MongoDB instance
5. Run the backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

1. Open a second terminal in the frontend folder
2. Install dependencies
3. Copy `.env.example` to `.env` if you want to override the default API URLs
4. Run the frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000

## Vercel Deployment

This repo is set up for a split Vercel deployment:

- Frontend project root: `frontend`
- Backend project root: `backend`

### Frontend on Vercel

- Import the GitHub repo into Vercel
- Set the root directory to `frontend`
- Add `VITE_API_URL` pointing to the deployed backend URL
- Deploy using the default Vite build

### Backend on Vercel

- Import the same GitHub repo into a second Vercel project
- Set the root directory to `backend`
- Add `MONGODB_URI` for a MongoDB Atlas database
- Add `CLIENT_ORIGIN` with the deployed frontend URL
- Deploy the backend project

The backend is exposed through Vercel's function entry at `backend/api/index.js`, and the frontend uses polling so the slot availability stays fresh without a persistent socket connection.

## Demo Notes

- Open the expert list and show search/filter/pagination
- Open an expert detail page and demonstrate automatic availability refresh
- Submit a booking and show the success state
- Use My Bookings to show booking status by email
- Open the Admin page and update a booking from Pending to Confirmed or Completed

## Submission Checklist

- GitHub repository link
- One demo video of the working app
- Deployed links for frontend and backend
