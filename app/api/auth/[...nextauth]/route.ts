import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import SignToken  from "@/app/api/auth/jwt";
import { NextAuthOptions } from "next-auth";

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
          await connectMongoDB();
          const userExists = await User.findOne({ email: user.email });

          if (!userExists) {
            // Create the user document and add it to the token
            const newUser = await User.create({
              name: user.name,
              username: user.email?.split("@")[0] || user.name,
              email: user.email,
            });
            token._id = newUser._id; // Include the MongoDB ObjectId in the token
            const data = {
              email: newUser.email,
              _id: newUser._id,
            };
            const tokenString = await SignToken(data);
            token.accessToken = tokenString;
          } else {
            const data = {
              email: userExists.email,
              _id: userExists._id,
            };
            const tokenString = await SignToken(data);
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
