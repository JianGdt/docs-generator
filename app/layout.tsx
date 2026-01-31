import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "./providers/SessionProvider";
import BreadcumbLayout from "./components/layout/Breadcrumb";
import { ThemeProvider } from "./providers/ThemeProvider";

const inter = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Docs Generator - Free Documentation Tool",
  description: "Generate professional documentation assisted with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable}  antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <BreadcumbLayout>
              <Toaster position="top-center" />
              {children}
            </BreadcumbLayout>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
