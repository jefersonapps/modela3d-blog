"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { ptBR } from "@clerk/localizations";

export function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const actualTheme = localStorage.getItem("theme");
    setTheme(actualTheme || "dark");
  }, [setTheme]);

  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      localization={ptBR}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
