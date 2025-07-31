import type { NextFunction, Request, Response } from 'express';

export const responseWrapper = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const oldJson = res.json;

  res.json = function (data) {
    return oldJson.call(this, {
      success: true,
      data,
    });
  };

  next();
};
