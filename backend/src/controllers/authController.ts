import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export const register = async (req: Request, res: Response) => {
  const { email, phone, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required registration fields." });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (existing) {
    return res.status(409).json({ message: "Email or phone is already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const created = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role === "PROVIDER" ? "PROVIDER" : "CUSTOMER",
      providerProfile:
        role === "PROVIDER"
          ? {
              create: {
                displayName: `${firstName} ${lastName}`,
                headline: "Experienced local service provider",
                hourlyRate: 0,
              },
            }
          : undefined,
    },
  });

  const token = jwt.sign({ sub: created.id, email: created.email, role: created.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({ token, user: { id: created.id, email: created.email, role: created.role, firstName: created.firstName, lastName: created.lastName } });
};

export const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: "Email or phone and password are required." });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  // Placeholder flow for OTP / reset email integration.
  res.json({ message: `Password reset requested for ${email}.` });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and email are required." });
  }
  // Placeholder OTP verification. Integrate SMS/email provider in production.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ message: "OTP verified.", token });
};
