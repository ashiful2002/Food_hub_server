import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryController } from "./categories.controller";

const router = express.Router();

// Public
router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getSingleCategory);

// Admin only
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);
router.patch("/:id", auth(UserRole.ADMIN), CategoryController.updateCategory);
router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
 