import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError.js';

export const errorHandlerMiddleware = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  res.status(500).json({ message: 'Непредвиденная ошибка' });
};
