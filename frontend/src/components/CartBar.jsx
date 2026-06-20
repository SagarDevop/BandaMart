import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBar() {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: 440,
      zIndex: 'var(--z-cart-bar)',
    }}>
      <div style={{
        animation: 'slideUp 0.3s ease forwards',
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
            transition: 'transform 0.2s',
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
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
