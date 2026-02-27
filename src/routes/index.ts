import { AuthRoutes } from "../modules/Auth/auth.route";
import { MealRoutes } from "../modules/Meal/meal.route";
import { ProviderRoutes } from "../modules/Provider/provider.route";
import { CategoryRoutes } from "../modules/Categories/categories.route";
import { OrderItemRoutes } from "../modules/OrderItem/orderItem.route";
import { OrderRoutes } from "../modules/Order/order.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { Router } from "express";

const router = Router();

const routerManager = [
  { path: "/auth", route: AuthRoutes },

  { path: "/meals", route: MealRoutes },
  { path: "/providers", route: ProviderRoutes },
  { path: "/categories", route: CategoryRoutes },

  { path: "/orders", route: OrderRoutes },
  { path: "/reviews", route: ReviewRoutes },

  // { path: "/providers", route: ProviderRoutes },

  // Admin private
  // { path: "/admin", route: AdminRoutes },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;
