import type { Request, Response, NextFunction } from 'express';

export type MiddlewareType = (req: Request, res: Response, next: NextFunction) => void;
export type RequestType = (req: Request, res: Response, next: NextFunction) => Promise<void>;
