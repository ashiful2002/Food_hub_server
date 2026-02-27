import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { providerService } from "./provider.service";
const createProviderProfile: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await providerService.createProviderProfile(
      req.body,
      userId
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
const getMyProviderProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;

    const result = await providerService.getMyProviderProfile(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get all Providers successfully",
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
  console.log(id);

  try {
    const result = await providerService.getSingleProvider(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Provider profile fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ProviderController = {
  createProviderProfile,
  getAllProviders,
  getMyProviderProfile,
  getSingleProvider,
};
 