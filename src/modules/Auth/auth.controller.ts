import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
 
const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",

      //  ------ for production
      //  secure: true,
      //   httpsOnly: false,
      //   sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfull",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMe: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.getMe(req.user?.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "get current user successfull",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthService.updateProfile(req.user?.id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
export const AuthController = {
  createUser,
  loginUser,
  getMe,
  updateProfile,
};
