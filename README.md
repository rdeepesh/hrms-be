# HRMS Backend

Backend service for an HRMS system built with Node.js, Express.js, Mongoose, and TypeScript.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- Zod (request validation)

## Features
- Employee management
  - Create employee
  - Get all employees (with basic filters)
  - Delete employee
- Attendance management
  - Create attendance
  - Get attendance list (with filters)
  - Get attendance records by employee
  - Update attendance
- Centralized error handling
- Environment validation

## Project Structure
```txt
src/
  app.ts
  server.ts
  config/
    database.ts
    env.ts
  controllers/
    employee.controller.ts
    attendance.controller.ts
  middlewares/
    error.middleware.ts
  models/
    employee.model.ts
    attendance.model.ts
  routes/
    employee.routes.ts
    attendance.routes.ts
  utils/
    api.ts
    validation.ts
```

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

Server default URL: `http://localhost:8000`

## Environment Variables
- `NODE_ENV` - `development | test | production`
- `PORT` - server port (default `8000`)
- `MONGO_URI` - MongoDB connection string
- `CORS_ORIGIN` - frontend origin for CORS

## API Base URL
`/api`

## Endpoints
### Public
- `GET /api/health`
- Employees
  - `POST /api/employees`
  - `GET /api/employees`
  - `DELETE /api/employees/:id`
- Attendance
  - `POST /api/attendance`
  - `GET /api/attendance`
  - `GET /api/attendance/employee/:employeeId`
  - `PUT /api/attendance/:id`

## Sample Request Bodies
### Create Employee
```json
{
  "employeeCode": "EMP001",
  "fullName": "Deepesh Rohilla",
  "email": "deepesh@example.com",
  "department": "Engineering"
}
```

### Create Attendance
```json
{
  "employeeId": "<mongo_object_id>",
  "date": "2026-02-19",
  "status": "present"
}
```

## Notes
- Employee fields: `employeeCode`, `fullName`, `email`, `department`.
- `employeeCode` validation: must match `EMP001` format (`EMP` + exactly 3 digits).
- `department` enum values: `Engineering`, `Human Resources`, `Finance`, `Marketing`, `Sales`, `Operations`.
- Attendance status values: `present`, `absent`.
- Attendance has a unique index on (`employeeId`, `date`) to prevent duplicate entries for the same day.
- IDs are MongoDB ObjectIds.
