export function YocoLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Y */}
        <path
          d="M20 10L25 20L30 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="25"
          y1="20"
          x2="25"
          y2="30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* O */}
        <circle
          cx="45"
          cy="20"
          r="8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        
        {/* C */}
        <path
          d="M70 12C67 12 64 14 64 20C64 26 67 28 70 28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* O */}
        <circle
          cx="85"
          cy="20"
          r="8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      </g>
      
      {/* Powered by text */}
      <text
        x="20"
        y="38"
        fontSize="6"
        fill="currentColor"
        opacity="0.6"
      >
        Secure Payments
      </text>
    </svg>
  );
}
