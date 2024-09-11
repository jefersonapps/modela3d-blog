import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemedClerkProvider } from "./contexts/clerk-context";
import CustomQueryClientProvider from "./contexts/react-query-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Modela3D | Blog",
  description: "Blog sobre o software Modela3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-justify text-foreground bg-card`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomQueryClientProvider>
            <ThemedClerkProvider>{children}</ThemedClerkProvider>
          </CustomQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
