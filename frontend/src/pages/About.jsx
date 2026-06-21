import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      <TopAppBar title="Our Story" showSearch />

      <main style={{ padding: '0 var(--container-padding) var(--space-xl)' }}>
        {/* Hero Section */}
        <section style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            position: 'relative',
            height: 200,
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 'var(--space-lg)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
              alt="Banda agricultural landscapes"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.2))',
            }} />
            <div style={{
              position: 'absolute',
              left: 'var(--space-md)',
              bottom: 'var(--space-md)',
              zIndex: 2,
            }}>
              <span className="text-label-sm" style={{
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                fontSize: 10,
              }}>
                Banda, Uttar Pradesh
              </span>
              <h2 style={{
                color: '#ffffff',
                margin: '4px 0 0',
                fontSize: 22,
                fontWeight: 800,
              }}>
                Rooted in Bundelkhand
              </h2>
            </div>
          </div>

          <p className="text-body-md" style={{
            color: 'var(--on-surface-variant)',
            lineHeight: 1.6,
            fontSize: 14,
            textAlign: 'center',
            maxWidth: '90%',
            margin: '0 auto',
          }}>
            BandaMart was born out of a simple idea: to connect the beautiful heritage of Banda, UP, with healthy modern living.
          </p>
        </section>

        {/* Story Timeline */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          
          {/* Chapter 1 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            borderBottom: '1px solid var(--outline-variant)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div style={{
              height: 150,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--outline-variant)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                alt="Ken River basin agricultural fields"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="text-title-md" style={{ color: 'var(--primary)', marginTop: 'var(--space-xs)', fontSize: 16 }}>
              Chapter 1: The Soil & The Ken River
            </h3>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              Along the fertile banks of the Ken River in Banda, the unique climate of the Bundelkhand region yields agricultural produce rich in nutrients. From sweet, sun-drenched mangoes to leafy green vegetables, the local earth is capable of organic greatness.
            </p>
          </div>

          {/* Chapter 2 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            borderBottom: '1px solid var(--outline-variant)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div style={{
              height: 150,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--outline-variant)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80"
                alt="Hardworking Indian Farmers"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="text-title-md" style={{ color: 'var(--primary)', marginTop: 'var(--space-xs)', fontSize: 16 }}>
              Chapter 2: Supporting Local Farmers
            </h3>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              Banda's dedicated farmers work tirelessly under the Bundelkhand sun. However, traditional market chains often leave them with low margins and high wastage. BandaMart partners directly with these local cultivators, ensuring fair pricing and a stable livelihood.
            </p>
          </div>

          {/* Chapter 3 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            borderBottom: '1px solid var(--outline-variant)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div style={{
              height: 150,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--outline-variant)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=80"
                alt="Fresh farm produce"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="text-title-md" style={{ color: 'var(--primary)', marginTop: 'var(--space-xs)', fontSize: 16 }}>
              Chapter 3: Connecting Soil to Soul
            </h3>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              We've created a direct connection. Our customers enjoy pesticide-free greens and farm-fresh harvest delivered straight to their doorstep using a simple WhatsApp checkout. No extra middle-men, no artificial storage—just pure, honest food.
            </p>
          </div>
        </section>

        {/* Call to action */}
        <section style={{
          textAlign: 'center',
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
        }}>
          <h4 className="text-title-md" style={{ margin: '0 0 var(--space-xs)' }}>
            Support Banda's Local Cultivation
          </h4>
          <p className="text-body-md" style={{ color: 'var(--outline)', marginBottom: 'var(--space-md)' }}>
            Every purchase helps empower a farmer family in Banda.
          </p>
          <button
            onClick={() => navigate('/categories')}
            style={{
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-xl)',
              fontWeight: 700,
              fontSize: 14,
              width: '100%',
              maxWidth: 240,
            }}
          >
            Start Shopping
          </button>
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
