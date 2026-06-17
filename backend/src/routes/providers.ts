import { Router } from "express";
import { getProviderList, getProviderById, updateProviderProfile } from "../controllers/providerController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getProviderList);
router.get("/:id", getProviderById);
router.put("/me", requireAuth, updateProviderProfile);

export default router;
