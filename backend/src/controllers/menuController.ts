// src/controllers/menuController.ts
import { Request, Response } from 'express';
import * as menuService from '../services/menuService';

export const getMenus = async (req: Request, res: Response) => {
  const restaurantId = parseInt(req.params.id);

  try {
    const menus = await menuService.getMenuItemsByRestaurantId(restaurantId);
    res.json(menus);
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Failed to fetch menu' });
  }
};

export const addMenuItem = async (req: Request, res: Response) => {
  const restaurantId = parseInt(req.params.id);
  const { name, price } = req.body;

  if (!name || !price) {
     res.status(400).json({ error: 'Name and price are required' });
     return
  }

  try {
    const menuItem = await menuService.createMenuItem(restaurantId, { name, price });
    res.status(201).json(menuItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add menu item' });
  }
};
