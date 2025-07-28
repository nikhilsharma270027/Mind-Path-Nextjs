import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { NextAuthProvider } from "@/providers/NextAuthProvider";
// import { PostHogProvider } from '@/components/posthog-provider';
import dynamic from "next/dynamic";
import Header from "@/components/Header";

// const PostHogPageView = dynamic(() => import('@/components/PostHogPageView'), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} ${lexend.variable} font-sans antialiased min-h-screen bg--background`}
      >
        {/* <PostHogPageView /> */}
        <NextAuthProvider>
          <Header />
          {children}
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
