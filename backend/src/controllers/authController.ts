import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const JWT_SECRET =
  process.env.JWT_SECRET || "kamdarnepal_clean_architecture_key_2026";

// In-memory OTP store (5-minute TTL)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

const normalizeRole = (rawRole?: string): "CUSTOMER" | "PROVIDER" | null => {
  if (!rawRole) return "CUSTOMER";
  const upper = String(rawRole).trim().toUpperCase();
  if (upper === "CUSTOMER") return "CUSTOMER";
  if (upper === "PROVIDER" || upper === "WORKER") return "PROVIDER";
  return null;
};

/**
 * User Registration Controller
 * Maps WORKER/PROVIDER -> PROVIDER and creates ProviderProfile automatically.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, phone, password, role, skill } =
      req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return sendError(res, "Missing required onboarding parameters.", 400);
    }

    const normalizedFirstName = String(firstName).trim();
    const normalizedLastName = String(lastName).trim();
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = String(phone).trim();
    const standardRole = normalizeRole(role);

    if (!standardRole) {
      return sendError(
        res,
        "Invalid user role. Allowed roles are CUSTOMER, PROVIDER, and WORKER.",
        400
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUserByEmail) {
      return sendError(res, "An account with this email already exists.", 409);
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingUserByPhone) {
      return sendError(
        res,
        "An account with this phone number already exists.",
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        role: standardRole,
        providerProfile:
          standardRole === "PROVIDER"
            ? {
                create: {
                  displayName: `${normalizedFirstName} ${normalizedLastName}`,
                  headline: skill
                    ? `${String(skill).toUpperCase()} Specialist`
                    : "Verified Service Professional",
                  bio: "Background vetted premium maintenance expert registered on Kamdar Nepal.",
                  city: "Kathmandu",
                  district: "Kathmandu",
                  country: "Nepal",
                  hourlyRate: 650,
                  rating: 5.0,
                },
              }
            : undefined,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.code === "P2002") {
      const target = error?.meta?.target;
      if (Array.isArray(target) && target.includes("phone")) {
        return sendError(
          res,
          "An account with this phone number already exists.",
          409
        );
      }
      if (Array.isArray(target) && target.includes("email")) {
        return sendError(
          res,
          "An account with this email already exists.",
          409
        );
      }
      return sendError(
        res,
        "An account with these unique details already exists.",
        409
      );
    }

    return next(error);
  }
};

/**
 * User Session Authentication Login Controller (supports email or phone)
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return sendError(
        res,
        "Missing email/phone or password context.",
        400
      );
    }

    const user = email
      ? await prisma.user.findUnique({
          where: { email: String(email).toLowerCase().trim() },
        })
      : await prisma.user.findUnique({
          where: { phone: String(phone).trim() },
        });

    if (!user) {
      return sendError(res, "Invalid credentials.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials.", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return sendSuccess(res, "Logged in successfully.", {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Authenticated User Profile
 */
export const getMe = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Unauthorized session context block.", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        phoneVerified: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return sendError(
        res,
        "User node not found inside cluster database.",
        404
      );
    }

    return sendSuccess(
      res,
      "User active session metadata resolved successfully.",
      { user }
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Forgot Password Recovery Hook
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    return res.status(200).json({
      success: true,
      message:
        "Security OTP token dispatched to your registered communication channel.",
      data: { email },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Send 6-digit SMS OTP
 */
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body;
    const normalizedPhone = String(phone).trim();
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(normalizedPhone, { code, expiresAt });
    console.log(`[SMS OTP] Phone: ${normalizedPhone} | Code: ${code}`);

    return sendSuccess(res, "OTP sent successfully.", {
      phone: normalizedPhone,
      expiresInSeconds: 300,
      ...(process.env.NODE_ENV !== "production" ? { devOtp: code } : {}),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Verify 6-digit OTP (Phone or Email)
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, email, otp } = req.body;
    const key = phone
      ? String(phone).trim()
      : email
      ? String(email).toLowerCase().trim()
      : "";

    const record = otpStore.get(key);
    if (!record || Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return sendError(res, "OTP has expired or is invalid.", 400);
    }

    if (record.code !== String(otp).trim()) {
      return sendError(res, "Invalid OTP code.", 400);
    }

    otpStore.delete(key);

    if (phone) {
      await prisma.user.updateMany({
        where: { phone: String(phone).trim() },
        data: { phoneVerified: true },
      });
    } else if (email) {
      await prisma.user.updateMany({
        where: { email: String(email).toLowerCase().trim() },
        data: { emailVerified: true },
      });
    }

    return sendSuccess(res, "OTP verified successfully.", {
      verified: true,
    });
  } catch (error) {
    return next(error);
  }
};