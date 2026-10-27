# 🎬 IMovies - Movie Ticket Booking & Cinema Management System

A full-stack cinema ticket booking web application built on the **MERN** stack (MongoDB, Express.js, React, Node.js) with Vite.

---

## 📌 Features

### 👤 User Features
- **Authentication & Profiles:** User registration, secure login with JWT authentication, and profile management.
- **Movie Discovery:** Explore current releases, upcoming movies, trailers, genres, ratings, and synopsis.
- **Theatres & Showtimes:** Browse shows by theatre, date, and time slot.
- **Interactive Seat Selection:** Real-time visual seat layout grid with seat availability and seat locking.
- **Checkout & Payment:** Integrated checkout flow with instant booking confirmation.
- **Booking History & Tickets:** View active and past bookings with automated PDF ticket generation and email delivery.
- **Favorites & Reviews:** Save favorite movies/shows and leave ratings/reviews.

### 🛡️ Admin & Cinema Management
- **Dashboard Overview:** Analytical overview of bookings, active shows, and revenue.
- **Movie Management:** Add, update, and remove movies.
- **Theatre Management:** Add theatres, configure screens, and layout capacities.
- **Show Scheduling:** Schedule shows, assign ticket prices, and manage timing slots.
- **Bookings Oversight:** View customer reservations and booking statuses.

---

## 🏗️ Architecture & Tech Stack

```
Movie Ticket Booking System/
├── client/         # Frontend application (React + Vite)
│   ├── src/        # React components, pages, context, and styles
│   └── package.json
├── server/         # Backend REST API (Node.js + Express + MongoDB)
│   ├── controllers/# Business logic
│   ├── models/     # Mongoose schemas
│   ├── routes/     # Express route handlers
│   ├── utils/      # Helpers (PDF generation, email transport)
│   └── package.json
└── .gitignore      # Root Git ignore configuration
```

### 💻 Technologies
- **Client:** React 18, Vite, React Router DOM, Axios, SCSS / Vanilla CSS, Lucide React / FontAwesome Icons.
- **Server:** Node.js, Express.js, Mongoose, JWT, Nodemailer, PDFKit, Stripe.
- **Database:** MongoDB.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Movie Ticket Booking System"
```

---

### 2. Backend Setup (`server`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration (`.env`):
   ```env
   # MongoDB connection string
   MONGODB_CONNECTION_LINK=mongodb://localhost:27017/movie_booking

   # JWT secret for authentication
   JWT_SECRET=your_jwt_secret_key_here

   # Email service configuration (Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   MAIL_FROM=your_email@gmail.com

   # Server port
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:3000`.*

---

### 3. Frontend Setup (`client`)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration (`.env`):
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `GET` | `/api/movies` | Fetch all movies |
| `GET` | `/api/theatres` | Fetch available theatres |
| `GET` | `/api/shows` | Fetch shows for a theatre / movie |
| `POST` | `/api/bookings` | Create new ticket booking |
| `GET` | `/api/bookings/user` | Retrieve bookings for authenticated user |
| `POST` | `/api/admin/movie` | Add a new movie (Admin) |
| `POST` | `/api/admin/theatre` | Add a new theatre (Admin) |

---

## 📄 License

This project is licensed under the ISC License.
