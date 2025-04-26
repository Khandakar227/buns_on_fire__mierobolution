import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";

import { Toaster } from 'react-hot-toast';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/components/theme-provider"

import Sidebar from "@/components/sidebar"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bistro 92",
  description: "Admin management dashboard for Bistro 92",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-background">{children}</main>
              </div>
            </div>
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
