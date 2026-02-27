export type MealFilterOptions = {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
};

export type CreateReviewDTO = {
  mealId: string;
  rating: number;
  comment?: string;
  customerId: string;
};

export type UpdateReviewDTO = {
  rating?: number;
  comment?: string;
};
