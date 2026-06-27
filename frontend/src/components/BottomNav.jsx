import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'categories', label: 'Categories', icon: 'grid_view', path: '/categories' },
  { id: 'offers', label: 'Offers', icon: 'local_offer', path: '/offers' },
  { id: 'about', label: 'About Us', icon: 'info', path: '/about' },
  { id: 'contact', label: 'Contact', icon: 'chat_bubble', path: '/contact' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { whatsappNumber } = useProducts();

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
      padding: '6px 6px 10px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      borderRadius: '20px 20px 0 0',
      borderTop: '1px solid rgba(0,0,0,0.04)',
      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'contact') {
                window.open(`https://wa.me/${whatsappNumber}`, '_blank');
              } else {
                navigate(tab.path);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 2px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: active ? 'var(--primary)' : '#6b7280',
              position: 'relative',
              flex: 1,
              minWidth: 0,
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
            </div>
            <span style={{ 
              fontSize: 10, 
              marginTop: 3,
              fontWeight: active ? 700 : 500,
              letterSpacing: '-0.01em'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
