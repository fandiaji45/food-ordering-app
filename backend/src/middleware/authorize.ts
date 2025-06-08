import { Request, Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express';
import { User } from '../types/User';

interface RequestWithUser extends ExpressRequest {
  user?: User;
}

export function authorize(roles: string[]) {
  return (req: RequestWithUser , res: Response, next: NextFunction): void => {
        console.log('User di authorize:', req.user); // <--- Tambah ini

          const user = req.user;
   //const user = (req as any).user as User;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    next();
  };
}
