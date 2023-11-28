import "./styles/globals.css";
import React from "react";
import { NextAuthProvider } from "./Providers";
import RecoilContextProvider from "./RecoilContextProviders";
import { Metadata } from "next";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "Artsphere",
  description:
    "Artsphere is a platform for artists to share their work and connect with other artists.",
};

// console.log("Current environment: ", process.env.NODE_ENV);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider attribute="class">
          <RecoilContextProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </RecoilContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
