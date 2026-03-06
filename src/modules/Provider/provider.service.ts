import { Meal, OrderStatus, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createProviderProfile = async (payload: any) => {
  const { id } = payload;
  const existing = await prisma.providerProfile.findUnique({
    where: { id },
  });

  if (existing) {
    throw new Error("Provider Profile already exists");
  }

  const result = await prisma.providerProfile.create({
    data: {
      ...payload,
      // userId,
    },
  });

  return result;
};

const getAllProviders = async (query: any) => {
  const { page = "1", limit = "10" } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const total = await prisma.providerProfile.count();

  const providers = await prisma.providerProfile.findMany({
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: providers,
  };
};

const getSingleProvider = async (id: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: {
      id: id,
    },
    include: {
      // user: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //     avatar: true,
      //   },
      // },
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
          views: true,
          image: true,
          isAvailable: true,
        },
      },
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  return provider;
};
const getMyProviderProfile = async (id: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: id },
    include: {
      meals: true,
    },
  });

  if (!provider) {
    throw new Error("Provider profile not found");
  }

  return provider;
};

// create meal
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

const updateMeal = async (mealId: string, data: Partial<Meal>, user: any) => {
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

  const updated = prisma.meal.update({
    where: {
      id: mealId,
    },
    data: {
      ...data,
    },
  });
  return updated;
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
const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Order not found");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};

export const providerService = {
  createMeal,
  createProviderProfile,
  getAllProviders,
  getMyProviderProfile,
  getSingleProvider,
  deleteMeal,
  updateMeal,
  updateOrderStatus,
};
