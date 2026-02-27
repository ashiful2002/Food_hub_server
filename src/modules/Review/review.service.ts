import { prisma } from "../../lib/prisma";
import { CreateReviewDTO, UpdateReviewDTO } from "../../types";

const createReview = async (payload: CreateReviewDTO) => {
  const { mealId, customerId, rating, comment } = payload;

  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) throw new Error("Meal not found");

  const existing = await prisma.review.findFirst({
    where: { mealId, customerId },
  });
  if (existing) throw new Error("You have already reviewed this meal");

  const review = await prisma.review.create({
    data: { mealId, customerId, rating, comment },
  });

  const reviews = await prisma.review.findMany({ where: { mealId } });
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  await prisma.meal.update({
    where: { id: mealId },
    data: { averageRating, totalReviews },
  });

  return review;
};

const getReviewsByMeal = async (mealId: string) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { customer: { select: { id: true, name: true, avatar: true } } },
  });
  if (!review) throw new Error("Review not found");
  return review;
};

const updateReview = async (
  id: string,
  customerId: string,
  payload: UpdateReviewDTO
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customerId !== customerId) {
    throw new Error("Unauthorized");
  }

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: payload,
  });

  const stats = await prisma.review.aggregate({
    where: { mealId: review.mealId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.meal.update({
    where: { id: review.mealId },
    data: {
      totalReviews: stats._count,
      averageRating: stats._avg.rating ?? 0,
    },
  });

  return updatedReview;
};

const deleteReview = async (id: string, customerId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.customerId !== customerId) throw new Error("Unauthorized");

  await prisma.review.delete({ where: { id } });

  const mealId = review.mealId;
  const reviews = await prisma.review.findMany({ where: { mealId } });
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  await prisma.meal.update({
    where: { id: mealId },
    data: { totalReviews, averageRating },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByMeal,
  getSingleReview,
  updateReview,
  deleteReview,
};
