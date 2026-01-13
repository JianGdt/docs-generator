import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/app/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Docs Generator - Free Documentation Tool",
  description: "Generate professional documentation assisted with AI",
  metadataBase: new URL("https://ai-docs-generator.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
