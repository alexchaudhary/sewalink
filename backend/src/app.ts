import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import providerRouter from "./routes/providers";
import bookingRouter from "./routes/bookings";
import paymentRouter from "./routes/payments";
import adminRouter from "./routes/admin";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Security & Optimization Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter((url): url is string => Boolean(url));

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, cURL, ra Server-to-Server request ma origin undefined hunchha
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS Policy: Access Denied"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root Route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to SewaLink API",
    status: "healthy",
    docs: "/api/health",
  });
});

// Health Check Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/providers", providerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    errors: null,
  });
});

// Global Error Middleware (Must have 4 arguments for Express to recognize it)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  
  if (typeof errorHandler === "function") {
    return errorHandler(err, req, res, next);
  }

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
  });
});

export default app;