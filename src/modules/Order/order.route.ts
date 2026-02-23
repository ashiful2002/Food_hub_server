import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Customer routes
router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);
router.get("/", auth(UserRole.CUSTOMER), OrderController.getOrders);
router.get("/:id", auth(UserRole.CUSTOMER), OrderController.getOrder);

// Provider routes (for status update)
router.patch("/:id/status", auth(UserRole.PROVIDER), OrderController.updateStatus);

export const OrderRoutes = router;