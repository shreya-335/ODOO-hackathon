# Stock Master - Inventory Management System

A complete inventory management system built with React, Node.js/Express, and PostgreSQL.

## Project Structure

\`\`\`
stock-master/
├── frontend/              # React frontend with Tailwind CSS
│   ├── src/
│   │   ├── pages/        # Main pages (Login, Dashboard)
│   │   ├── components/   # Reusable components
│   │   └── App.jsx
│   └── package.json
├── backend/              # Node.js + Express backend
│   ├── server.js
│   └── package.json
└── database/             # PostgreSQL schemas
    ├── init.sql
    └── seed.sql
\`\`\`

## Color Scheme (Odoo-style)

- **Primary**: Purple (#6b21a8)
- **Secondary**: Grey (#6b7280)
- **Background**: White (#ffffff)
- **Surface**: Light Grey (#f9fafb)

## Features

- ✅ User authentication (Login/Signup)
- ✅ Dashboard with KPIs
- ✅ Stock management
- ✅ Receipts (Incoming goods)
- ✅ Deliveries (Outgoing goods)
- ✅ Move history tracking
- ✅ Warehouse & Location management
- ✅ Stock adjustments
- ✅ Multi-location support

## Setup Instructions

### 1. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb stockmaster

# Run schema
psql stockmaster < database/init.sql

# Seed sample data
psql stockmaster < database/seed.sql
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/stockmaster
PORT=5000

# Start backend server
npm start
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env and set API URL
VITE_API_URL=http://localhost:5000

# Start frontend dev server
npm run dev
\`\`\`

### 4. Access Application

Open browser and navigate to: `http://localhost:5173`

## API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/products
- POST /api/products
- GET /api/warehouses
- POST /api/warehouses
- GET /api/receipts
- POST /api/receipts
- GET /api/deliveries
- POST /api/deliveries
- POST /api/stock-adjustments

## Notes

- `app/page.tsx` exists only for v0 preview compatibility
- Production deployment uses the `frontend/` and `backend/` folders
- All API calls are real and connected to PostgreSQL database
- Database includes proper relationships and indexes for performance
