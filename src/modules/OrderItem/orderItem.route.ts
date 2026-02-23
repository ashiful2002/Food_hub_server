import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { OrderItemController } from "./orderItem.controller";

const router = express.Router();


router.post("/", auth(UserRole.PROVIDER), OrderItemController.createOrderItem);
router.get("/", auth(UserRole.PROVIDER), OrderItemController.getOrderItems);
router.get(
  "/:id",
  auth(UserRole.PROVIDER),
  OrderItemController.getSingleOrderItem
);
router.patch(
  "/:id",
  auth(UserRole.PROVIDER),
  OrderItemController.updateOrderItem
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  OrderItemController.deleteOrderItem
);

export const OrderItemRoutes = router;
 