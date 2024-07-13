import { NextFunction, Request, Response } from "express";
import config from "../config";


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  let errorSource = [
    {
      path: "",
      message,
    },
  ];
  return res.status(status).json({
    success: false,
    message,
    errorSource,
    stack: config.node_env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
