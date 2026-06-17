# SewaLink / KaamSathi

A startup-ready multi-platform service marketplace connecting customers with local skilled professionals across Nepal.

## Platform Scope

- Web application: Next.js + TypeScript + Tailwind CSS
- Mobile apps: React Native / Expo
- Desktop app: Electron + React
- Backend: Node.js + Express + PostgreSQL
- Storage: Cloudinary
- Maps: Google Maps API
- Payments: Stripe, eSewa, Khalti, Fonepay, Cash on Service
- Realtime: Socket.io

## Project Structure

- `backend/` - Express API, authentication, payments, booking logic
- `frontend/` - Next.js user-facing web platform
- `mobile/` - React Native app scaffold for Android/iOS
- `desktop/` - Electron desktop app scaffold
- `docs/` - Architecture, database schema, ER diagram, deployment plan

## Recommended project name

- **SewaLink** (best fit)
- **KaamSathi**

## Quick start

1. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
2. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```
3. Run the backend server
   ```bash
   cd backend
   npm run dev
   ```
4. Run the frontend app
   ```bash
   cd frontend
   npm run dev
   ```

5. Run the mobile scaffold
   ```bash
   cd mobile
   npm install
   npm run start
   ```

6. Run the desktop scaffold
   ```bash
   cd desktop
   npm install
   npm run dev
   ```

## Notes

This repository is scaffolded for a modern multi-platform SaaS marketplace with separate layers for service discovery, provider management, booking, payments, chat, and admin tools.
