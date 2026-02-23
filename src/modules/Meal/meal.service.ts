import { includes } from "zod";
import { prisma } from "../../lib/prisma";

const createMeal = async (payload: any, userId: string) => {
 
  const provider = await prisma.providerProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!provider) {
    throw new Error("Provider profile not found");
  }
  const result = await prisma.meal.create({
    data: { ...payload, providerId: provider.id },
  });
  return result;
};
// get all meals
const getMeals = async (userId: string) => {
  const where = {
    provider: { userId },
  };

  const [total, data] = await prisma.$transaction([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    }),
  ]);

  // return data;
  return {
    meta: { total },
    data,
  };
};

// get single meal
const getSingleMeal = async (mealId: string) => {
  const result = await prisma.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      provider: true,
    },
  });
  console.log({ mealId, result });

  return result;
};
export const MealService = {
  createMeal,
  getMeals,
  getSingleMeal,
};
