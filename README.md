# ALSM – Automating Legacy System Modernization

## Project Structure

```
screen_web/
├── frontend/          React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── backend/           Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── docs/          Postman collection
│   └── package.json
│
├── package.json       Root scripts (run both together)
└── .gitignore
```

## Quick Start

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT secret, email config
```

### 3. Run both frontend & backend simultaneously
```bash
# Install root devDependencies first (concurrently)
npm install

# Start both
npm run dev
```

### Run individually
```bash
# Frontend only  →  http://localhost:5173
npm run frontend

# Backend only   →  http://localhost:5000
npm run backend
```

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Zustand |
| Backend  | Node.js, Express.js, MongoDB, Mongoose  |
| Auth     | JWT, bcryptjs, Nodemailer               |

## API Documentation

Import `backend/docs/ALSM.postman_collection.json` into Postman.

Base URL: `http://localhost:5000`

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | /api/auth/register/individual         | Register individual user |
| POST   | /api/auth/register/enterprise         | Register enterprise      |
| GET    | /api/auth/verify-email/:token         | Verify email             |
| POST   | /api/auth/resend-verification-email   | Resend verification      |
| POST   | /api/auth/login                       | Login                    |
| POST   | /api/auth/forgot-password             | Request password reset   |
| POST   | /api/auth/reset-password/:token       | Reset password           |
| GET    | /api/auth/me                          | Get current user (auth)  |
