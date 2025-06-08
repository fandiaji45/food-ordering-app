// src/routes/menuRoutes.ts
import express from 'express';
import { getMenus, addMenuItem } from '../controllers/menuController';

const router = express.Router();

// GET /api/restaurants/:id/menus
router.get('/:id/menus', getMenus);

// POST /api/restaurants/:id/menus
router.post('/:id/menus', addMenuItem);

export default router;
