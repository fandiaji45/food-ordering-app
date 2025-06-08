import { Router } from 'express';
import prisma from '../prismaClient';
import { createMenuItem } from '../services/menuService';
import { createRestaurant } from '../services/restaurantService';
import { authorize } from '../middleware/authorize';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { menu: true },
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});


// GET /api/restaurants/:id/menus
router.get('/:id/menus', async (req, res) => {
  const restaurantId = parseInt(req.params.id);

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { menu: true }, // asumsi relasinya bernama `menu`
    });

    if (!restaurant) {
       res.status(404).json({ error: 'Restaurant not found' });
       return
    }

    res.json(restaurant.menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
  
});


// POST /api/restaurants — Create new restaurant (admin & manager only)
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  const { name, country } = req.body;

  try {
    const restaurant = await createRestaurant(name, country);
    res.status(201).json(restaurant);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/restaurants/:id/menu — Add menu to a restaurant
router.post('/:id/menu', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const { name, price } = req.body;

  try {
    const menu = await createMenuItem(restaurantId, { name, price });
    res.status(201).json(menu);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
