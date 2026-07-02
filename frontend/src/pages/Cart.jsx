import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/BottomNav';
import TopAppBar from '../components/TopAppBar';
import Logo from '../components/Logo';
import { optimizeImageUrl } from '../utils/image';
import { APP_CONFIG } from '../data/sampleData';

export default function Cart() {
  const navigate = useNavigate();
  const { items, increment, decrement, removeItem, totalPrice, totalItems, clearCart, donation, setDonation } = useCart();

  if (items.length === 0) {
    return (
      <div className="app-container" style={{ paddingBottom: 80 }}>
        <TopAppBar title="Cart" showBack />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: 'var(--space-2xl)',
          minHeight: '60vh', textAlign: 'center',
        }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 80, color: 'var(--outline-variant)', marginBottom: 'var(--space-lg)',
          }}>
            shopping_cart
          </span>
          <h2 className="text-headline-lg" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-sm)' }}>
            Your cart is empty
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', margin: '0 0 var(--space-lg)' }}>
            Add some fresh items to get started!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: 'var(--space-md) var(--space-xl)',
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Start Shopping
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ paddingBottom: 160 }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Logo size={32} />
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
            BandaMart
          </h1>
        </div>
      </header>

      <main style={{ padding: '0 var(--container-padding)' }}>
        {/* Title */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 'var(--space-lg)', marginTop: 'var(--space-lg)',
        }}>
          <h2 className="text-headline-xl" style={{ color: 'var(--on-surface)', margin: 0 }}>Cart</h2>
          <span className="text-label-sm" style={{
            color: 'var(--outline)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            paddingBottom: 4,
          }}>
            {totalItems} ITEMS
          </span>
        </div>

        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                background: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(194,201,187,0.3)',
                animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`,
                opacity: 0,
                position: 'relative',
              }}
            >
              {/* Delete button */}
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--error-container)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--on-error-container)' }}>
                  close
                </span>
              </button>

              {/* Image */}
              <div style={{
                width: 80, height: 80,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--surface-container)',
                flexShrink: 0,
              }}>
                <img
                  src={optimizeImageUrl(item.image, 150) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: 0 }}>
                    {item.name}
                  </h3>
                  <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', margin: '2px 0 0' }}>
                    {item.quantity} {item.unit} {item.selectedSize && ` · Size: ${item.selectedSize}`}
                  </p>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 'var(--space-sm)',
                }}>
                  <span className="text-title-md" style={{ color: 'var(--primary)' }}>
                    ₹{item.price * item.quantity}
                  </span>
                  {/* Stepper */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-xs)',
                    gap: 'var(--space-sm)',
                  }}>
                    <button
                      onClick={() => decrement(item.id)}
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--surface-container-highest)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--on-surface-variant)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                    </button>
                    <span className="text-label-sm" style={{ padding: '0 4px', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--on-primary)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation Selector Card */}
        <div style={{
          marginTop: 'var(--space-lg)',
          background: 'linear-gradient(135deg, #fffcf6 0%, #fff9ee 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-md) var(--space-lg)',
          border: '1px solid #ffe0b2',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="material-symbols-outlined filled" style={{ color: '#ff9800', fontSize: 20 }}>volunteer_activism</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#e65100' }}>
              Donate for Poor People in Banda ❤️
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--outline)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
            Help feed the underprivileged families in Banda. 100% of your donation goes to charity partners.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[5, 10, 20].map((amt) => {
              const isSelected = donation === amt;
              return (
                <button
                  key={amt}
                  onClick={() => setDonation(isSelected ? 0 : amt)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'var(--primary)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--primary)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--primary-container)',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(132, 194, 37, 0.2)' : 'none',
                  }}
                >
                  +₹{amt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          marginTop: 'var(--space-lg)',
          background: 'var(--surface-container-low)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          border: '1px solid white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <span className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>Subtotal</span>
            <span className="text-body-lg" style={{ color: 'var(--on-surface)' }}>₹{totalPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <span className="text-body-lg" style={{ color: 'var(--on-surface-variant)' }}>Handling Cost</span>
            <span className="text-body-lg" style={{ color: 'var(--on-surface)' }}>₹{APP_CONFIG.handlingFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div>
              <span className="text-body-lg" style={{ color: 'var(--on-surface-variant)', display: 'block' }}>Delivery</span>
              <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, display: 'block', marginTop: 2 }}>
                Flat ₹25 (Sirf ₹25 kitne ke bhi order pe! 🔥)
              </span>
            </div>
            <span className="text-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>₹{APP_CONFIG.deliveryFee}</span>
          </div>
          {donation > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <span className="text-body-lg" style={{ color: 'var(--primary)', fontWeight: 600 }}>Donation (Banda Poor) ❤️</span>
              <span className="text-body-lg" style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{donation}</span>
            </div>
          )}
          <div style={{
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--outline-variant)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span className="text-headline-lg-mobile" style={{ color: 'var(--on-surface)' }}>Total</span>
            <span className="text-headline-lg-mobile" style={{ color: 'var(--primary)' }}>₹{totalPrice + APP_CONFIG.deliveryFee + APP_CONFIG.handlingFee + donation}</span>
          </div>
        </div>
      </main>

      {/* CTA */}
      <div style={{
        position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        padding: 'var(--space-md) var(--container-padding)',
        zIndex: 'var(--z-cart-bar)',
      }}>
        {totalPrice < 150 && (
          <div style={{
            background: '#fff5f5',
            color: '#d32f2f',
            padding: '10px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 13,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.08)',
            border: '1px solid rgba(211, 47, 47, 0.15)',
          }}>
            ⚠️ Minimum order value is ₹150. Add ₹{150 - totalPrice} more to checkout!
          </div>
        )}
        <button
          onClick={() => {
            if (totalPrice >= 150) {
              navigate('/checkout');
            }
          }}
          disabled={totalPrice < 150}
          style={{
            width: '100%',
            background: totalPrice < 150 ? '#cccccc' : 'var(--primary)',
            color: totalPrice < 150 ? '#666666' : 'var(--on-primary)',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-sm)',
            boxShadow: totalPrice < 150 ? 'none' : 'var(--shadow-xl)',
            transition: 'all 0.2s ease',
            cursor: totalPrice < 150 ? 'not-allowed' : 'pointer',
            opacity: totalPrice < 150 ? 0.85 : 1,
          }}
          onPointerDown={e => {
            if (totalPrice >= 150) e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onPointerUp={e => {
            if (totalPrice >= 150) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: 20 }}>💬</span>
          <span className="text-title-md" style={{ fontSize: 16 }}>
            {totalPrice < 150 ? 'Min Order ₹150 Required' : 'Order on WhatsApp'}
          </span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
