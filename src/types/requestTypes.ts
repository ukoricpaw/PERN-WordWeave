import type { Request, Response, NextFunction } from 'express';

export type MiddlewareType = (req: Request, res: Response, next: NextFunction) => void;
export type RequestType = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export type QueryOfRequest = Request['query'];
export type BodyOfRequest = Request['body'];
export type CookiesOfRequest = Request['cookies'];
export type ParamsOfRequest = Request['params'];
