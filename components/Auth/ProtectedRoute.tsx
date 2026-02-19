"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuthSnapshot, type UserRole } from "@/lib/auth";

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  loginRedirect?: string;
  unauthorizedRedirect?: string;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
  loginRedirect = "/login",
  unauthorizedRedirect = "/unauthorized",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const { isAuthenticated, role } = getAuthSnapshot();

    if (!isAuthenticated) {
      router.replace(loginRedirect);
      return;
    }

    if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
      router.replace(unauthorizedRedirect);
      return;
    }

    setAuthorized(true);
  }, [allowedRoles, loginRedirect, unauthorizedRedirect, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
