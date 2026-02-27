import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { MealService } from "./meal.service";

const createMeal: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new Error("Unauthorized");
    }

    const result = await MealService.createMeal(req.body, req.user.id);

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

const getPublicMeals: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await MealService.getPublicMeals(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Public meals fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMyMeals: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new Error("Unauthorized");
    }

    const result = await MealService.getMyMeals(req.user.id, req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My meals fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleMeal: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await MealService.getSingleMeal(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Meal fetched successfully",
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

    const result = await MealService.deleteMeal(id as string, req.user);

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

export const MealController = {
  createMeal,
  getPublicMeals,
  getMyMeals,
  getSingleMeal,
  deleteMeal,
};
