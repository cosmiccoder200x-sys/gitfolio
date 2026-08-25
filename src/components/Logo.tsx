import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
  showBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 36,
  className = '',
  showBackground = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={`shrink-0 transition-transform hover:scale-105 duration-200 ${className}`}
      aria-label="GitFolio Architect Logo"
    >
      <defs>
        <linearGradient id="gfBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="gfTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <filter id="gfGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {showBackground && (
        <rect width="500" height="500" rx="60" fill="#090D16" />
      )}

      {/* Isometric Cube Framework */}
      <g transform="translate(250, 230)">
        {/* Top Face */}
        <polygon
          points="0,-120 110,-55 0,10 -110,-55"
          fill="#1E293B"
          stroke="#38BDF8"
          strokeWidth="6"
        />

        {/* Left Face */}
        <polygon
          points="-110,-55 0,10 0,130 -110,65"
          fill="#0F172A"
          stroke="#38BDF8"
          strokeWidth="6"
        />

        {/* Right Face */}
        <polygon
          points="0,10 110,-55 110,65 0,130"
          fill="#1E293B"
          stroke="#38BDF8"
          strokeWidth="6"
        />

        {/* Git Branch Overlay on Top Face */}
        <circle cx="0" cy="-60" r="10" fill="#14B8A6" />
        <circle cx="-50" cy="-35" r="10" fill="#38BDF8" />
        <circle cx="50" cy="-35" r="10" fill="#38BDF8" />
        <line x1="0" y1="-60" x2="-50" y2="-35" stroke="#14B8A6" strokeWidth="5" />
        <line x1="0" y1="-60" x2="50" y2="-35" stroke="#14B8A6" strokeWidth="5" />

        {/* Code Lines on Front Left Face */}
        <line
          x1="-80"
          y1="0"
          x2="-30"
          y2="25"
          stroke="#475569"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="-80"
          y1="25"
          x2="-45"
          y2="42"
          stroke="#475569"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="-80"
          y1="50"
          x2="-20"
          y2="80"
          stroke="#14B8A6"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Code Lines on Front Right Face */}
        <line
          x1="20"
          y1="25"
          x2="80"
          y2="-5"
          stroke="#475569"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="45"
          y1="42"
          x2="80"
          y2="25"
          stroke="#38BDF8"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
