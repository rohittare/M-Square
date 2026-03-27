"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const looksLikeJwt = (value?: string | null) =>
  typeof value === "string" && value.split(".").length === 3;

const AuthSessionSync = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = session?.customToken;
    if (typeof token !== "string" || token.length === 0) return;

    const userId =
      typeof session?.user?.id === "string" ? session.user.id : undefined;
    const role =
      typeof session?.user?.role === "string" ? session.user.role : undefined;
    const email =
      typeof session?.user?.email === "string" ? session.user.email : undefined;
    const shopIdRaw =
      typeof session?.shop_id === "string" ? session.shop_id : undefined;
    const shopId =
      shopIdRaw && !looksLikeJwt(shopIdRaw) && shopIdRaw !== token
        ? shopIdRaw
        : undefined;

    sessionStorage.setItem("access_token", token);
    sessionStorage.setItem("token_type", "Bearer");
    if (userId) sessionStorage.setItem("user_id", userId);
    if (email) sessionStorage.setItem("user_email", email);
    if (role) sessionStorage.setItem("user_role", role);
    if (shopId) sessionStorage.setItem("shop_id", shopId);
  }, [session, status]);

  return null;
};

export default AuthSessionSync;
