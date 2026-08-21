import { Response } from "express";

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
};

export const sendError = (
  res: Response,
  message: string = "Something went wrong",
  statusCode: number = 500,
  errors: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};