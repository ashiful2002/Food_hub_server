import { NextFunction, RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./categories.service";

const createCategory: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getCategories: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await CategoryService.getCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleCategory: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const result = await CategoryService.getSingleCategory(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateCategory: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const result = await CategoryService.updateCategory(
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteCategory: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    await CategoryService.deleteCategory(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  } catch (error: any) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
