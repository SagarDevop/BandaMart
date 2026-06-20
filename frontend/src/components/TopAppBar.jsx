import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopAppBar({
  title = 'BandaMart',
  showBack = false,
  showSearch = false,
  showLocation = false,
  rightAction = null,
  transparent = false,
  onSearchClick,
}) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-header)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-md) var(--container-padding)',
      width: '100%',
      background: transparent ? 'rgba(248,250,247,0.8)' : 'var(--surface)',
      backdropFilter: transparent ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: transparent ? 'blur(12px)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-container-lowest)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
              arrow_back
            </span>
          </button>
        )}
        <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
          {title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {showSearch && (
          <button
            onClick={onSearchClick || (() => navigate('/search'))}
            style={{
              padding: 'var(--space-xs)',
              transition: 'opacity 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
              search
            </span>
          </button>
        )}
        {showLocation && (
          <button style={{ padding: 'var(--space-xs)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
              location_on
            </span>
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
}
