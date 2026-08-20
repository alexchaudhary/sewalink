import { Router } from "express";
import { getProviderList, getProviderById, updateProviderProfile } from "../controllers/providerController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateProviderSchema, getProvidersQuerySchema } from "../validations/providerValidation";

const router = Router();

router.get("/", validate(getProvidersQuerySchema), getProviderList);
router.get("/:id", getProviderById);
router.put("/me", requireAuth, validate(updateProviderSchema), updateProviderProfile);

export default router;