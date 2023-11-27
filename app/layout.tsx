import "./styles/globals.css";
import React from "react";
import { NextAuthProvider } from './Providers';
import RecoilContextProvider from "./RecoilContextProviders";
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
      <head>
        {/* <Toggle /> */}
        <script
          dangerouslySetInnerHTML=
          {{
            __html: `
        try {
          if (localStorage.mode === 'dark' || (!('mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } catch (_) {}
      `,
          }}/>
      </head>
      <body suppressHydrationWarning={true}>
        <RecoilContextProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
