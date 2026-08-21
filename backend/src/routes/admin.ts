import { Router } from "express";
import { getUsers, getProviders, verifyProvider, getAnalytics } from "../controllers/adminController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

/**
 * Global Middleware Boundary
 * Enforces strict authentication and role-gating across all underlying administrative paths.
 */
router.use(requireAuth, requireRole(["ADMIN"]));

/**
 * @route   GET /api/admin/users
 * @desc    Retrieve a comprehensive list of registered users on the SewaLink platform
 * @access  Private (Admin Only)
 */
router.get("/users", getUsers);

/**
 * @route   GET /api/admin/providers
 * @desc    Fetch all service provider profiles across Nepal for admin auditing
 * @access  Private (Admin Only)
 */
router.get("/providers", getProviders);

/**
 * @route   PATCH /api/admin/providers/:id/verify
 * @desc    Approve or reject a service professional's identity verification state
 * @access  Private (Admin Only)
 */
router.patch("/providers/:id/verify", verifyProvider);

/**
 * @route   GET /api/admin/analytics
 * @desc    Pull core business intelligence metrics and user distribution analytics
 * @access  Private (Admin Only)
 */
router.get("/analytics", getAnalytics);

export default router;
