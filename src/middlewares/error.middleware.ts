import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../utils/api";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof MongooseError.ValidationError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: "Invalid id format" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
