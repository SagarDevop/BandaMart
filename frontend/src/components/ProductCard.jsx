import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--outline-variant)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
        overflow: 'hidden',
        background: 'var(--surface-container-low)',
      }}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
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
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        <h4 className="text-title-md" style={{
          color: 'var(--on-surface)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          margin: 0,
          fontSize: compact ? 14 : 16,
        }}>
          {product.name}
        </h4>
        <p className="text-label-sm" style={{
          color: 'var(--outline)',
          margin: '2px 0 var(--space-md)',
        }}>
          ₹{product.price}/{product.unit}
        </p>

        {/* Add / Stepper */}
        <div style={{ marginTop: 'auto' }}>
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={!product.available}
              style={{
                width: '100%',
                padding: compact ? '6px' : '8px',
                borderRadius: 'var(--radius-xl)',
                background: justAdded ? 'var(--secondary)' : 'var(--primary)',
                color: 'var(--on-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-xs)',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.05em',
                opacity: product.available ? 1 : 0.5,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {justAdded ? 'check' : 'add'}
              </span>
              {justAdded ? 'Added' : 'Add'}
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-container-high)',
              borderRadius: 'var(--radius-xl)',
              padding: '4px',
            }}>
              <button
                onClick={handleDecrement}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-container-highest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--on-surface-variant)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
              </button>
              <span style={{
                fontWeight: 600,
                fontSize: 14,
                minWidth: 24,
                textAlign: 'center',
                color: 'var(--on-surface)',
              }}>
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--on-primary)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
