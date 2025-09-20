"use client";

import { useEffect, useState } from "react";

/** Returns "mobile" | "tablet" | "desktop" based on window width. */
export function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");        // < sm
      else if (w < 1024) setBp("tablet");  // < lg
      else setBp("desktop");
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}
