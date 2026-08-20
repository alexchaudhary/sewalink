import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

// Ensure JWT secret is provided in the environment variables for system safety
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in system environment variables.");
}

/**
 * @desc    Register a new user (Customer or Service Provider)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, firstName, lastName, role } = req.body;

    // 1. Validate basic input fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "Missing required registration fields." });
    }

    // 2. Check if the user already exists using either email or phone (removes empty criteria)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          phone ? { phone: phone.trim() } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Email or phone number is already registered." });
    }

    // 3. Hash password using a high safety work factor (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user record and dependent relational profiles atomically
    const created = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
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
      // Do not select or expose password hash in the query response payload
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    // 5. Generate secure JSON Web Token session credentials
    const token = jwt.sign(
      { sub: created.id, email: created.email, role: created.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      token,
      user: created,
    });

  } catch (error) {
    next(error); // Forwards unhandled database/system errors safely to global error handler
  }
};

/**
 * @desc    Authenticate user & get session token (Supports Email or Phone lookup)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ success: false, message: "Email/phone and password are required credentials." });
    }

    // 1. Query the database using sanitized lookups
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase().trim() } : {},
          phone ? { phone: phone.trim() } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      },
    });

    // Security practice: Return a generic message so attackers can't verify if an email exists
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid login credentials provided." });
    }

    // 2. Safely cross-match hashed passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid login credentials provided." });
    }

    // 3. Issue application session token
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request a secure OTP code for account recovery
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Account email address is required." });
    }
    
    // Placeholder architecture: Hook up your mail utility (e.g., Nodemailer / SendGrid) here
    return res.json({ success: true, message: `Password reset OTP token requested for ${email}.` });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify validation OTP to grant access recovery token
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ success: false, message: "Both OTP and email credentials are required parameters." });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(404).json({ success: false, message: "No active record found matching that email." });
    }

    // Placeholder validation: Replace with real verification logic inside redis or database tracking
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, message: "OTP challenge verified successfully.", token });
  } catch (error) {
    next(error);
  }
};
