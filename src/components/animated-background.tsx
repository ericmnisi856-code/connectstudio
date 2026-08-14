import * as React from "react";

export function AnimatedBackground() {
  return (
    <div className="animated-background fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Grid pattern */}
      <div className="grid-pattern" />
      
      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{ 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }} />
        ))}
      </div>
    </div>
  );
}
