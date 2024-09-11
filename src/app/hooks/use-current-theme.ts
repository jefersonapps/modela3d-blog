import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeType = "light" | "dark";

export const useCurrentTheme = (): ThemeType => {
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");

  useEffect(() => {
    let newTheme: ThemeType;

    if (theme === "dark") {
      newTheme = "dark";
    } else if (theme === "system") {
      newTheme = systemTheme === "dark" ? "dark" : "light";
    } else {
      newTheme = "light";
    }

    setCurrentTheme(newTheme);
  }, [theme, systemTheme]);

  return currentTheme;
};
