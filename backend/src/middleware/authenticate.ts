import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/User';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // pastikan ini aman

export interface RequestWithUser extends Request {
  user?: User;
}

export function authenticate(req: RequestWithUser, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    req.user = decoded; // ini akan masuk ke Express Request via custom typing
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}
