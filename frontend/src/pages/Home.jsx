import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { categories, products, whatsappNumber } = useProducts();
  const { totalItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleCopyOffer = (code) => {
    navigator.clipboard.writeText(code);
    triggerToast(`Coupon "${code}" copied to clipboard! 📋`);
  };

  // Retrieve products dynamically from backend context
  const featuredProds = products.filter(p => p.featured && p.available);
  const topSellingProducts = featuredProds.length > 0 
    ? featuredProds.slice(0, 4) 
    : products.filter(p => p.available).slice(0, 4);

  const normalProducts = products.filter(p => 
    p.available && !topSellingProducts.some(tsp => tsp.id === p.id)
  );

  return (
    <div className="app-container" style={{ paddingBottom: 110 }}>
      {/* Toast Feedback */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#164b2b',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: 'var(--radius-full)',
          zIndex: 1000,
          fontSize: 12,
          fontWeight: 700,
          boxShadow: 'var(--shadow-lg)',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMsg}
        </div>
      )}

      {/* 1. Location & Timer bar (Top row) - Statically Mawai, Banda */}
      <section style={{
        background: '#ffffff',
        padding: '8px var(--container-padding)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.03)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 18 }}>location_on</span>
          <span style={{ fontSize: 11, color: '#4a5568', fontWeight: 500 }}>Deliver to:</span>
          <span style={{ fontSize: 11, color: '#1a202c', fontWeight: 700 }}>Banda</span>
          <span className="material-symbols-outlined" style={{ color: '#4a5568', fontSize: 16 }}>arrow_drop_down</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#fffbf0',
          border: '1px solid #ffe8a3',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#ffb300', fontSize: 15, fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <span style={{ fontSize: 10, fontWeight: 750, color: '#b7791f', letterSpacing: '-0.01em' }}>20-30 Min Delivery</span>
        </div>
      </section>

      {/* 2. Header Bar (Hamburger menu only for show-off) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 80,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px var(--container-padding)',
        background: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#f8fafc',
              cursor: 'default'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#4a5568', fontSize: 22 }}>menu</span>
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--primary)' }}>Banda</span>
              <span style={{ color: 'var(--on-background)' }}>Mart</span>
            </h1>
            <span style={{ fontSize: '9px', color: 'var(--outline)', fontWeight: 500 }}>
              Sab kuch, sabke paas
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/search')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#4a5568', fontSize: 20 }}>
              search
            </span>
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#4a5568', fontSize: 20 }}>
              shopping_cart
            </span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--error)',
                color: 'var(--on-error)',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main style={{ padding: '0 var(--container-padding)' }}>
        {/* 3. Search Bar Input Row */}
        <section style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div
            onClick={() => navigate('/search')}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              background: '#ffffff',
              border: '1.5px solid var(--outline-variant)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              cursor: 'pointer',
              height: 46,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 'var(--space-md)',
              color: 'var(--outline)',
              flexGrow: 1,
              fontSize: 13,
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)', marginRight: 8, fontSize: 18 }}>
                search
              </span>
              <span style={{ color: '#718096', opacity: 0.8 }}>
                Search for products, categories...
              </span>
            </div>
            <button
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0 20px',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0 var(--radius-xl) var(--radius-xl) 0',
              }}
            >
              Search
            </button>
          </div>
        </section>

        {/* 4. Hero Welcome Banner (Redesigned) */}
        <section style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{
            position: 'relative',
            height: 168,
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f4faf0 0%, #e8f5e9 100%)',
            border: '1px solid rgba(132, 194, 37, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
          }}>
            {/* Left text block */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              maxWidth: '56%',
              zIndex: 2,
            }}>
              <h2 style={{
                color: '#1a301b',
                margin: 0,
                fontSize: '18px',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                Groceries, Dairy, Fruits,<br />
                Snacks & more
              </h2>
              
              <p style={{
                fontSize: '11px',
                color: '#2e7d32',
                margin: '0 0 8px',
                fontWeight: 700,
              }}>
                All in one place!
              </p>

              {/* Sub-badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 'bold' }}>check_circle</span>
                  <span style={{ fontSize: 9.5, color: '#4a5568', fontWeight: 600 }}>Best prices</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 'bold' }}>bolt</span>
                  <span style={{ fontSize: 9.5, color: '#4a5568', fontWeight: 600 }}>20-30 Min Delivery</span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); navigate('/categories'); }}
                style={{
                  background: 'var(--primary)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '11px',
                  width: 'fit-content',
                  boxShadow: '0 2px 4px rgba(132, 194, 37, 0.2)',
                }}
              >
                Shop Now
              </button>
            </div>

            {/* Right graphic layout */}
            <div style={{
              width: '44%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <img
                src="/grocery_hero.png"
                alt="Fresh grocery products layout"
                style={{
                  width: '125%',
                  height: 'auto',
                  maxHeight: '150px',
                  objectFit: 'contain',
                  position: 'absolute',
                  right: '-12px',
                  bottom: '-4px',
                  zIndex: 1,
                }}
                onError={(e) => {
                  e.target.src = '/vegetables_basket.png';
                }}
              />
            </div>
          </div>
        </section>

        {/* 7. Circular Categories scrolling list */}
        <section style={{ marginBottom: 'var(--space-lg)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 750, color: 'var(--on-surface)', margin: 0 }}>
              Categories
            </h3>
            <button
              onClick={() => navigate('/categories')}
              style={{
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>

          <div className="no-scrollbar" style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            paddingTop: '2px',
          }}>
            {categories.slice(0, 8).map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 70,
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  border: '1.5px solid #edf2f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '4px',
                }}>
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150'}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  color: '#2d3748',
                  height: 24,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {cat.name}
                </span>
              </div>
            ))}

            {/* View All circle */}
            <div
              onClick={() => navigate('/categories')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 70,
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: '#f4faf0',
                border: '1.5px solid var(--outline-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '4px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} style={{ width: 6, height: 6, borderRadius: '1.5px', background: 'var(--primary)' }} />
                  ))}
                </div>
              </div>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.15,
                color: '#2d3748',
              }}>
                View All
              </span>
            </div>
          </div>
        </section>

        {/* 6. Best Offers for You horizontal carousel */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-sm)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 750, color: 'var(--on-surface)', margin: 0 }}>
              Best Offers for You
            </h3>
            <button
              onClick={() => navigate('/offers')}
              style={{
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1.5px dashed var(--outline-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '12px',
            fontWeight: 650,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748b' }}>
              campaign
            </span>
            Coming Soon! No active offers.
          </div>
        </section>

        {/* 8. Top Selling Products Section - 4 in a row */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 750, color: 'var(--on-surface)', margin: 0 }}>
              Top Selling Products
            </h3>
            <button
              onClick={() => navigate('/categories')}
              style={{
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            paddingTop: '2px',
          }}>
            {topSellingProducts.map(product => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))}
          </div>
        </section>

        {/* Normal Products Section - 4 in a row */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 750, color: 'var(--on-surface)', margin: 0 }}>
              Our Fresh Catalogue
            </h3>
            <button
              onClick={() => navigate('/categories')}
              style={{
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            paddingTop: '2px',
          }}>
            {normalProducts.slice(0, 12).map(product => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))}
          </div>
        </section>

        {/* Features Strip */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-md)',
          background: '#f8fafc',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid #eef2f6',
          marginBottom: 'var(--space-xl)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>eco</span>
            <div style={{ lineHeight: 1.1 }}>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>Fresh Products</p>
              <p style={{ fontSize: '8.5px', color: '#777', margin: 0 }}>100% fresh & quality</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>local_shipping</span>
            <div style={{ lineHeight: 1.1 }}>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>Fast Delivery</p>
              <p style={{ fontSize: '8.5px', color: '#777', margin: 0 }}>On time at your door</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>verified_user</span>
            <div style={{ lineHeight: 1.1 }}>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>Secure Payment</p>
              <p style={{ fontSize: '8.5px', color: '#777', margin: 0 }}>100% safe & secure</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>storefront</span>
            <div style={{ lineHeight: 1.1 }}>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>Local Store</p>
              <p style={{ fontSize: '8.5px', color: '#777', margin: 0 }}>Trusted local seller</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <CartBar />
      <BottomNav />
    </div>
  );
}
