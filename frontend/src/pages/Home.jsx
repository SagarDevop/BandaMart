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
                <span style={{ color: 'var(--primary)' }}>Band</span>
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
              <span style={{ color: 'var(--primary)' }}>Band</span>
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
        {/* Welcome + Search */}
        <section style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            position: 'relative',
            height: 180,
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 'var(--space-lg)',
            background: 'var(--surface-container-low)',
          }}>
            {/* Slide Image & Overlay */}
            <div key={activeSlide} className="animate-image-fade" style={{
              position: 'absolute',
              inset: 0,
            }}>
              <img
                src={welcomeSlides[activeSlide].image}
                alt={welcomeSlides[activeSlide].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.1))',
              }} />
            </div>

            {/* Slide Content */}
            <div style={{
              position: 'absolute',
              left: 'var(--space-md)',
              bottom: 'var(--space-md)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxWidth: '75%',
            }}>
              <div style={{
                alignSelf: 'start',
                padding: '3px 8px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {welcomeSlides[activeSlide].badge}
              </div>
              <h2 style={{
                color: '#ffffff',
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1.25,
              }}>
                {welcomeSlides[activeSlide].title}
              </h2>
            </div>

            {/* Indicator Dots */}
            <div style={{
              position: 'absolute',
              right: 'var(--space-md)',
              bottom: 'var(--space-md)',
              zIndex: 2,
              display: 'flex',
              gap: '4px',
            }}>
              {welcomeSlides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                  style={{
                    width: idx === activeSlide ? 12 : 5,
                    height: 5,
                    borderRadius: 'var(--radius-full)',
                    background: idx === activeSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </div>
          <div
            onClick={() => navigate('/search')}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              background: 'var(--surface-container-lowest)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              cursor: 'pointer',
              height: 48,
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
              <span style={{ color: 'var(--outline)', opacity: 0.8 }}>
                Search for fruits, vegetables, grocery...
              </span>
            </div>
            <button
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0 20px',
                fontWeight: 600,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Search
            </button>
          </div>
        </section>

        {/* Delivery Badge Banner */}
        <section style={{
          width: '100%',
          marginBottom: 'var(--space-xl)',
          animation: 'fadeInUp 0.4s ease forwards',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            background: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(132, 194, 37, 0.15)',
          }}>
            <div style={{
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: 20 }}>local_shipping</span>
            </div>
            <div>
              <p className="text-title-md" style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                Flat ₹20 Delivery! 🎉
              </p>
              <p className="text-body-md" style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.9, lineHeight: 1.25 }}>
                Sirf ₹20 kitne ke bhi order pe! No minimum purchase limits.
              </p>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-md)' }}>
            Categories
          </h3>
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
            }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={optimizeImageUrl(cat.image, 120) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span className="text-label-sm" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
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

        {/* Featured Products */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}>
            <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: 0 }}>
              Featured Products
            </h3>
            <button
              onClick={() => navigate('/categories')}
              className="text-label-sm"
              style={{ color: 'var(--primary)' }}
            >
              View All
            </button>
          </div>
          {loading ? <ProductGridSkeleton count={4} /> : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--grid-gutter)',
            }}>
              {featured.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
            © 2026 BandMart — Sab kuch, sabke paas
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

      <CartBar />
      <BottomNav />
    </div>
  );
}
