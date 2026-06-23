import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import { ProductGridSkeleton, SkeletonCategory, SkeletonBanner } from '../components/SkeletonLoader';
import { APP_CONFIG } from '../data/sampleData';
import Logo from '../components/Logo';
import { optimizeImageUrl } from '../utils/image';

const welcomeSlides = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    badge: "👋 Welcome to BandaMart",
    title: "Everything you need, in one place"
  },
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    badge: "🚚 Flat Delivery",
    title: "Sirf ₹20 Delivery! Kitne ke bhi order pe! 🎉"
  },
  {
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=80",
    badge: "🥦 Fresh Vegetables",
    title: "Direct from organic farms"
  },
  {
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&auto=format&fit=crop&q=80",
    badge: "🥭 Seasonal Fruits",
    title: "Sweet & fresh fruits"
  },
  {
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
    badge: "🌸 Flowers & Dry Fruits",
    title: "Vibrant pooja flowers & nuts"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { categories, getFeaturedProducts, getCategoryProductCount, whatsappNumber } = useProducts();
  const { totalItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const featured = getFeaturedProducts();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);



  if (!loading && categories.length === 0) {
    return (
      <div className="app-container" style={{ paddingBottom: 140 }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-header)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md) var(--container-padding)',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--outline-variant)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Logo size={32} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
                <span style={{ color: 'var(--primary)' }}>Banda</span>
                <span style={{ color: 'var(--on-background)' }}>Mart</span>
              </h1>
              <span style={{ fontSize: '9px', color: 'var(--outline)', fontWeight: 500, letterSpacing: '-0.01em' }}>
                {APP_CONFIG.tagline}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              padding: 'var(--space-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 26 }}>
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
        </header>

        <main style={{
          padding: 'var(--space-2xl) var(--container-padding)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(22, 75, 43, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-lg)',
            color: 'var(--primary)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 44 }}>storefront</span>
          </div>
          
          <h2 className="text-headline-xl" style={{ color: '#164b2b', marginBottom: 'var(--space-sm)', fontWeight: 800 }}>
            Welcome to BandaMart
          </h2>
          
          <p className="text-body-md" style={{ color: 'var(--outline)', maxWidth: 290, margin: '0 auto var(--space-xl)', lineHeight: 1.5 }}>
            We are currently stocking our shelves with fresh products. Please check back shortly or contact us directly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%', maxWidth: 280 }}>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ripple"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#25D366',
                color: '#fff',
                padding: '14px 20px',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                fontSize: 15,
                transition: 'transform 0.2s',
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.76.46 3.42 1.34 4.89l-1.42 5.17 5.3-1.39c1.42.77 3.03 1.18 4.78 1.18 5.52 0 10-4.48 10-10s-4.48-10-10-10zm6.95 14.5c-.27.76-1.36 1.4-1.87 1.5-.47.1-1.07.16-3.15-.7-2.67-1.1-4.38-3.8-4.52-3.98-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.23.25-.26.54-.32.72-.32.18 0 .36.01.52.02.17.01.39-.06.61.47.23.56.78 1.9.85 2.04.07.14.07.31-.02.48-.09.18-.14.28-.27.44-.13.16-.28.36-.39.48-.12.13-.25.27-.1.52.15.25.66 1.09 1.42 1.76.98.86 1.8 1.13 2.06 1.25.26.13.41.1.56-.07.15-.17.65-.76.82-1.02.17-.26.34-.22.58-.13.23.09 1.5.71 1.76.84.26.13.43.2.49.3.07.1.07.6-.2 1.36z"/>
              </svg>
              Contact on WhatsApp
            </a>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Logo size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
              <span style={{ color: 'var(--primary)' }}>Banda</span>
              <span style={{ color: 'var(--on-background)' }}>Mart</span>
            </h1>
            <span style={{ fontSize: '9px', color: 'var(--outline)', fontWeight: 500, letterSpacing: '-0.01em' }}>
              {APP_CONFIG.tagline}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/cart')}
          style={{
            position: 'relative',
            padding: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 26 }}>
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
      </header>

      <main style={{ padding: '0 var(--container-padding)' }}>
        {/* Search Bar */}
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
              height: 48,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 'var(--space-md)',
              color: 'var(--outline)',
              flexGrow: 1,
              fontSize: 14,
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)', marginRight: 8, fontSize: 20 }}>
                search
              </span>
              <span style={{ color: 'var(--outline)', opacity: 0.8, fontSize: '13px' }}>
                Search for fruits, vegetables, grocery...
              </span>
            </div>
            <button
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0 24px',
                fontWeight: 700,
                fontSize: 14,
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

        {/* Hero Welcome Banner */}
        <section style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{
            position: 'relative',
            height: 180,
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f4faf0 0%, #e8f5e9 100%)',
            border: '1px solid rgba(132, 194, 37, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md)',
          }}>
            {/* Left side text content */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxWidth: '58%',
              zIndex: 2,
            }}>
              <div style={{
                alignSelf: 'start',
                padding: '3px 8px',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(132, 194, 37, 0.25)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--primary)',
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}>
                WELCOME TO BANDAMART 🥦
              </div>
              
              <h2 style={{
                color: 'var(--on-background)',
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}>
                Everything you need,<br />
                <span style={{ color: 'var(--primary)' }}>in one place</span>
              </h2>

              <p style={{
                fontSize: '10px',
                color: 'var(--outline)',
                margin: '2px 0 6px',
                lineHeight: 1.35,
                fontWeight: 500,
              }}>
                Order fresh fruits, vegetables & grocery online at best prices.
              </p>

              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/categories'); }}
                  style={{
                    background: 'var(--primary)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(132, 194, 37, 0.2)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13, fontWeight: 'bold' }}>shopping_bag</span>
                  Shop Now
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.76.46 3.42 1.34 4.89l-1.42 5.17 5.3-1.39c1.42.77 3.03 1.18 4.78 1.18 5.52 0 10-4.48 10-10s-4.48-10-10-10zm6.95 14.5c-.27.76-1.36 1.4-1.87 1.5-.47.1-1.07.16-3.15-.7-2.67-1.1-4.38-3.8-4.52-3.98-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.23.25-.26.54-.32.72-.32.18 0 .36.01.52.02.17.01.39-.06.61.47.23.56.78 1.9.85 2.04.07.14.07.31-.02.48-.09.18-.14.28-.27.44-.13.16-.28.36-.39.48-.12.13-.25.27-.1.52.15.25.66 1.09 1.42 1.76.98.86 1.8 1.13 2.06 1.25.26.13.41.1.56-.07.15-.17.65-.76.82-1.02.17-.26.34-.22.58-.13.23.09 1.5.71 1.76.84.26.13.43.2.49.3.07.1.07.6-.2 1.36z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Right side image - generated basket of vegetables */}
            <div style={{
              width: '42%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <img
                src="/vegetables_basket.png"
                alt="Fresh vegetable basket"
                style={{
                  width: '120%',
                  height: 'auto',
                  maxHeight: '160px',
                  objectFit: 'contain',
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-5px',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.08))',
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </section>

        {/* Side-by-Side Promo Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
        }}>
          {/* Card 1: Flat ₹20 Delivery */}
          <div style={{
            background: '#f4faf0',
            border: '1px solid rgba(132, 194, 37, 0.12)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px var(--space-xs)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <div style={{
              background: 'var(--primary)',
              color: '#fff',
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: 15 }}>local_shipping</span>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#164b2b', margin: 0, lineHeight: 1.2 }}>
                Flat ₹20 Delivery! 🚚
              </h4>
              <p style={{ fontSize: '9px', color: '#555', margin: '2px 0 0', lineHeight: 1.25, fontWeight: 500 }}>
                Sirf ₹20 kitne ke bhi order pe! No minimum purchase limits.
              </p>
            </div>
          </div>

          {/* Card 2: First Order ₹50 OFF */}
          <div style={{
            background: '#f4faf0',
            border: '1px solid rgba(132, 194, 37, 0.12)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px var(--space-xs)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}>
            <div style={{
              background: 'var(--primary)',
              color: '#fff',
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: 15 }}>sell</span>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#164b2b', margin: 0, lineHeight: 1.2 }}>
                First Order ₹50 OFF
              </h4>
              <p style={{ fontSize: '9px', color: '#555', margin: '2px 0 0', lineHeight: 1.25, fontWeight: 500 }}>
                Use code: WELCOME50. Valid on first order only.
              </p>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: 0, fontWeight: 700 }}>
              Categories
            </h3>
            <button
              onClick={() => navigate('/categories')}
              style={{
                color: 'var(--outline)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {[1, 2, 3, 4].map(i => <SkeletonCategory key={i} />)}
            </div>
          ) : (
            <div className="no-scrollbar" style={{
              display: 'flex',
              gap: 'var(--space-md)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-sm)',
              paddingTop: '4px',
            }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 6px 10px',
                    width: 90,
                    height: 114,
                    background: '#ffffff',
                    border: '1px solid #eef2f6',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#eef2f6';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    width: 76,
                    height: 68,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={optimizeImageUrl(cat.image, 140) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span style={{
                    color: 'var(--on-background)',
                    fontWeight: 700,
                    fontSize: '10.5px',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    display: 'block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          {loading ? <SkeletonBanner /> : (
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 'var(--radius-2xl)',
              height: 180,
              background: 'var(--primary-container)',
              animation: 'fadeInScale 0.5s ease forwards',
            }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh produce promotion"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.7s ease',
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(21,66,18,0.85), transparent)',
                }} />
              </div>
              <div style={{
                position: 'relative',
                zIndex: 1,
                padding: 'var(--space-lg)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '65%',
              }}>
                <h3 className="text-headline-lg-mobile" style={{
                  color: 'var(--on-primary)',
                  margin: '0 0 var(--space-xs)',
                  lineHeight: 1.3,
                }}>
                  🔥 Today's Fresh Arrivals
                </h3>
                <p className="text-body-md" style={{
                  color: 'var(--on-primary-container)',
                  margin: '0 0 var(--space-md)',
                }}>
                  Mangoes Starting ₹99/kg
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/category/fruits'); }}
                  style={{
                    background: 'var(--secondary-container)',
                    color: 'var(--on-secondary-container)',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: 12,
                    letterSpacing: '0.05em',
                    width: 'fit-content',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Best Selling Products */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: 0, fontWeight: 700 }}>
              Best Selling Products
            </h3>
            <button
              onClick={() => navigate('/categories')}
              style={{
                color: 'var(--outline)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>chevron_right</span>
            </button>
          </div>
          {loading ? <ProductGridSkeleton count={4} /> : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--grid-gutter)',
              paddingTop: '4px',
            }}>
              {featured.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} compact={true} />
              ))}
            </div>
          )}
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

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: 'var(--space-xl) var(--container-padding)',
          marginTop: 'var(--space-xl)',
          borderTop: '1px solid var(--outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          opacity: 0.7,
        }}>
          <p className="text-label-sm" style={{ margin: 0, color: 'var(--on-surface-variant)', fontSize: 11 }}>
            © 2026 BandaMart — Sab kuch, sabke paas
          </p>
          <button 
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: 0.5,
              textDecoration: 'underline',
              padding: '4px 8px',
            }}
          >
            Staff Portal
          </button>
        </footer>

      </main>

      {/* Floating WhatsApp Button */}
      <div style={{
        position: 'absolute',
        bottom: totalItems > 0 ? 140 : 80,
        right: 20,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '4px 10px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(37,211,102,0.3)',
          fontSize: '9px',
          fontWeight: 800,
          color: '#164b2b',
          whiteSpace: 'nowrap',
        }}>
          Order on WhatsApp
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#25D366',
            color: '#ffffff',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.76.46 3.42 1.34 4.89l-1.42 5.17 5.3-1.39c1.42.77 3.03 1.18 4.78 1.18 5.52 0 10-4.48 10-10s-4.48-10-10-10zm6.95 14.5c-.27.76-1.36 1.4-1.87 1.5-.47.1-1.07.16-3.15-.7-2.67-1.1-4.38-3.8-4.52-3.98-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.23.25-.26.54-.32.72-.32.18 0 .36.01.52.02.17.01.39-.06.61.47.23.56.78 1.9.85 2.04.07.14.07.31-.02.48-.09.18-.14.28-.27.44-.13.16-.28.36-.39.48-.12.13-.25.27-.1.52.15.25.66 1.09 1.42 1.76.98.86 1.8 1.13 2.06 1.25.26.13.41.1.56-.07.15-.17.65-.76.82-1.02.17-.26.34-.22.58-.13.23.09 1.5.71 1.76.84.26.13.43.2.49.3.07.1.07.6-.2 1.36z"/>
          </svg>
        </a>
      </div>

      <CartBar />
      <BottomNav />
    </div>
  );
}
