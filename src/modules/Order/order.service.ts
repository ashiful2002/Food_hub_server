import { OrderStatus } from "@prisma/client";
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

  // Fetch all meals from DB
  const mealIds = payload.items.map((i) => i.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } },
  });

  if (meals.length !== payload.items.length) {
    throw new Error("Some meals were not found");
  }

  // Ensure all meals belong to the same provider
  const providerId = meals[0].providerId;
  for (const meal of meals) {
    if (meal.providerId !== providerId) {
      throw new Error("All meals in one order must belong to the same provider");
    }
  }

  // Calculate total amount
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
            price: meal.price, // snapshot price
            name: meal.name,   // snapshot name
          };
        }),
      },
    },
    include: { items: true },
  });

  return order;
};

// Get all orders of a customer
const getOrdersByCustomer = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { orderedAt: "desc" },
  });
};

// Get single order by ID
const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");
  return order;
};

// Update order status (for provider)
const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });
};

export const OrderService = {
  createOrder,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
}; 