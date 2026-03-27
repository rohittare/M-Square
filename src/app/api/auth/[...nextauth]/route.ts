import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { cookies } from "next/headers";

declare module "next-auth" {
    interface Session {
        customToken?: string;
        shop_id?: string;
        user: {
            id?: string;
            role?: string;
        } & DefaultSession["user"];
    }
    interface User {
        role?: string;
        userId?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        customToken?: string;
        role?: string;
        userId?: string;
        shopId?: string;
    }
}

const APP_TOKEN_COOKIE = "app_token";
const ROLE_COOKIE = "auth_role";

const normalizeRole = (raw?: string | null) => {
    if (!raw) return undefined;
    const cleaned = raw.toUpperCase().replace(/^ROLE_/, "");
    if (cleaned === "OWNER") return "SHOP";
    if (cleaned === "SHOP" || cleaned === "USER" || cleaned === "ADMIN") {
        return cleaned;
    }
    return undefined;
};

const coerceString = (value: unknown) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return undefined;
};

const looksLikeJwt = (value?: string | null) =>
    typeof value === "string" && value.split(".").length === 3;

const decodeJwtPayload = (token: string) => {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return null;
        const json = Buffer.from(payloadPart, "base64url").toString("utf8");
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
};

const extractShopId = (payload: Record<string, unknown> | null) =>
    coerceString(payload?.shopId ?? payload?.shop_id ?? payload?.shopID ?? payload?.sid);

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            idToken: true,
        }),

    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.type === "oauth" && user?.email) {
                const cookieStore = await cookies();
                const role = cookieStore.get(ROLE_COOKIE)?.value ?? "user";

                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER}/auth/oauth`,
                        {
                            idToken: account.id_token, 
                            role,
                        }
                    );


                    const appToken =
                        res.data?.token ??
                        res.data?.jwt ??
                        res.data?.accessToken;

                    token.userId = res.data?.userId;
                    const rawShopId = coerceString(
                        res.data?.shopId ?? res.data?.shop_id ?? res.data?.shopID
                    );
                    let resolvedShopId = rawShopId;
                    if (looksLikeJwt(resolvedShopId) || resolvedShopId === appToken) {
                        resolvedShopId = undefined;
                    }
                    if (!resolvedShopId && appToken && looksLikeJwt(appToken)) {
                        const payload = decodeJwtPayload(appToken);
                        const shopIdFromToken = extractShopId(payload);
                        if (shopIdFromToken && !looksLikeJwt(shopIdFromToken)) {
                            resolvedShopId = shopIdFromToken;
                        }
                    }
                    token.shopId = resolvedShopId;
                    token.role = normalizeRole(res.data?.role ?? role);
                    token.customToken = appToken;

                    if (appToken) {
                        cookieStore.set(APP_TOKEN_COOKIE, appToken, {
                            httpOnly: true,
                            sameSite: "lax",
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                            maxAge: 60 * 60 * 24 * 7,
                        });
                    }
                } catch (error) {
                    console.error("OAuth backend exchange failed:", error);
                }
            }

            return token;
        },

        async session({ session, token }) {
            const normalizedRole = normalizeRole(token.role);
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.id = typeof token.userId === "string" ? token.userId : undefined;
                session.user.role = normalizedRole;
            }
            if (normalizedRole === "SHOP") {
                session.shop_id = token.shopId;
            }
            session.customToken = typeof token.customToken === 'string' ? token.customToken : undefined;
            return session;
        }
    },
    debug: process.env.NODE_ENV === "development"
})

export { handler as GET, handler as POST }
