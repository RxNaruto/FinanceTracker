import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
