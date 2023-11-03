import "./styles/globals.css";
import React from "react";
import { NextAuthProvider } from './Providers';
import RecoidContextProvider from "./RecoilContextProviders";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: 'Artsphere',
  description: 'Artsphere is a platform for artists to share their work and connect with other artists.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body suppressHydrationWarning={true}>
        <RecoidContextProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </RecoidContextProvider>
      </body>
    </html>
  );
}
