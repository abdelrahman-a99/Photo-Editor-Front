import { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Editor",
  description: "Photo Editor Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white dark:bg-gray-950">
        <Providers>
          <TooltipProvider>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
