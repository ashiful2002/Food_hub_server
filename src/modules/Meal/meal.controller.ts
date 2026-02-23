import { Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { MealService } from "./meal.service";

const createMeal: RequestHandler = async (req: Request, res: Response) => {
  try {
    const result = await MealService.createMeal(req.body, req.user?.id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Meal created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Meal creation failed",
      data: error.message,
    });
  }
};
// get all meals
const getMeals: RequestHandler = async (req: Request, res: Response) => {
  try {
    console.log("get user before", req.user?.id);

    const result = await MealService.getMeals(req.user?.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Get all meal successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Getting meal failed",
      data: error.message,
    });
  }
};
// get all meals
const getSingleMeal: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MealService.getSingleMeal(id as string);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Get a meal successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Getting  a meal failed",
      data: error.message,
    });
  }
};

export const MealController = { createMeal, getMeals, getSingleMeal };
