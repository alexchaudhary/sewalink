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

// 1. Security & Performance Optimization Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Senior Tip: Loosen content security policies during local development mesh phases
    contentSecurityPolicy: false,
  })
);
app.use(compression());

// 2. Comprehensive Robust CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter((url): url is string => Boolean(url));

app.use(
  cors({
    origin: (origin, callback) => {
      // Direct pass during development to prevent local browser port blockages
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS Policy Breach: Access Denied"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    // Senior Tip: Handle browser pre-flight OPTIONS caching options securely
    optionsSuccessStatus: 200,
  })
);

// 3. Request Stream Body Parsing Layers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. Base Information Root Route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to SewaLink Enterprise Architecture Core API",
    status: "healthy",
    docs: "/api/health",
  });
});

// 5. Health Check Metrics Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 6. Application Enterprise Routing Mount Points
app.use("/api/auth", authRouter);
app.use("/api/providers", providerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

// 7. Standard 404 Route Not Found Interceptor Boundary
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Resource route path not found`,
    errors: null,
  });
});

// 8. Bind your centralized global errorHandler directly into the native Express stream
app.use(errorHandler);

export default app;
