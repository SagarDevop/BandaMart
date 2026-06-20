import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import TopAppBar from '../components/TopAppBar';

export default function CategoryList() {
  const navigate = useNavigate();
  const { categories, getCategoryProductCount } = useProducts();

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      <TopAppBar title="Categories" showSearch />

      <main style={{ padding: 'var(--space-md) var(--container-padding)' }}>
        {categories.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 64, color: 'var(--outline-variant)', marginBottom: 'var(--space-md)', display: 'block',
            }}>
              category
            </span>
            <p className="text-title-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-sm)' }}>
              No categories found
            </p>
            <p className="text-body-md" style={{ color: 'var(--outline)', maxWidth: 260, margin: '0 auto', fontSize: 13, lineHeight: 1.4 }}>
              Shelves are currently empty. Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 140,
                  borderRadius: 'var(--radius-2xl)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.4s ease ${i * 0.08}s forwards`,
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
                    background: 'linear-gradient(135deg, rgba(25,28,27,0.7), rgba(25,28,27,0.2))',
                  }} />
                </div>
                <div style={{
                  position: 'relative', zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 var(--space-xl)',
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-sm)',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 24 }}>
                      {cat.icon}
                    </span>
                  </div>
                  <h3 className="text-headline-lg-mobile" style={{
                    color: 'white',
                    margin: 0,
                  }}>
                    {cat.name}
                  </h3>
                  <p className="text-label-sm" style={{
                    color: 'rgba(255,255,255,0.8)',
                    margin: '2px 0 0',
                  }}>
                    {getCategoryProductCount(cat.id)} Products
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CartBar />
      <BottomNav />
    </div>
  );
}
