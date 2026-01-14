import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/app/providers/SessionProvider";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";

const inter = Geist_Mono({
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
        <SessionProvider>
          <Toaster position="top-center" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
