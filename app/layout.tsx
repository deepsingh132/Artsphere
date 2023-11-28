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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning>
        <RecoilContextProvider>
          <NextAuthProvider>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
          </NextAuthProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
