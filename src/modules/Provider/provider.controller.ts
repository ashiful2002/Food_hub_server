import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { providerService } from "./provider.service";
import { createECDH } from "node:crypto";
const createProviderProfile: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    // const userId = req.user?.id;

    // if (!userId) {
    //   throw new Error("Unauthorized");
    // }
    console.log(req.body);

    const result = await providerService.createProviderProfile(
      req.body
      // userId
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Provider profile created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getAllProviders: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const result = await providerService.getAllProviders(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All providers fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getMyProviderProfile: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const id = req.user?.id;
    console.log({ "logged in user id:": id });

    const result = await providerService.getMyProviderProfile(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get my Provider profile successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getSingleProvider: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await providerService.getSingleProvider(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "single Provide fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const createMeal: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new Error("Unauthorized");
    }

    const result = await providerService.createMeal(req.body, req.user.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Meal created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateMeal: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const result = await providerService.updateMeal(
      id as string,
      payload,
      req.user
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Meal deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const deleteMeal: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const result = await providerService.deleteMeal(id as string, req.user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Meal deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
// Update order status (PROVIDER role)
const updateStatus: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  console.log(id, req.body);

  try {
    const order = await providerService.updateOrderStatus(
      id as string,
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
export const ProviderController = {
  createMeal,
  createProviderProfile,
  getAllProviders,
  getMyProviderProfile,
  getSingleProvider,
  deleteMeal,
  updateMeal,
  updateStatus,
};
