import { Session } from 'express-session';

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        userId?: string;
        isAuthenticated?: boolean;
        userRole?: 'agent' | 'leader';
      }
    }
  }
}