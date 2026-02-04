import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { cookies } from "next/headers";

declare module "next-auth" {
    interface Session {
        customToken?: string;
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
    }
}

const APP_TOKEN_COOKIE = "app_token";
const ROLE_COOKIE = "auth_role";

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
                    token.role = res.data?.role;
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
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            session.customToken = typeof token.customToken === 'string' ? token.customToken : undefined;
            return session;
        }
    },
    debug: true
})

export { handler as GET, handler as POST }
