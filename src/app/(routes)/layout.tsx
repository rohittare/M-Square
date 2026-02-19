"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function UserRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["USER"]} loginRedirect="/login">
      {children}
    </ProtectedRoute>
  );
}
