// src/services/restaurantService.ts
import prisma from '../prismaClient';

export const createRestaurant = async (name: string, country: string) => {
  if (!name || !country) {
    throw new Error('Name and country are required');
  }

  const newRestaurant = await prisma.restaurant.create({
    data: {
      name,
      country,
    },
  });

  return newRestaurant;
};
