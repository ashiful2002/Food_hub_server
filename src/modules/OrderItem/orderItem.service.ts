import { prisma } from "../../lib/prisma";

// --- DTOs --- //
export type CreateOrderItemDTO = {
  orderId: string;
  mealId: string;
  quantity: number;
  price: number;
  name: string;
};

export type UpdateOrderItemDTO = {
  quantity?: number;
  price?: number;
  name?: string;
};



// --- Enhanced Service --- //
const createOrderItem = async (payload: CreateOrderItemDTO) => {
  const { orderId, mealId, quantity } = payload;

  // 1️⃣ Validate the meal exists
  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) throw new Error("Meal not found");

  // 2️⃣ Validate the order exists
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  // 3️⃣ Prevent mismatched provider (optional, but good practice)
  if (meal.providerId !== order.providerId) {
    throw new Error("Meal does not belong to the same provider as the order");
  }

  // 4️⃣ Prepare the order item data with snapshot (price & name)
  const orderItemData = {
    orderId,
    mealId,
    quantity,
    price: meal.price, // snapshot price at time of order
    name: meal.name,   // snapshot name at time of order
  };

  // 5️⃣ Create the order item
  return await prisma.orderItem.create({ data: orderItemData });
};

// --- Optional: create multiple order items in transaction ---
const createMultipleOrderItems = async (items: CreateOrderItemDTO[]) => {
  return await prisma.$transaction(
    items.map((item) =>
      prisma.orderItem.create({
        data: item,
      })
    )
  );
};

// --- Get all order items --- //
const getOrderItems = async (orderId?: string) => {
  return await prisma.orderItem.findMany({
    where: orderId ? { orderId } : {},
    include: { meal: true, order: true }, // optional, join info
  });
};

// --- Get single order item --- //
const getSingleOrderItem = async (id: string) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id },
    include: { meal: true, order: true },
  });
  if (!orderItem) throw new Error("OrderItem not found");
  return orderItem;
};

// --- Update order item --- //
const updateOrderItem = async (id: string, payload: UpdateOrderItemDTO) => {
  const updated = await prisma.orderItem.update({
    where: { id },
    data: payload,
  });
  return updated;
};

// --- Delete order item --- //
const deleteOrderItem = async (id: string) => {
  return await prisma.orderItem.delete({ where: { id } });
};

export const OrderItemService = {
  createOrderItem,
  createMultipleOrderItems,
  getOrderItems,
  getSingleOrderItem,
  updateOrderItem,
  deleteOrderItem,
}; 