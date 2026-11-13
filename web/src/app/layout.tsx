// LLM: Define the application metadata, shared styles, and notification container.
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Task Manager",
  description: "A simple task manager built with Next.js and NestJS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster richColors position="top-right" theme="light" />
      </body>
    </html>
  );
}
