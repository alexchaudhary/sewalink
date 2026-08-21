import { Router } from "express";
import { getUsers, getProviders, verifyProvider, getAnalytics } from "../controllers/adminController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/users", getUsers);
router.get("/providers", getProviders);
router.patch("/providers/:id/verify", verifyProvider);
router.get("/analytics", getAnalytics);

export default router;