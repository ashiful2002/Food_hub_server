import { NextFunction, RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

// Create Order
const createOrder: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const payload = { ...req.body, customerId: req.user?.id };
    const order = await OrderService.createOrder(payload);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: any) {
    next(error);
  }
};
// Get all orders for logged-in customer
const getOrders: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const orders = await OrderService.getOrders(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get single order
const getOrderById: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const order = await OrderService.getOrderById(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update order status (PROVIDER role)
const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const order = await OrderService.updateOrderStatus(
      req.params.id as string,
      req.body.status
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  createOrder,
  getOrders,
  getOrderById,
  updateStatus,
};
