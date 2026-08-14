import { useLocation } from "@tanstack/react-router";
import * as React from "react";

/**
 * Wraps route content and plays a slide-out / slide-in transition
 * whenever the pathname changes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useLocation({ select: (l) => l.pathname });
  const [current, setCurrent] = React.useState(pathname);
  const [phase, setPhase] = React.useState<"in" | "out">("in");

  React.useEffect(() => {
    if (pathname === current) return;
    setPhase("out");
    const timer = window.setTimeout(() => {
      setCurrent(pathname);
      setPhase("in");
    }, 200);
    return () => window.clearTimeout(timer);
  }, [pathname, current]);

  return (
    <div key={current} className={phase === "out" ? "page-exit" : "page-enter"}>
      {children}
    </div>
  );
}
