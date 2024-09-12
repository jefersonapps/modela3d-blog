import { useEffect, useState } from "react";

export const useScreenDetector = () => {
  const [deviceWidth, setDeviceWidth] = useState<number>(1920);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleWindowSizeChange = () => {
        setDeviceWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleWindowSizeChange);
      handleWindowSizeChange();

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }
  }, []);

  const isMobile = deviceWidth <= 768;
  const isTablet = deviceWidth <= 1024;
  const isDesktop = deviceWidth > 1024;

  return { isMobile, isTablet, isDesktop, deviceWidth };
};
