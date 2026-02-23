import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { OrderItemService } from "./orderItem.service";

const createOrderItem: RequestHandler = async (req, res) => {
  try {
    const result = await OrderItemService.createOrderItem(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order Item created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order Item creation failed",
      data: error.message,
    });
  }
};

const getOrderItems: RequestHandler = async (req, res) => {
  try {
    const result = await OrderItemService.getOrderItems();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order Item retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Fetching Order Item  failed",
      data: error.message,
    });
  }
};

const getSingleOrderItem: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await OrderItemService.getSingleOrderItem(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order Item retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Order Item not found",
      data: error.message,
    });
  }
};

const updateOrderItem: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const result = await OrderItemService.updateOrderItem(
      id as string,
      payload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order Item successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order Item update failed",
      data: error.message,
    });
  }
};

const deleteOrderItem: RequestHandler = async (req, res) => {
  try {
    await OrderItemService.deleteOrderItem(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order Item deleted successfully",
      data: null,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order Item deletion failed",
      data: error.message,
    });
  }
};

export const OrderItemController = {
  createOrderItem,
  getOrderItems,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
 