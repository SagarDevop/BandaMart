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

  const hasOriginal = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasOriginal
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : ((product.price % 3 === 0) ? 15 : (product.price % 2 === 0) ? 10 : 20);
  const originalPrice = hasOriginal
    ? product.originalPrice
    : Math.round(product.price / (1 - (discountPercent / 100)));

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
      {product.featured && !compact && (
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
        background: '#ffffff',
        borderBottom: '1.5px solid var(--outline-variant)',
      }}>
        <img
          src={optimizeImageUrl(product.image, 300) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8px',
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
        padding: '10px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        background: '#ffffff',
      }}>
        {/* Title */}
        <h4 style={{
          color: 'var(--on-surface)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          margin: '0 0 2px 0',
          fontSize: compact ? 12.5 : 15,
          fontWeight: 700,
          lineHeight: 1.25,
          fontFamily: "'Inter', sans-serif",
        }}>
          {product.name}
        </h4>

        {/* Pack Size / Unit */}
        <span style={{
          fontSize: '10px',
          color: 'var(--outline)',
          fontWeight: 500,
          display: 'block',
          marginBottom: '6px',
          color: '#888888',
        }}>
          {product.unit}
        </span>

        {/* Price & Discount */}
        <div style={{
          margin: '0 0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontWeight: 800, color: 'var(--on-surface)', fontSize: compact ? 13.5 : 16 }}>
            ₹{product.price}
          </span>
          {!compact && (
            <>
              <span style={{ textDecoration: 'line-through', fontSize: 12, color: 'var(--outline)', opacity: 0.8 }}>
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
            </>
          )}
        </div>

        {/* Add / Stepper */}
        <div style={{ marginTop: 'auto' }}>
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={!product.available}
              style={{
                width: '100%',
                padding: compact ? '6px 10px' : '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1.5px solid var(--primary)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: compact ? 11.5 : 13,
                opacity: product.available ? 1 : 0.5,
                transition: 'all 0.15s ease',
              }}
              onPointerDown={e => e.currentTarget.style.background = 'var(--primary-container)'}
              onPointerUp={e => e.currentTarget.style.background = '#ffffff'}
            >
              Add to Cart
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
              height: compact ? 30 : 37,
            }}>
              <button
                onClick={handleDecrement}
                style={{
                  width: compact ? 22 : 30,
                  height: compact ? 22 : 30,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontWeight: 'bold' }}>remove</span>
              </button>
              <span style={{
                fontWeight: 800,
                fontSize: compact ? 12 : 14,
                minWidth: 20,
                textAlign: 'center',
                color: 'var(--primary)',
              }}>
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                style={{
                  width: compact ? 22 : 30,
                  height: compact ? 22 : 30,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontWeight: 'bold' }}>add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
