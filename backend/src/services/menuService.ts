// src/services/menuService.ts
import prisma from '../prismaClient';


export const getMenuItemsByRestaurantId = async (restaurantId: number) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { menu: true }, // pastikan relasi `menu` sudah ada di model Prisma
  });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  return restaurant.menu;
};


// ✅ versi yang benar dan ringkas
export async function createMenuItem(
  restaurantId: number,
  data: {
    name: string;
    price: number;
  }
) {
  return prisma.menu.create({
    data: {
      name: data.name,
      price: data.price,
      restaurant: {
        connect: { id: restaurantId },
      },
    },
  });
}


// export const createMenu = async (restaurantId: number, name: string, price: number) => {
//   // Validasi input
//   if (!name || !price || !restaurantId) {
//     throw new Error('Missing required fields');
//   }

//   // Cek apakah restoran ada
//   const restaurant = await prisma.restaurant.findUnique({
//     where: { id: restaurantId },
//   });

//   if (!restaurant) {
//     throw new Error('Restaurant not found');
//   }

//   // Buat menu
//   const newMenu = await prisma.menu.create({
//     data: {
//       name,
//       price,
//       restaurantId,
//     },
//   });

//   return newMenu;
// };
