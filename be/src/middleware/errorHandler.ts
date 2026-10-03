import type { NextFunction, Request, Response } from 'express';
// import { logger } from '../logger.js';


export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  if (status >= 500) {
    // logger.error('unhandled request error', { err, requestId: req.requestId });
  }

  res.status(status).json({ message, requestId: req.requestId });
};
