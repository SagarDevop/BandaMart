import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

export default function Offers() {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ paddingBottom: 100 }}>
      {/* Dynamic heartbeat animation style injection */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.08); }
          28% { transform: scale(1); }
          42% { transform: scale(1.12); }
          70% { transform: scale(1); }
        }
      `}</style>

      <TopAppBar title="Best Offers" showBack={true} />

      <main style={{ 
        padding: '0 var(--container-padding) var(--space-xl)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '62dvh',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f4faf0 0%, #ffffff 100%)',
          border: '1.5px dashed var(--primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
          boxShadow: 'var(--shadow-md)',
          width: '100%',
          maxWidth: 400,
          marginTop: 'var(--space-md)',
        }}>
          {/* Pulsing Love/Worship Icon */}
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'rgba(132, 194, 37, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-xs)',
            animation: 'heartbeat 1.6s infinite ease-in-out',
          }}>
            <span className="material-symbols-outlined filled" style={{ fontSize: 38 }}>
              volunteer_activism
            </span>
          </div>

          <h2 style={{ 
            fontSize: 22, 
            fontWeight: 800, 
            color: 'var(--on-background)', 
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Offers Coming Soon! ⚡
          </h2>

          <p style={{ 
            fontSize: 14, 
            color: 'var(--outline)', 
            margin: 0, 
            lineHeight: 1.5,
            fontWeight: 650
          }}>
            Stay tuned Banda,<br/>show some love! ❤️
          </p>

          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: 'var(--space-xs)',
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: 12.5,
              boxShadow: '0 4px 12px rgba(132, 194, 37, 0.2)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Explore Products
          </button>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
