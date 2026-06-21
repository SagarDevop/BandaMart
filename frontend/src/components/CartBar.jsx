import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBar() {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();

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

  if (totalItems === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: visible ? 72 : 16,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: 440,
      zIndex: 'var(--z-cart-bar)',
      transition: 'bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        width: '100%',
      }}>
        <button
          onClick={() => navigate('/cart')}
          style={{
            width: '100%',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md) var(--space-lg)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span className="material-symbols-outlined filled">shopping_cart</span>
            <span className="text-title-md" style={{ fontSize: 16 }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <span className="text-headline-lg-mobile" style={{ fontSize: 18 }}>
            ₹{totalPrice}
          </span>
        </button>
      </div>
    </div>
  );
}
