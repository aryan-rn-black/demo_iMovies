# 🎬 IMovies — Backend REST API (Node.js + Express + MongoDB)

This directory contains the backend REST API service for the **IMovies Cinema & Ticket Management System**.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` (refer to `.env.example`):
   ```env
   MONGODB_CONNECTION_LINK=mongodb://localhost:27017/movie_booking
   JWT_SECRET=your_jwt_secret_key_here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   MAIL_FROM="IMovies Box Office" <your_email@gmail.com>
   PORT=3000
   ```

3. Launch server:
   ```bash
   npm run dev    # With nodemon auto-restart
   # or
   npm start      # Standard node execution
   ```
   *The backend REST API will run on `http://localhost:3000`.*

For full system architecture, API documentation, and frontend setup instructions, please refer to the [Root README](../readme.md).
