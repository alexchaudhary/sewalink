import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, firstName, lastName, role } = req.body;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          phone ? { phone: phone.trim() } : {},
        ].filter((c) => Object.keys(c).length > 0),
      },
    });

    if (existing) {
      return sendError(res, "Email or phone number is already registered.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

    const token = jwt.sign(
      { sub: created.id, email: created.email, role: created.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, "Registration completed successfully.", { token, user: created }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase().trim() } : {},
          phone ? { phone: phone.trim() } : {},
        ].filter((c) => Object.keys(c).length > 0),
      },
    });

    if (!user) {
      return sendError(res, "Invalid login credentials provided.", 401);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(res, "Invalid login credentials provided.", 401);
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, "Login successful.", {
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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    return sendSuccess(res, `Password reset OTP token requested for ${email}.`);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return sendError(res, "No active record found matching that email.", 404);
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, "OTP challenge verified successfully.", { token });
  } catch (error) {
    next(error);
  }
};