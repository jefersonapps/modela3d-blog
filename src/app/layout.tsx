import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemedClerkProvider } from "./contexts/clerk-context";
import CustomQueryClientProvider from "./contexts/react-query-context";
import { Toaster } from "sonner";

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
            <ThemedClerkProvider>
              {children}
              <Toaster
                toastOptions={{
                  classNames: {
                    error:
                      "bg-rose-400 border-rose-800 dark:bg-rose-700 dark:border-rose-950 text-rose-950 dark:text-rose-200",
                    success:
                      "bg-emerald-400 border-emerald-800 dark:bg-emerald-700 dark:border-emerald-950 text-emerald-950 dark:text-emerald-100",
                    warning:
                      "bg-amber-400 border-amber-800 dark:bg-amber-700 dark:border-amber-950 text-amber-950 dark:text-amber-200",
                    info: "bg-blue-400 border-blue-800 dark:bg-blue-700 dark:border-blue-950 text-blue-950 dark:text-blue-200",
                  },
                }}
              />
            </ThemedClerkProvider>
          </CustomQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
