import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import jwt from 'jsonwebtoken';
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { Session } from "next-auth";
import { email } from "zod";

declare module "next-auth" {
    interface Session {
        customToken?: string;
    }
    interface User {
        role?: string;
        userId?: string;
    }
}

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

        // CredentialsProvider({
        //     name: "credentials",
        //     credentials: {
        //         userId: { label: "userId", type: "text" },
        //         email: { label: "email", type: "email" },
        //         name: { label: "name", type: "text" },
        //         image: { label: "image", type: "text" },
        //         role : {label:"role" , type:"text" }
        //     },
        //     async authorize(credentials) {
        //         if (!credentials) return null;
        //         return {
        //             id: credentials.userId,
        //             email: credentials.email,
        //             name: credentials.name,
        //             image: credentials.image,
        //             role: credentials.role
        //         };
        //     }
        // })

    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user?.email) {
                // Call backend ONLY on first login
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER}/user`,
                    {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    }
                );

                token.userId = res.data.userId;
                token.role = res.data.role;

                // // Get backend JWT
                // const jwtRes = await axios.post(
                //     `${process.env.NEXT_PUBLIC_SERVER}/user/auth/token`,
                //     {
                //         userId: res.data.userId,
                //         role: [res.data.role]
                //     }
                // );

                // token.customToken = jwtRes.data;
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