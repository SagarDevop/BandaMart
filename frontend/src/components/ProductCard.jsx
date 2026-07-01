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
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: '#ff3f6c',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '4px',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          {discountPercent}% OFF
        </div>
      )}

      {/* Express Delivery Badge */}
      {product.featured && !compact && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
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
            padding: compact ? '4px' : '8px',
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
        padding: compact ? '8px 6px 10px' : '10px 12px 12px',
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
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          margin: '0 0 2px 0',
          fontSize: compact ? 11 : 15,
          fontWeight: 700,
          lineHeight: 1.3,
          height: compact ? '30px' : '40px',
          fontFamily: "'Inter', sans-serif",
        }}>
          {product.name}
        </h4>

        {/* Pack Size / Unit */}
        <span style={{
          fontSize: '9.5px',
          color: '#888888',
          fontWeight: 500,
          display: 'block',
          marginBottom: compact ? '4px' : '6px',
        }}>
          {product.unit}
        </span>

        {/* Rating Row (Premium touch) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2px', 
          marginBottom: compact ? '6px' : '10px' 
        }}>
          <span style={{ fontSize: '10px', color: '#ffb300' }}>★</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#4a5568' }}>
            {product.rating || (product.price % 5 === 0 ? '4.5' : product.price % 3 === 0 ? '4.3' : '4.4')}
          </span>
        </div>

        {/* Price & Add Button Action */}
        {compact ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: 'auto',
          }}>
            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap', lineHeight: 1.1 }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--on-background)' }}>
                ₹{product.price}
              </span>
              {originalPrice > product.price && (
                <span style={{ fontSize: '9.5px', color: 'var(--outline)', textDecoration: 'line-through' }}>
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {/* Action Row */}
            <div style={{ width: '100%' }}>
              {qty > 0 ? (
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--primary)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '2px',
                    height: '28px',
                  }} 
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={handleDecrement}
                    style={{
                      width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 'bold', fontSize: 14
                    }}
                  >
                    -
                  </button>
                  <span style={{ color: '#ffffff', fontWeight: 800, fontSize: 12 }}>{qty}</span>
                  <button
                    onClick={handleIncrement}
                    style={{
                      width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 'bold', fontSize: 14
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={!product.available}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--primary)',
                    color: 'var(--primary)',
                    width: '100%',
                    height: '28px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 750,
                    fontSize: 12,
                    boxShadow: '0 2px 4px rgba(132, 194, 37, 0.05)',
                    opacity: product.available ? 1 : 0.5,
                  }}
                >
                  ADD
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Price & Discount */}
            <div style={{
              margin: '0 0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontWeight: 800, color: '#2d8a4e', fontSize: 16 }}>
                ₹{product.price}
              </span>
              {originalPrice > product.price && (
                <span style={{ textDecoration: 'line-through', fontSize: 12, color: 'var(--outline)', opacity: 0.8 }}>
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {/* Large Stepper/Button */}
            <div style={{ marginTop: 'auto' }}>
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  disabled={!product.available}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff',
                    border: '1.5px solid var(--primary)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
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
                  height: 37,
                }}>
                  <button
                    onClick={handleDecrement}
                    style={{
                      width: 30,
                      height: 30,
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
                    fontSize: 14,
                    minWidth: 20,
                    textAlign: 'center',
                    color: 'var(--primary)',
                  }}>
                    {qty}
                  </span>
                  <button
                    onClick={handleIncrement}
                    style={{
                      width: 30,
                      height: 30,
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
        )}
      </div>
    </div>
  );
}
