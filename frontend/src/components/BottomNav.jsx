import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../data/sampleData';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'categories', label: 'Categories', icon: 'grid_view', path: '/categories' },
  { id: 'about', label: 'About Us', icon: 'info', path: '/about' },
  { id: 'contact', label: 'Contact', icon: 'chat_bubble', path: '/contact' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Prevent negative values (rubber banding on iOS)
      if (currentScrollY < 0) return;

      // Always show at the very top of the page
      if (currentScrollY < 50) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = Math.abs(currentScrollY - lastScrollY.current);
      if (diff > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(120%)',
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
      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'contact') {
                window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
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
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: active ? 'var(--primary)' : 'var(--on-surface-variant)',
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
