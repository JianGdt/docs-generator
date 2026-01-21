import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "./providers/SessionProvider";
import BreadcumbLayout from "./components/layout/Breadcrumb";

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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <BreadcumbLayout>
            <Toaster position="top-center" />
            {children}
          </BreadcumbLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
