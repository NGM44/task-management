import { Navigate, useRoutes } from "react-router-dom";
import DashboardPage from "./page/dashboard";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <DashboardPage />,
    },
    { path: "*", element: <DashboardPage /> },
  ]);
}
