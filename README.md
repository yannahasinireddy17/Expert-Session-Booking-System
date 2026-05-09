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

## Deployment

### Backend on Render

The backend is configured for Render in [render.yaml](render.yaml).

1. Create a new Render Web Service from this GitHub repo.
2. Use the root `render.yaml` file or set the service manually.
3. Add these environment variables on Render:
	- `MONGODB_URI` from MongoDB Atlas
	- `CLIENT_ORIGIN` set to your deployed frontend URL
	- `NODE_ENV=production`
4. Deploy the backend and copy the public URL.

### Frontend on Vercel

1. Import the same GitHub repo into Vercel.
2. Set the root directory to `frontend`.
3. Add these environment variables in Vercel:
	- `VITE_API_URL` = your Render backend URL
	- `VITE_SOCKET_URL` = your Render backend URL
4. Deploy the frontend.

Because the app uses Socket.io for real-time slot updates, the backend should stay on a persistent Node host like Render rather than a serverless-only setup.

## Demo Notes

- Open the expert list and show search/filter/pagination
- Open an expert detail page and demonstrate automatic availability refresh
- Submit a booking and show the success state
- Use My Bookings to show booking status by email
- Show the status update API in a REST client or backend logs if needed

## Submission Checklist

- GitHub repository link
- One demo video of the working app
- Deployed frontend link
- Deployed backend link or API URL
- MongoDB Atlas connection configured in production
