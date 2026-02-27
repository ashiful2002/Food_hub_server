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

const getOrders = async (userId: string) => {
  // Fetch user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) throw new Error("User not found");

  let orders;

  switch (user.role) {
    case "CUSTOMER":
      orders = await prisma.order.findMany({
        where: { customerId: user.id },
        include: { items: true, provider: true },
        orderBy: { orderedAt: "desc" },
      });
      break;

    case "PROVIDER":
      // Get provider profile ID
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (!providerProfile) throw new Error("Provider profile not found");

      orders = await prisma.order.findMany({
        where: { providerId: providerProfile.id },
        include: { items: { include: { meal: true } }, customer: true },
        orderBy: { orderedAt: "desc" },
      });
      break;

    case "ADMIN":
      orders = await prisma.order.findMany({
        include: { items: true, customer: true, provider: true },
        orderBy: { orderedAt: "desc" },
      });
      break;

    default:
      throw new Error("Invalid user role");
  }

  return orders;
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
const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    throw new Error("Cannot update a completed order");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};

export const OrderService = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
