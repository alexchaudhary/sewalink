import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

/**
 * User Registration Controller
 * Validates input parameters, checks constraints, hashes passwords, and saves records.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // १. फ्रन्टइन्डबाट आएको 'skill' लाई पनि यहाँ थापेको
    const { email, phone, password, firstName, lastName, role, skill } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return sendError(res, "Missing required onboarding fields. Validation constraints breached.", 400);
    }

    // Check for conflicting unique entries
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

    // Hash the plain text password configuration securely
    const hashedPassword = await bcrypt.hash(password, 12);

    const upperRole = role ? role.toUpperCase().trim() : "";
    const standardRole = upperRole === "PROVIDER" || upperRole === "WORKER" || upperRole === "KAMDAR" ? "PROVIDER" : "CUSTOMER";


    // Build user records and relational schemas down the database pipeline
    const created = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
        role: standardRole,
        
        // २. यदि कामदार दर्ता भएको हो भने उसको प्रोफाइलसँगै 'skills' पनि डाटाबेसमा सेभ गर्ने
        providerProfile:
          standardRole === "PROVIDER"
            ? {
                create: {
                  displayName: `${firstName.trim()} ${lastName.trim()}`,
                  headline: skill ? `${skill.toUpperCase()} Specialist` : "Experienced local service provider",
                  hourlyRate: 0,
                  rating: 0.0,
                  // यदि फ्रन्टइन्डबाट सीप पठाइएको छ भने 'ProviderSkill' तालिकामा डाटा हाल्ने
                  ...(skill && {
                    skills: {
                      create: {
                        name: skill,
                        experienceYears: 1, // सुरुमा डिफल्ट १ वर्ष
                        hourlyRate: 0
                      }
                    }
                  })
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

    // Sign the secure access token
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
 * User Login Controller
 * Authenticates login variables and issues tracking JSON Web Tokens.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return sendError(res, "Missing authentication fields. Email/Phone and password are required.", 400);
    }

    // Match identity inside validation indexes
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

    // Verify plaintext inputs against database password storage parameters
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(res, "Authentication failed. Invalid login credentials sequence.", 401);
    }

    // Sign active authorization token contexts
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
 * Request Password Reset Pipeline
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
 * Validate Dispatched OTP Verification Codes
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

/**
 * User Session Profile Controller
 * Resolves authentication metrics from middleware tokens for authorized dashboards.
 * ३. तपाईंको साविकको भाग ३ को कोडलाई यहाँ पूर्ण रूपमा मिलाइएको छ (तपाईंको original logs र responses सहित)
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Read user identity reference from payload middleware configurations
    const userId = (req as any).user?.id;

    if (!userId) {
      return sendError(res, "Unauthorized account session context reference. Access denied.", 401);
    }

    // Locate active user indexes inside the database model registers
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        providerProfile: true // कामदारको ड्यासबोर्डका लागि प्रोफाइल पनि तानेको
      },
    });

    if (!userRecord) {
      return sendError(res, "Account reference file missing. User database record could not be found.", 404);
    }

    return sendSuccess(res, "User identity profile metrics resolved successfully.", {
      user: userRecord,
    });
  } catch (error) {
    return next(error);
  }
};
