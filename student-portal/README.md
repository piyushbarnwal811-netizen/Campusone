# Student Portal (MERN)

## Features
- Student Auth (register/login)
- Admin Auth (create admin endpoint)
- JWT-based authorization
- Role-based routes (`student`, `admin`)
- Attendance management
- Timetable management
- Notices management
- Exam schedule management
- Complaint management

## Project Setup

### 1) Backend
```bash
cd server
npm install
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

## Environment
`server/.env`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

`client/.env`
- `VITE_API_BASE_URL`

## Admin Creation
Use this API once to create first admin:
```http
POST /api/auth/create-admin
Content-Type: application/json

{
  "secret": "<JWT_SECRET>",
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```
