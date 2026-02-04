"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AuthSessionSync() {
    const { data: session } = useSession();

    useEffect(() => {
        const token = session?.customToken;
        if (!token) return;

        sessionStorage.setItem("access_token", token);
        sessionStorage.setItem("token_type", "Bearer");

        if (session?.user?.email) {
            sessionStorage.setItem("user_email", session.user.email);
        }
    }, [session?.customToken, session?.user?.email]);

    return null;
}
