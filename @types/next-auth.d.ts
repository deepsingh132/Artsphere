import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      image: string;
      email: string;
      id: string;
      accessToken: string;
      expires: number;
    };
  }
}
