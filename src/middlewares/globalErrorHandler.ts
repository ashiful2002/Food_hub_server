import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || 500;
  let errorMessage = "Internal server error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    ((statusCode = 400), (errorMessage = "Incomming client validation Error"));
  }
  res.status(statusCode);
  res.json({ success: false, message: errorMessage, error: errorDetails });
}
 