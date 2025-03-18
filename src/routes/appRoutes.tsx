
import { RouteObject } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { studentRoutes } from "./studentRoutes";
import { teacherRoutes } from "./teacherRoutes";
import { adminRoutes } from "./adminRoutes";

// Combine all routes
export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes,
];
