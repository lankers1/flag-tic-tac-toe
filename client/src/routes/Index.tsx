import { createBrowserRouter, Navigate } from "react-router-dom";
import { Game } from "../pages/Game";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/game" />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);
