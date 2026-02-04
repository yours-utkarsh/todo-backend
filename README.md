# Todo Backend API

Simple and fast Todo application backend with JWT authentication.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   MONGO_URL=mongodb+srv://...
   JWT_SECRET=your_secret_here
   ```

3. **Run server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected - requires JWT token)
- `GET /api/tasks` - Get all tasks (with optional `?status=pending`)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Auth Flow

1. Register or login to get JWT token
2. Include token in header: `Authorization: Bearer <token>`
3. Token lasts 7 days

## Tech Stack
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- CORS enabled
