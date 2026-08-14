import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog";

/**
 * Renders a stylised, hardware-accurate illustration of each router family.
 * Pure CSS/SVG so it stays crisp at every size and needs no image assets.
 * If product has a custom image, displays that instead.
 */
export function ProductVisual({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  // If product has a custom image, show that instead of SVG
  if (product.image) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-surface",
          className,
        )}
        role="img"
        aria-label={`${product.name} product image`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface",
        className,
      )}
      role="img"
      aria-label={`${product.name} product illustration`}
    >
      <div className="absolute inset-0 grid-noise opacity-60" aria-hidden="true" />
      <div
        className="absolute -right-10 -top-10 size-40 rounded-full bg-emerald-gradient opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative w-[76%] transition-transform duration-500 group-hover:scale-105">
        {product.category === "wireless" ? (
          <WirelessRouter />
        ) : product.category === "nbr" ? (
          <RackRouter ports={8} accent />
        ) : (
          <RackRouter ports={product.specs[0]?.value.includes("8") ? 8 : 5} />
        )}
      </div>
    </div>
  );
}

function RackRouter({ ports, accent = false }: { ports: number; accent?: boolean }) {
  return (
    <svg viewBox="0 0 320 120" className="w-full drop-shadow-xl">
      <defs>
        <linearGradient id={`body-${ports}-${accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.32 0.02 160)" />
          <stop offset="55%" stopColor="oklch(0.22 0.02 162)" />
          <stop offset="100%" stopColor="oklch(0.16 0.02 163)" />
        </linearGradient>
        <linearGradient id={`led-${ports}-${accent}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.75 0.18 152)" />
          <stop offset="100%" stopColor="oklch(0.55 0.15 156)" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="304" height="66" rx="8" fill={`url(#body-${ports}-${accent})`} />
      <rect x="8" y="26" width="304" height="10" rx="6" fill="oklch(0.4 0.03 160)" opacity="0.5" />
      <rect x="20" y="44" width="60" height="4" rx="2" fill={`url(#led-${ports}-${accent})`} />
      <text x="20" y="70" fill="oklch(0.85 0.02 160)" fontSize="11" fontFamily="monospace">
        {accent ? "NBR" : "REYEE"}
      </text>
      {Array.from({ length: ports }).map((_, i) => (
        <g key={i}>
          <rect
            x={104 + i * 24}
            y={54}
            width="18"
            height="16"
            rx="2"
            fill="oklch(0.12 0.01 160)"
            stroke="oklch(0.45 0.03 160)"
          />
          <circle cx={113 + i * 24} cy={48} r="2" fill="oklch(0.75 0.18 152)" />
        </g>
      ))}
      <rect x="8" y="92" width="304" height="6" rx="3" fill="oklch(0.12 0.01 160)" opacity="0.6" />
    </svg>
  );
}

function WirelessRouter() {
  return (
    <svg viewBox="0 0 320 160" className="w-full drop-shadow-xl">
      <defs>
        <linearGradient id="wbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.98 0.005 160)" />
          <stop offset="60%" stopColor="oklch(0.9 0.01 160)" />
          <stop offset="100%" stopColor="oklch(0.78 0.015 160)" />
        </linearGradient>
      </defs>
      {[40, 96, 224, 280].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 5}
            y={i % 2 === 0 ? 14 : 22}
            width="10"
            height="70"
            rx="5"
            fill="oklch(0.28 0.02 162)"
            transform={`rotate(${x < 160 ? -14 : 14} ${x} 60)`}
          />
        </g>
      ))}
      <rect x="52" y="86" width="216" height="46" rx="12" fill="url(#wbody)" />
      <rect x="52" y="86" width="216" height="14" rx="10" fill="oklch(1 0 0)" opacity="0.7" />
      <rect x="72" y="112" width="70" height="5" rx="2.5" fill="oklch(0.55 0.15 156)" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={172 + i * 18} cy={114} r="3.5" fill="oklch(0.75 0.18 152)" />
      ))}
      <ellipse cx="160" cy="140" rx="110" ry="8" fill="oklch(0.2 0.02 160)" opacity="0.12" />
    </svg>
  );
}
