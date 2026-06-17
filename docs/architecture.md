# Platform Architecture

## High-level architecture

- Frontend: Next.js web app with server-side rendering and static optimization.
- Mobile: React Native for cross-platform Android and iOS apps.
- Desktop: Electron shell wrapping the same React code base for desktop.
- Backend: Express.js REST API with JWT and OAuth authentication.
- Database: PostgreSQL with Prisma ORM.
- Realtime: Socket.io for chat, booking updates, and notifications.
- Cloud: AWS for hosting, S3-compatible storage, Cloudinary for images.
- Payment gateways: Stripe, eSewa, Khalti, Fonepay.
- Mapping: Google Maps API for location search and distance calculation.
- AI: Recommendation engine, chatbot endpoint, fraud detection service.

## API architecture

### Public endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `GET /api/providers`
- `GET /api/providers/:id`
- `GET /api/categories`
- `GET /api/search`

### Customer endpoints

- `GET /api/customers/me`
- `POST /api/bookings`
- `GET /api/bookings`
- `POST /api/reviews`
- `POST /api/payments/checkout`
- `GET /api/chat/threads`
- `POST /api/chat/messages`

### Provider endpoints

- `GET /api/providers/me`
- `PUT /api/providers/me`
- `POST /api/providers/me/availability`
- `GET /api/bookings/requests`
- `PATCH /api/bookings/:id/status`
- `GET /api/earnings`

### Admin endpoints

- `GET /api/admin/users`
- `GET /api/admin/providers`
- `PATCH /api/admin/providers/:id/verify`
- `GET /api/admin/bookings`
- `GET /api/admin/analytics`
- `POST /api/admin/advertisements`

## Authentication flow

1. Customer or provider registers via email/phone or Google OAuth.
2. Backend creates a `User` record and issues a JWT.
3. Protected endpoints require `Authorization: Bearer <token>`.
4. OTP validation is used for phone login and sensitive actions.

## Payment flow

1. Customer selects service and booking type.
2. Frontend requests checkout session from backend.
3. Backend creates payment intent via Stripe / local gateway.
4. Gateway callback/webhook updates `Payment` and `Booking` status.
5. Provider earnings and commission are recorded.

## Deployment plan

- Backend: AWS ECS / AWS Lambda + API Gateway or EC2 + load balancer
- Frontend: Vercel / Netlify for Next.js
- Database: AWS RDS PostgreSQL
- Storage: Cloudinary for images, AWS S3 for backups
- Realtime: AWS Elasticache + Socket.io with Redis adapter
- CI/CD: GitHub Actions for tests, lint, build, deploy
