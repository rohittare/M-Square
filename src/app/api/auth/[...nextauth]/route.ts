import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import jwt from 'jsonwebtoken';
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { Session } from "next-auth";

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

    // callbacks: {
    //     async jwt({ token, user, account }) {
    //         if (user) {
    //             token.name = user.name || token.name;
    //             token.email = user.email || token.email;
    //             token.picture = user.image || token.picture;
    //             token.sub = user.id || token.sub;
    //         }
            
    //         if (account && user) {

    //             const obj = {
    //                 userId : user.id,
    //                 role: [user.role]
    //             }
    //             if (!user.id || !user.role) {
    //                 console.log("User ID or role is missing in the credentials");
    //                 return token; // Return the token without customToken if user ID is missing
    //             }
    //             try {
    //                 const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/user/auth/token` , obj);
    //                 token.customToken = response.data;
    //             } catch (error) {
    //                 // throw new Error("Failed to generate custom token");
    //                 console.log("Failed to generate custom token", error);
                    
    //                 token.customToken = null
    //             }
    //         }
    //         return token;
    //     },

    //     async session({ session, token }) {
    //         if (session.user) {
    //             session.user.name = token.name;
    //             session.user.email = token.email;
    //             session.user.image = token.picture;
    //         }
    //         session.customToken = typeof token.customToken === 'string' ? token.customToken : undefined;
    //         return session;
    //     }
    // },
    debug: true
})

export { handler as GET, handler as POST }