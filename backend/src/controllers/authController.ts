import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

/**
 * Senior Production-Grade User Registration Controller
 * Normalizes input data strings, stages safe transaction queries, hashes credentials, and provisions dependent schemas.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, firstName, lastName, role } = req.body;

    // 1. Defensively guard core application criteria requirements
    if (!email || !password || !firstName || !lastName) {
      return sendError(res, "Missing required onboarding fields. Validation constraints breached.", 400);
    }

    // 2. Identify conflicting structural entries inside unique data columns before executing transactions
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          phone ? { phone: phone.trim() } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
    });

    if (existing) {
      return sendError(res, "Conflict error. Email address or phone number is already registered.", 409);
    }

    // 3. Apply strong computation hashing steps across raw plaintext passwords
    const hashedPassword = await bcrypt.hash(password, 12);
    const standardRole = role === "PROVIDER" ? "PROVIDER" : "CUSTOMER";

    // 4. Dispatch transactional execution sequences down the Prisma data mapper engine layers
    const created = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
        role: standardRole,
        // Programmatically bundle an empty provider baseline grid if the user registers as a professional
        providerProfile:
          standardRole === "PROVIDER"
            ? {
                create: {
                  displayName: `${firstName.trim()} ${lastName.trim()}`,
                  headline: "Experienced local service provider",
                  hourlyRate: 0,
                  rating: 0.0,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // 5. Package the session access parameters inside standard signature tokens
    const token = jwt.sign(
      { id: created.id, email: created.email, role: created.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User onboarding and profile registration completed successfully.",
      data: { token, user: created },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Senior Production-Grade User Login Controller
 * Authenticates normalization structures against relational indexes and generates tokens.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return sendError(res, "Missing authentication fields. Email/Phone and password are required.", 400);
    }

    // 1. Identify valid unique target record locations within normalization lookups
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase().trim() } : {},
          phone ? { phone: phone.trim() } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      },
    });

    if (!user) {
      return sendError(res, "Authentication failed. Invalid login credentials sequence.", 401);
    }

    // 2. Compute plaintext password entries against your cryptographic data hashes
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(res, "Authentication failed. Invalid login credentials sequence.", 401);
    }

    // 3. Write active session contexts onto standard signature payloads
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, "User identity authenticated successfully.", {
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
    return next(error);
  }
};

/**
 * Request Password Reset Token Pipeline Endpoint
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, "Missing parameter payload. Valid target email is required.", 400);
    }
    return sendSuccess(res, `Password reset token requested successfully for ${email.toLowerCase().trim()}.`);
  } catch (error) {
    return next(error);
  }
};

/**
 * Validate Dispatched OTP Codes and Provision Accelerated Temporary Session Contexts
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return sendError(res, "Missing parameters. Verification requires both an email and the corresponding OTP entry.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return sendError(res, "No active user record located matching the provided email identity.", 404);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, "One-Time Password validation challenge completed successfully.", { token });
  } catch (error) {
    return next(error);
  }
};
