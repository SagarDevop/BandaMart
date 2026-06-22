import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo({ type = 'mark', size = 40, style = {} }) {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = (e) => {
    e.stopPropagation();
    setClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        navigate('/admin');
        return 0;
      }
      return nextCount;
    });

    if (window.logoClickTimeout) clearTimeout(window.logoClickTimeout);
    window.logoClickTimeout = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  if (type === 'mark') {
    return (
      <svg
        onClick={handleLogoClick}
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0, ...style }}
      >
        {/* Handle */}
        <path
          d="M44,40 C44,15 76,15 76,40"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bag Body (Letter B) */}
        <path
          d="M36,36 H74 C86,36 94,44 94,54 C94,62 88,66 82,66 C89,66 96,72 96,82 C96,92 86,96 74,96 H36 Z"
          fill="var(--secondary)"
        />

        {/* White Cutout */}
        <path
          d="M49,48 H68 C74,48 76,51 76,56 V60 C76,65 74,68 68,68 H49 Z"
          fill="#ffffff"
        />

        {/* Letter M inside Cutout */}
        <path
          d="M54,64 V54 L62,60 L70,54 V64"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Rivets */}
        <circle cx="44" cy="40" r="4.5" fill="#ffffff" stroke="var(--primary)" strokeWidth="1.5" />
        <circle cx="76" cy="40" r="4.5" fill="#ffffff" stroke="var(--primary)" strokeWidth="1.5" />
      </svg>
    );
  }

  // Full Logo with Name and Tagline
  return (
    <div 
      onClick={handleLogoClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style }}
    >
      <Logo type="mark" size={size} />
      <h2 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '28px',
        fontWeight: 800,
        margin: '12px 0 2px',
        letterSpacing: '-0.02em',
      }}>
        <span style={{ color: 'var(--primary)' }}>Banda</span>
        <span style={{ color: 'var(--on-background)' }}>Mart</span>
      </h2>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--outline)',
        margin: 0,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: 0.9,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ height: '1px', width: '16px', background: 'var(--outline)', opacity: 0.5 }}></span>
        Sab kuch, sabke paas
        <span style={{ height: '1px', width: '16px', background: 'var(--outline)', opacity: 0.5 }}></span>
      </p>
    </div>
  );
}
