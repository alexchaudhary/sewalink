# SewaLink Setup Guide

## Project Status
✅ **Completed:**
- Backend scaffold with Express + TypeScript
- Prisma ORM with complete schema
- Frontend pages with Next.js + Tailwind
- Mobile app with React Native + Expo (updated with API integration)
- Desktop app with Electron
- All dependencies installed

⏳ **Next Steps:**
1. Set up PostgreSQL database
2. Run Prisma migrations
3. Start backend server
4. Start frontend server
5. Test mobile app with backend

---

## 1. PostgreSQL Setup (Windows)

### Option A: Using PostgreSQL Installer
1. Download from https://www.postgresql.org/download/windows/
2. Install PostgreSQL (default port 5432)
3. Create a new user/password during setup (remember it)
4. Create a new database:
   ```powershell
   # Open pgAdmin or use psql command line
   psql -U postgres
   CREATE DATABASE sewalink_dev;
   \q
   ```

### Option B: Using Docker (Recommended)
```powershell
# Install Docker Desktop for Windows
# Then run:
docker run --name sewalink-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sewalink_dev -p 5432:5432 -d postgres:15
```

---

## 2. Update Backend Environment

Edit `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/sewalink_dev
JWT_SECRET=your_secure_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Update the password if you changed it during PostgreSQL setup.**

---

## 3. Run Prisma Migrations

```powershell
cd backend
npm run prisma:migrate:dev
# Follow prompts to create the migration
```

This will:
- Create all database tables
- Run seed data (if configured)
- Generate Prisma client

---

## 4. Start the Backend Server

```powershell
cd backend
npm run dev
# Server will run at http://localhost:5000
```

---

## 5. Start the Frontend Server

```powershell
cd frontend
npm run dev
# Frontend will run at http://localhost:3000
```

---

## 6. Run the Mobile App

```powershell
cd mobile
npm install  # Install new dependencies (AsyncStorage, etc.)
npm start
# Follow Expo prompts to run on iOS/Android simulator or scan QR code
```

**Update the API URL in `mobile/lib/api.ts` if backend is on a different address.**

---

## API Endpoints (Backend)

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Providers
- `GET /api/providers` - List all providers
- `GET /api/providers/:id` - Get provider details
- `PUT /api/providers/:id` - Update provider profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments/checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Stripe webhook

### Admin
- `GET /api/admin/users` - List users (admin only)
- `GET /api/admin/providers` - List providers (admin only)
- `GET /api/admin/analytics` - Get platform analytics (admin only)

---

## Testing the Application

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+977-9800000000",
  "password": "SecurePassword123",
  "role": "CUSTOMER"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Copy the returned `token` and use it in Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```

### 3. Browse Providers
```
GET http://localhost:5000/api/providers
Authorization: Bearer YOUR_TOKEN
```

---

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `STRIPE_SECRET_KEY` - Stripe API key
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Development or production

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Mobile (EXPO_PUBLIC_API_URL)
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api
# Use your machine's IP (not localhost) for mobile testing
```

---

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run: `psql -U postgres -c "SELECT 1"`

### Port Already in Use
```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F
```

### Mobile App Can't Reach Backend
- Use machine IP instead of `localhost`
- Check firewall settings
- Ensure backend is running on the correct port

---

## Next: Production Deployment

When ready to deploy:
1. Set up cloud database (AWS RDS, Heroku PostgreSQL, etc.)
2. Deploy backend (Vercel, Heroku, AWS)
3. Deploy frontend (Vercel, Netlify)
4. Build mobile app (EAS Build for Expo)
5. Update environment variables for production
6. Set up SSL certificates and domain
7. Configure payment gateway for production

---

**Questions?** Check the docs in `docs/architecture.md` for the full system design.
