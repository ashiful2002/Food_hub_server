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
const getMeals = async (userId: string, filters: any) => {
  const {
    name,
    categoryId,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  const where: any = {
    providerId: provider.id,
  };

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const total = await prisma.meal.count({ where });

  const data = await prisma.meal.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
    include: {
      reviews: true,
      provider: true,
    },
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};
const getPublicMeals = async (filters: any) => {
  const {
    name,
    categoryId,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {
    isAvailable: true,
  };

  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const total = await prisma.meal.count({ where });
  const data = await prisma.meal.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
    include: {
      provider: true,
      reviews: true,
    },
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};
const getMyMeals = async (userId: string, filters: any) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  // ✅ Pagination
  const {
    page = "1",
    limit = "10",
    name,
    categoryId,
    minPrice,
    maxPrice,
  } = filters;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {
    providerId: provider.id,
  };

  // ✅ Optional filters (same as public)
  if (name) {
    where.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const total = await prisma.meal.count({ where });

  const data = await prisma.meal.findMany({
    where,
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
    include: {
      reviews: true,
      category: true,
    },
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};

// get single meal with increment
const getSingleMeal = async (mealId: string) => {
  const result = await prisma.meal.update({
    where: {
      id: mealId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      provider: true,
      reviews: true,
      category: true,
    },
  });

  return result;
};
const deleteMeal = async (mealId: string, user: any) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) throw new Error("Meal not found");

  // If provider → check ownership
  if (user.role === "PROVIDER") {
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (meal.providerId !== provider?.id) {
      throw new Error("Forbidden");
    }
  }

  return prisma.meal.delete({
    where: { id: mealId },
  });
};
export const MealService = {
  createMeal,
  getMeals,
  getSingleMeal,
  getPublicMeals,
  deleteMeal,
  getMyMeals,
};
