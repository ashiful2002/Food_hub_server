import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

// Create Order
const createOrder: RequestHandler = async (req, res) => {
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
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order creation failed",
      data: error.message,
    });
  }
};

// Get all orders for logged-in customer
const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await OrderService.getOrdersByCustomer(req.user?.id!);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Fetching orders failed",
      data: error.message,
    });
  }
};

// Get single order
const getOrder: RequestHandler = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Order not found",
      data: error.message,
    });
  }
};

// Update order status (PROVIDER role)
const updateStatus: RequestHandler = async (req, res) => {
  try {
    const order = await OrderService.updateOrderStatus(req.params.id as string, req.body.status);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order status update failed",
      data: error.message,
    });
  }
};

export const OrderController = {
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
}; 