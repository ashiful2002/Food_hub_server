import { OrderStatus, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type OrderItemPayload = {
  mealId: string;
  quantity: number;
};

type CreateOrderPayload = {
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  items: OrderItemPayload[];
  customerId: string;
};

const createOrder = async (payload: CreateOrderPayload) => {
  if (!payload.items || payload.items.length === 0) {
    throw new Error("No meals provided for the order");
  }

  const mealIds = payload.items.map((i) => i.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } },
  });

  if (meals.length !== payload.items.length) {
    throw new Error("Some meals were not found");
  }

  const providerId = meals[0].providerId;
  for (const meal of meals) {
    if (meal.providerId !== providerId) {
      throw new Error(
        "All meals in one order must belong to the same provider"
      );
    }
  }

  const totalAmount = payload.items.reduce((sum, item) => {
    const meal = meals.find((m) => m.id === item.mealId)!;
    return sum + meal.price * item.quantity;
  }, 0);

  // Create order with order items
  const order = await prisma.order.create({
    data: {
      customerId: payload.customerId,
      providerId,
      totalAmount,
      street: payload.street,
      city: payload.city,
      postalCode: payload.postalCode,
      phone: payload.phone,
      items: {
        create: payload.items.map((item) => {
          const meal = meals.find((m) => m.id === item.mealId)!;
          return {
            mealId: meal.id,
            quantity: item.quantity,
            price: meal.price,
            name: meal.name,
          };
        }),
      },
    },
    include: { items: true },
  });

  return order;
};
const getOrders = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { customerId: userId },
    
      orderBy: { orderedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({
      where: { customerId: userId },
    }),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getOrderById = async (
  orderId: string,
  userId: string,
  role: UserRole
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      customer: true,
      provider: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // ADMIN can access everything
  if (role === "ADMIN") {
    return order;
  }

  // CUSTOMER can only access their own order
  if (role === "CUSTOMER") {
    if (order.customerId !== userId) {
      throw new Error("You are not authorized to view this order");
    }
    return order;
  }

  // PROVIDER can only access their own provider orders
  if (role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!providerProfile) {
      throw new Error("Provider profile not found");
    }

    if (order.providerId !== providerProfile.id) {
      throw new Error("You are not authorized to view this order");
    }

    return order;
  }

  throw new Error("Invalid role");
};

export const OrderService = {
  createOrder,
  getOrders,
  getOrderById,
  // updateOrderStatus,
};
