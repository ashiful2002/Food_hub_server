import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { MealRoutes } from "../modules/Meal/meal.route";
import { ProviderRoutes } from "../modules/Provider/provider.route";
import { CategoryRoutes } from "../modules/Categories/categories.route";
import { OrderItemRoutes } from "../modules/OrderItem/orderItem.route";
import { OrderRoutes } from "../modules/Order/order.route";

const router = Router();
// router.use("/auth", AuthRoutes);
// router.use("/meal", MealRoutes);

const routerManager = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/meal",
    route: MealRoutes,
  },
  {
    path: "/provider",
    route: ProviderRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/order-item",
    route: OrderItemRoutes,
  },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;
