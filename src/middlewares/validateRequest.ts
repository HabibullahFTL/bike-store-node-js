import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { catchAsync } from '../utils/catchAsync';

export const validateRequest = (validationSchema: z.AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await validationSchema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};
