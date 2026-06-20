import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import { ProductGridSkeleton, SkeletonCategory, SkeletonBanner } from '../components/SkeletonLoader';
import { APP_CONFIG, WHATSAPP_NUMBER } from '../data/sampleData';
import Logo from '../components/Logo';

export default function Home() {
  const navigate = useNavigate();
  const { categories, getFeaturedProducts, getCategoryProductCount } = useProducts();
  const { totalItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const featured = getFeaturedProducts();

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
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <Logo size={32} />
            <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
              {APP_CONFIG.name}
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/login')}
            style={{ padding: 'var(--space-xs)', opacity: 0.7 }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
              admin_panel_settings
            </span>
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
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
            
            <button
              onClick={() => navigate('/admin/login')}
              style={{
                background: 'var(--surface-container-high)',
                color: 'var(--primary)',
                padding: '14px 20px',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Store Admin Login
            </button>
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <Logo size={32} />
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
            {APP_CONFIG.name}
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          style={{ padding: 'var(--space-xs)', opacity: 0.7 }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
            admin_panel_settings
          </span>
        </button>
      </header>

      <main style={{ padding: '0 var(--container-padding)' }}>
        {/* Welcome + Search */}
        <section style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(22, 75, 43, 0.06)',
              borderRadius: 'var(--radius-full)',
              color: '#164b2b',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}>
              <span>👋 Welcome to BandaMart</span>
            </div>
            <h2 className="text-headline-xl" style={{
              color: '#164b2b',
              margin: 0,
              lineHeight: 1.25,
            }}>
              Find <span style={{
                background: 'linear-gradient(135deg, #164b2b, #4caf50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>fresh food</span><br />
              for your <span style={{
                background: 'linear-gradient(135deg, #4caf50, #002201)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>health</span>
            </h2>
          </div>
          <div
            onClick={() => navigate('/search')}
            style={{
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'absolute',
              left: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>
                search
              </span>
            </div>
            <div style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'var(--surface-container-lowest)',
              border: '1px solid rgba(22, 75, 43, 0.1)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--on-surface-variant)',
              opacity: 0.8,
              fontSize: 15,
              fontWeight: 500,
            }}>
              Search products...
            </div>
          </div>
        </section>

        {/* Categories */}
        <section style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-md)' }}>
            Categories
          </h3>
          {loading ? (
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {[1,2,3,4].map(i => <SkeletonCategory key={i} />)}
            </div>
          ) : (
            <div className="no-scrollbar" style={{
              display: 'flex',
              gap: 'var(--space-md)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-sm)',
            }}>
              {categories.map((cat, i) => (
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
                    animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div style={{
                    width: 64,
                    height: 64,
                    background: cat.bgColor,
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                    onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                    onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span className="material-symbols-outlined" style={{
                      color: cat.color,
                      fontSize: 28,
                    }}>
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-label-sm" style={{ color: 'var(--on-surface)' }}>
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVZOZVxWyiz1Jynt5CtZcRCyyJ71GyTX9Rrt4PwRx1AhcB0tYnOjKwq_jJza1vQVwwGbxRohm7iMQaF2Nma341KVljwmL3PuLuuc-oA4suOQ31P_QnkRbH04QMIuLn1b6EJ3wxSs_h5nx9CEXG00ZUuxlXCrFXDZf_UJXxCsBnYHIuMM1uUAPeA77XKN2m6yIBdNqAL4GOQtUlZHqFDVieKg01ewxde55_8SI7M0ovtVbQMnqH7ny79VE15tu7OMkscH3yelY8-XU"
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

        {/* Popular Categories */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-md)' }}>
            Popular Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {categories.slice(0, 4).map((cat, i) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 120,
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.4s ease ${i * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                    alt={cat.name}
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.7s ease',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(25,28,27,0.65), transparent)',
                  }} />
                </div>
                <div style={{
                  position: 'relative', zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 var(--space-lg)',
                }}>
                  <h4 className="text-headline-lg-mobile" style={{
                    color: 'var(--on-primary)',
                    margin: 0,
                  }}>
                    {cat.name}
                  </h4>
                  <p className="text-label-sm" style={{
                    color: 'var(--primary-fixed)',
                    margin: '2px 0 0',
                  }}>
                    {getCategoryProductCount(cat.id)} Products
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <CartBar />
      <BottomNav />
    </div>
  );
}
