import React from 'react';

interface TrendingBadgeProps {
  number: number;
  className?: string;
}

export function TrendingBadge({ number, className = '' }: TrendingBadgeProps) {
  return (
    <div className={`absolute -left-4 bottom-16 z-20 pointer-events-none select-none ${className}`}>
      <span 
        className="text-white font-black leading-none"
        style={{
          fontSize: number > 9 ? '6rem' : '7rem',
          WebkitTextStroke: '3px #000',
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          letterSpacing: '-0.05em'
        }}
      >
        {number}
      </span>
    </div>
  );
}
