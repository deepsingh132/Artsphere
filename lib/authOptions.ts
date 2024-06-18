import { NextAuthOptions } from "next-auth";
import { db } from "@/db";
import { users as User } from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import SignToken  from "@/app/api/auth/jwt";
import { eq } from "drizzle-orm";


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        try {
          const [userExists] = await db.select().from(User).where(eq(User.email, user.email as string));
          if (!userExists) {
            // Create the user and add it to the token
            const [newUser] = await db.insert(User).values({
              _id: crypto.randomUUID(),
              name: user.name || "",
              username: user.email?.split("@")[0] || user.name || "",
              email: user.email as string,
              image: user.image || ""
            }).returning({
              _id: User._id,
              email: User.email,
            });

            token._id = newUser._id;
            const data = {
              email: newUser.email,
              _id: newUser._id,
            };
            const tokenString = await SignToken(data) as string;
            token.accessToken = tokenString;
          } else {
            const data = {
              email: userExists.email,
              _id: userExists._id,
            };
            const tokenString = await SignToken(data) as string;
            token.accessToken = tokenString;
            token._id = userExists._id;
          }
        } catch (error) {
          console.error(error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token._id as string;
      session.user.accessToken = token.accessToken as string;
      session.user.expires = token.exp as number;

      return session;
    },
  },
};