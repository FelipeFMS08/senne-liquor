import { authClient } from "@/lib/auth-client";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const data = authClient.useSession();

  const { isPending } = data;

  if (isPending === true) {
    return <div>Carregando sessão...</div>;
  }

  if (data === null) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}