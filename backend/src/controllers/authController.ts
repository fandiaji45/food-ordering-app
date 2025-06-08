import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

//register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, country } = req.body;

  if (!email || !password || !name || !role || !country) {
     res.status(400).json({ error: 'All fields are required' });
     return
  }

  const roleUpper = (role as string).toUpperCase();

  const isValidRole = (value: string): value is Role => {
    return Object.values(Role).includes(value as Role);
  };

  if (!isValidRole(roleUpper)) {
      res.status(400).json({ error: 'Invalid role value' });
      return
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ error: 'Email already registered' });
       return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: roleUpper,
        country, 
      },
    });

    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//login

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Kalau mau, bisa generate token JWT di sini (optional)
      // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });


    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
      // token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
