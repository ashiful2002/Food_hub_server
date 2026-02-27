import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER), OrderController.createOrder);
router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER),
  OrderController.getOrders
);
router.get(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
  OrderController.getOrderById
);
router.patch(
  "/status/:id",
  auth(UserRole.PROVIDER),
  OrderController.updateStatus
);

export const OrderRoutes = router;
