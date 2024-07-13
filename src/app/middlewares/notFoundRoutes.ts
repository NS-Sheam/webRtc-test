import { NextFunction, Request, Response } from "express";
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const success = false;
  const status = 404;
  const message = `Requested path ${req.originalUrl} Not Found`;
  res.status(status).json({
    status,
    success,
    message,
  });
};

export default notFound;
