import jwt from 'jsonwebtoken';
import { User } from '../types/User';

export function generateToken(user: User): string {
  return jwt.sign(user, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1d'
  });
}
