import express from "express";
import { MealController } from "./meal.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.PROVIDER), MealController.createMeal);
router.get("/", MealController.getPublicMeals);
router.get("/my-meals", auth(UserRole.PROVIDER), MealController.getMyMeals);

router.get("/:id", MealController.getSingleMeal);
router.delete(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  MealController.deleteMeal
);



export const MealRoutes = router; 