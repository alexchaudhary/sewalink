import { Router } from "express";
import {
  getProviderList,
  getProviderById,
  updateProviderProfile,
  uploadProviderAvatar,
} from "../controllers/providerController";
import {
  authMiddleware,
  requireRole,
} from "../middleware/auth";
import multer from "multer";

const router = Router();

/**
 * Configure Multer to keep uploaded files
 * in memory before forwarding them to Cloudinary.
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/**
 * Public provider marketplace endpoints.
 */
router.get("/", getProviderList as any);

/**
 * Provider detail endpoint.
 *
 * Supports both ProviderProfile.id and User.id.
 */
router.get("/:id", getProviderById as any);

/**
 * Secured provider profile endpoints.
 */
router.put(
  "/profile",
  authMiddleware as any,
  requireRole("PROVIDER") as any,
  updateProviderProfile as any
);

router.post(
  "/avatar",
  authMiddleware as any,
  requireRole("PROVIDER") as any,
  upload.single("avatar"),
  uploadProviderAvatar as any
);

export default router;