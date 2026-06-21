import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { optimizeImageUrl } from '../utils/image';

export default function ProductCard({ product, compact = false }) {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, increment, decrement } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const qty = getItemQuantity(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    increment(product.id);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    decrement(product.id);
  };

  const discountPercent = (product.price % 3 === 0) ? 15 : (product.price % 2 === 0) ? 10 : 20;
  const originalPrice = Math.round(product.price / (1 - (discountPercent / 100)));

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--outline-variant)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--outline-variant)';
      }}
    >
      {/* Express Delivery Badge */}
      {product.featured && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: '#ffc107',
          color: '#000000',
          fontSize: '9px',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '4px',
          zIndex: 2,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}>
          <span>⚡</span> Express
        </div>
      )}

      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1.2',
        overflow: 'hidden',
        background: 'var(--surface-container-low)',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        <img
          src={optimizeImageUrl(product.image, 300) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {!product.available && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            zIndex: 3,
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        {/* Pack Size / Unit */}
        <span style={{
          fontSize: '11px',
          color: 'var(--outline)',
          fontWeight: 600,
          display: 'block',
          marginBottom: '4px',
          letterSpacing: '0.02em',
        }}>
          {product.unit}
        </span>

        {/* Title */}
        <h4 style={{
          color: 'var(--on-surface)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          margin: 0,
          fontSize: compact ? 13 : 15,
          fontWeight: 700,
          lineHeight: 1.2,
          fontFamily: "'Inter', sans-serif",
        }}>
          {product.name}
        </h4>

        {/* Price & Discount */}
        <div style={{
          margin: '10px 0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 800, color: 'var(--on-surface)', fontSize: compact ? 14 : 16 }}>
            ₹{product.price}
          </span>
          <span style={{ textDecoration: 'line-through', fontSize: compact ? 10 : 12, color: 'var(--outline)', opacity: 0.8 }}>
            ₹{originalPrice}
          </span>
          <span style={{
            fontSize: '9px',
            background: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            padding: '2px 5px',
            borderRadius: '3px',
            fontWeight: 800,
            marginLeft: 'auto',
          }}>
            {discountPercent}% OFF
          </span>
        </div>

        {/* Add / Stepper */}
        <div style={{ marginTop: 'auto' }}>
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={!product.available}
              style={{
                width: '100%',
                padding: compact ? '6px 12px' : '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1.5px solid var(--primary)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontWeight: 800,
                fontSize: 13,
                opacity: product.available ? 1 : 0.5,
                boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                transition: 'all 0.15s ease',
              }}
              onPointerDown={e => e.currentTarget.style.background = 'var(--primary-container)'}
              onPointerUp={e => e.currentTarget.style.background = '#ffffff'}
            >
              ADD
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontWeight: 'bold' }}>
                add
              </span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              height: compact ? 31 : 37,
            }}>
              <button
                onClick={handleDecrement}
                style={{
                  width: compact ? 24 : 30,
                  height: compact ? 24 : 30,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontWeight: 'bold' }}>remove</span>
              </button>
              <span style={{
                fontWeight: 800,
                fontSize: 14,
                minWidth: 24,
                textAlign: 'center',
                color: 'var(--primary)',
              }}>
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                style={{
                  width: compact ? 24 : 30,
                  height: compact ? 24 : 30,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontWeight: 'bold' }}>add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
