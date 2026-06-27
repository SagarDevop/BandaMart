import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

const SAMPLE_COUPONS = [
  {
    code: 'WELCOME50',
    title: 'First Order ₹50 OFF',
    description: 'Get flat ₹50 off on your first order. Valid on all items.',
    minOrder: 'No minimum value',
    color: '#e8f5e9',
    textColor: '#2e7d32',
    icon: 'local_offer'
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Get free delivery on orders above ₹299. Ordinary delivery fee is ₹20.',
    minOrder: 'Min order: ₹299',
    color: '#fce4ec',
    textColor: '#c2185b',
    icon: 'local_shipping'
  },
  {
    code: 'B2G1',
    title: 'Buy 2 Get 1 Free',
    description: 'Buy 2 get 1 free on selected Snacks & Munchies items. Valid till Sunday.',
    minOrder: 'Min items: 3 in category',
    color: '#fff3e0',
    textColor: '#e65100',
    icon: 'celebration'
  },
  {
    code: 'KIRANA10',
    title: '10% OFF on Staples',
    description: 'Get flat 10% discount on Grocery & Kirana items above ₹999.',
    minOrder: 'Min order: ₹999',
    color: '#e3f2fd',
    textColor: '#0d47a1',
    icon: 'shopping_basket'
  }
];

export default function Offers() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="app-container" style={{ paddingBottom: 100 }}>
      <TopAppBar title="Best Offers" showBack={true} />

      <main style={{ padding: '0 var(--container-padding) var(--space-xl)' }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #84c225 0%, #689f38 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg) var(--space-md)',
          textAlign: 'center',
          marginTop: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Super Saver Offers! ⚡</h2>
          <p style={{ fontSize: 13, opacity: 0.9, marginTop: 4, fontWeight: 500 }}>
            Use these coupon codes on checkout to save big on your groceries.
          </p>
        </div>

        {/* Coupons List */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {SAMPLE_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              style={{
                background: '#ffffff',
                border: '1.5px solid #eef2f6',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  background: coupon.color,
                  color: coupon.textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                    {coupon.icon}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-background)', margin: 0 }}>
                    {coupon.title}
                  </h3>
                  <span style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 600 }}>
                    {coupon.minOrder}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: 'var(--outline)', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                {coupon.description}
              </p>

              {/* Coupon Code Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
                border: '1px dashed var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 12px',
                marginTop: '4px'
              }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--primary)',
                  letterSpacing: '0.05em'
                }}>
                  {coupon.code}
                </span>
                
                <button
                  onClick={() => handleCopy(coupon.code)}
                  style={{
                    background: copiedCode === coupon.code ? 'var(--primary)' : 'rgba(132, 194, 37, 0.1)',
                    color: copiedCode === coupon.code ? '#ffffff' : 'var(--primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {copiedCode === coupon.code ? 'check_circle' : 'content_copy'}
                  </span>
                  {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
