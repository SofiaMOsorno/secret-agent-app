import 'express-session';

declare module 'express-session' {
    interface SessionData {
      userId: string | undefined;
      isAuthenticated?: boolean;
      userRole?: 'agent' | 'leader';
    }
  }