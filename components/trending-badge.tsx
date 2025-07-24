import React from 'react';

interface TrendingBadgeProps {
  number: number;
  className?: string;
}

export function TrendingBadge({ number, className = '' }: TrendingBadgeProps) {
  return (
    <div className={`absolute top-1 left-1 sm:top-2 sm:left-2 z-20 pointer-events-none select-none ${className}`}>
      <span 
        className="text-white font-black leading-none"
        style={{
          fontSize: number > 9 ? '2.2rem' : '2.8rem',
          WebkitTextStroke: '2px #000000',
          textShadow: `
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 0 8px rgba(0,0,0,0.8)
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: '#ffffff'
        }}
      >
        {number}
      </span>
    </div>
  );
}
