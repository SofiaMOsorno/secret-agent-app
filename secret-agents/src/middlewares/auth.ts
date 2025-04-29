import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.redirect('/login');
    return;
  }
  next();
}