import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'categories', label: 'Categories', icon: 'grid_view', path: '/categories' },
  { id: 'cart', label: 'Cart', icon: 'shopping_cart', path: '/cart' },
  { id: 'contact', label: 'Contact', icon: 'chat_bubble', path: '/contact' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 'var(--z-nav)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 16px 12px',
      background: 'var(--surface-container-lowest)',
      boxShadow: 'var(--shadow-top)',
      borderRadius: '16px 16px 0 0',
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'contact') {
                window.open('https://wa.me/1234567890', '_blank');
              } else {
                navigate(tab.path);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 16px',
              borderRadius: active ? 'var(--radius-full)' : 'var(--radius-lg)',
              background: active ? 'var(--secondary-container)' : 'transparent',
              color: active ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
              transition: 'all 0.2s ease',
              position: 'relative',
              minWidth: 56,
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 24,
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              {tab.id === 'cart' && totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--error)',
                  color: 'var(--on-error)',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-label-sm" style={{ fontSize: 11, marginTop: 2 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
