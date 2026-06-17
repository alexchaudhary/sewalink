import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json({ users });
};

export const getProviders = async (_req: Request, res: Response) => {
  const providers = await prisma.providerProfile.findMany({
    include: { user: true, categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json({ providers });
};

export const verifyProvider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const provider = await prisma.providerProfile.update({
    where: { id },
    data: { isVerified: true, verificationStatus: "VERIFIED" },
  });
  res.json({ message: `Provider verified`, provider });
};

export const getAnalytics = async (_req: Request, res: Response) => {
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.providerProfile.count();
  const totalBookings = await prisma.booking.count();
  const revenue = await prisma.payment.aggregate({ _sum: { amount: true } });
  res.json({ analytics: { totalUsers, totalProviders, totalBookings, revenue: revenue._sum.amount || 0 } });
};
