import { NextFunction, RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

 const createReview: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const payload = req.body;
    const customerId = req.user?.id;
    const result = await ReviewService.createReview({ ...payload, customerId });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// --- Get all reviews for a meal ---
const getReviewsByMeal: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { mealId } = req.params;
    const result = await ReviewService.getReviewsByMeal(mealId as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// --- Get single review ---
const getSingleReview: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await ReviewService.getSingleReview(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// --- Update review ---
const updateReview: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;
    const payload = req.body;

    const result = await ReviewService.updateReview(
      id as string,
      customerId!,
      payload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// --- Delete review ---
const deleteReview: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    await ReviewService.deleteReview(id as string, customerId!);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getReviewsByMeal,
  getSingleReview,
  updateReview,
  deleteReview,
};
