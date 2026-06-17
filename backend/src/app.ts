import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import providerRouter from "./routes/providers";
import bookingRouter from "./routes/bookings";
import paymentRouter from "./routes/payments";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/providers", providerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
