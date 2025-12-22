import { useState, useEffect } from "react";

export const useSidebarResize = (
  initialWidth = 260,
  minWidth = 200,
  maxWidth = 420
) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const next = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setSidebarWidth(next);
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, minWidth, maxWidth]);

  const startDrag = () => setIsDragging(true);

  return {
    sidebarWidth,
    isDragging,
    startDrag,
  };
};
