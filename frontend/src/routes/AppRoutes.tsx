import { Routes, Route } from "react-router-dom";
import { routeConfig, wrapWithLayout } from "@/routes/routeConfig";

export default function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={wrapWithLayout(route)}
        />
      ))}
    </Routes>
  );
}
