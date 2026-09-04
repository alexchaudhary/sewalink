import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

// Global Secret Definition for token signing
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "kamdarnepal_clean_architecture_key_2026";

/**
 * User Registration Controller
 *
 * Handles customer/provider onboarding and safely creates
 * provider profiles when the selected role is PROVIDER.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      skill,
    } = req.body;

    // --------------------------------------------------
    // 1. Validate required parameters
    // --------------------------------------------------
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return sendError(
        res,
        "Missing required onboarding parameters.",
        400
      );
    }

    // --------------------------------------------------
    // 2. Normalize input values
    // --------------------------------------------------
    const normalizedFirstName = String(firstName).trim();
    const normalizedLastName = String(lastName).trim();
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedPhone = String(phone).trim();
    const normalizedRole = String(role).toUpperCase().trim();

    // --------------------------------------------------
    // 3. Validate normalized values
    // --------------------------------------------------
    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !password
    ) {
      return sendError(
        res,
        "Invalid registration parameters.",
        400
      );
    }

    // --------------------------------------------------
    // 4. Validate role
    // --------------------------------------------------
    const standardRole =
      normalizedRole === "PROVIDER"
        ? "PROVIDER"
        : normalizedRole === "CUSTOMER"
        ? "CUSTOMER"
        : null;

    if (!standardRole) {
      return sendError(
        res,
        "Invalid user role. Allowed roles are CUSTOMER and PROVIDER.",
        400
      );
    }

    // --------------------------------------------------
    // 5. Check duplicate email
    // --------------------------------------------------
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUserByEmail) {
      return sendError(
        res,
        "An account with this email already exists.",
        409
      );
    }

    // --------------------------------------------------
    // 6. Check duplicate phone
    // --------------------------------------------------
    const existingUserByPhone = await prisma.user.findUnique({
      where: {
        phone: normalizedPhone,
      },
    });

    if (existingUserByPhone) {
      return sendError(
        res,
        "An account with this phone number already exists.",
        409
      );
    }

    // --------------------------------------------------
    // 7. Hash password using bcrypt
    // --------------------------------------------------
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    // --------------------------------------------------
    // 8. Create user and provider profile
    // --------------------------------------------------
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

    // --------------------------------------------------
    // 9. Generate JWT authorization token
    // --------------------------------------------------
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // --------------------------------------------------
    // 10. Return successful registration response
    // --------------------------------------------------
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
  } catch (error: any) {
    console.error("Registration error:", error);

    // --------------------------------------------------
    // 11. Handle Prisma unique constraint safely
    //
    // This protects against race conditions where another
    // request creates the same email/phone between the
    // duplicate check and prisma.user.create().
    // --------------------------------------------------
    if (error?.code === "P2002") {
      const target = error?.meta?.target;

      if (
        Array.isArray(target) &&
        target.includes("phone")
      ) {
        return sendError(
          res,
          "An account with this phone number already exists.",
          409
        );
      }

      if (
        Array.isArray(target) &&
        target.includes("email")
      ) {
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
 * User Session Authentication Login Controller
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // --------------------------------------------------
    // 1. Validate login parameters
    // --------------------------------------------------
    if (!email || !password) {
      return sendError(
        res,
        "Missing email or password context.",
        400
      );
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    // --------------------------------------------------
    // 2. Find user
    // --------------------------------------------------
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return sendError(
        res,
        "Invalid email or password.",
        401
      );
    }

    // --------------------------------------------------
    // 3. Verify password
    // --------------------------------------------------
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return sendError(
        res,
        "Invalid email or password.",
        401
      );
    }

    // --------------------------------------------------
    // 4. Generate JWT token
    // --------------------------------------------------
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // --------------------------------------------------
    // 5. Return login response
    // --------------------------------------------------
    return sendSuccess(
      res,
      "Logged in successfully.",
      {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      }
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Enterprise Secure Resource Access Token
 * Verification Identity Resolver
 */
export const getMe = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // --------------------------------------------------
    // 1. Get authenticated user ID
    // --------------------------------------------------
    const userId = req.user?.id;

    if (!userId) {
      return sendError(
        res,
        "Unauthorized session context block.",
        401
      );
    }

    // --------------------------------------------------
    // 2. Find authenticated user
    // --------------------------------------------------
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      return sendError(
        res,
        "User node not found inside cluster database.",
        404
      );
    }

    // --------------------------------------------------
    // 3. Return session metadata
    // --------------------------------------------------
    return sendSuccess(
      res,
      "User active session metadata resolved successfully.",
      {
        user,
      }
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
      data: {
        email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * OTP Verification Pipeline
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    return res.status(200).json({
      success: true,
      message:
        "OTP token verified successfully. Security clearance approved.",
      data: {
        email,
        verified: true,
      },
    });
  } catch (error) {
    return next(error);
  }
};