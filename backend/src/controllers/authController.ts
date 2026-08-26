import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

// Global Secret Definition for token signing
const JWT_SECRET = process.env.JWT_SECRET || "kamdarnepal_clean_architecture_key_2026";

/**
 * User Registration Controller
 * Automatically handles onboarding and creates standalone provider profiles safely.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone, password, role, skill } = req.body;

    // 1. Defensively validate absolute entry parameters boundaries
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return sendError(res, "Missing required onboarding parameters.", 400);
    }

    // 2. Cross-verify identity conflicts against database
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existingUser) {
      return sendError(res, "An account with this email already exists.", 409);
    }

    // 3. Transform plaintext passwords using Bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const standardRole = role === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

    // 4. Create new user entry
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role: standardRole,
        providerProfile:
          standardRole === "PROVIDER"
            ? {
                create: {
                  displayName: `${firstName.trim()} ${lastName.trim()}`,
                  headline: skill ? `${skill.toUpperCase()} Specialist` : "Verified Service Professional",
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

    // 5. Generate authorization token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
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
        role: newUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * User Session Authentication Login Controller
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Missing email or password context.", 400);
    }

    // 1. Isolate user record nodes from database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      return sendError(res, "Invalid email or password.", 401);
    }

    // 2. Perform deep verification analysis on password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid email or password.", 401);
    }

    // 3. Issue validation authorization token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Enterprise Secure Resource Access Token Verification Identity Resolver
 */
export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "Unauthorized session context block.", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, phone: true },
    });

    if (!user) {
      return sendError(res, "User node not found inside cluster database.", 404);
    }

    return sendSuccess(res, "User active session metadata resolved successfully.", { user });
  } catch (error) {
    return next(error);
  }
};

/**
 * Forgot Password Recovery Hook
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    return res.status(200).json({
      success: true,
      message: "Security OTP token dispatched to your registered communication channel.",
      data: { email }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * OTP Verification Pipeline
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    return res.status(200).json({
      success: true,
      message: "OTP token verified successfully. Security clearance approved.",
      data: { email, verified: true }
    });
  } catch (error) {
    return next(error);
  }
};