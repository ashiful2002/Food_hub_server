import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProviderController } from "./provider.controller";

const router = express.Router();

// router.post(
//   "/",
//   auth(UserRole.PROVIDER, UserRole.ADMIN),
//   ProviderController.createProviderProfile
// );
router.get("/", ProviderController.getAllProviders);
router.get(
  "/me",
  auth(UserRole.PROVIDER),
  ProviderController.getMyProviderProfile
);
router.post("/meals", auth(UserRole.PROVIDER), ProviderController.createMeal);

router.get("/:id", ProviderController.getSingleProvider);

router.patch(
  "/meals/:id",
  auth(UserRole.PROVIDER),
  ProviderController.updateMeal
);
router.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  ProviderController.updateStatus
);

router.delete(
  "/meals/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  ProviderController.deleteMeal
);

export const ProviderRoutes = router;
