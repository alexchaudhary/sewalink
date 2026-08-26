import { Router } from "express";
import { getProviderList, getProviderById, updateProviderProfile, uploadProviderAvatar } from "../controllers/providerController";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = Router();

// Configure Multer to intercept raw file binaries safely inside active server RAM buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Strict 5MB size gateway cap
});

/**
 * Public Talent Discovery View Channels Matrix
 */
router.get("/", getProviderList as any);
router.get("/:id", getProviderById as any);

/**
 * Secured Professional Workforce Context Lifecycle Configurations
 */
// 1. Core Profile Text Metrics Form Handler Router Nodes
router.put("/profile", authMiddleware as any, updateProviderProfile as any);

// 2. Direct Media Binary Asset Stream Controller Hook Up Node
router.post(
  "/avatar", 
  authMiddleware as any, 
  upload.single("avatar"), // Multer hooks securely to grab the form-data parameter named 'avatar'
  uploadProviderAvatar as any
);

export default router;
