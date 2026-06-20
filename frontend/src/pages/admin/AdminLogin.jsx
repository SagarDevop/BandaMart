import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../context/ProductContext';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        localStorage.setItem('bandamart_admin', JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
        navigate('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to backend server. Please verify it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--container-padding)',
      background: 'var(--background)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        animation: 'fadeInScale 0.5s ease forwards',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Logo type="full" size={72} />
          <h3 className="text-title-md" style={{ color: 'var(--primary)', margin: '16px 0 4px' }}>
            Admin Control Panel
          </h3>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            Sign in to manage your store
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-xl)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          {error && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--error-container)',
              color: 'var(--on-error-container)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 'var(--space-lg)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              animation: 'fadeInUp 0.3s ease',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="text-label-sm" style={{
              display: 'block', color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-xs)', marginLeft: 4,
            }}>Username</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 'var(--space-md)', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>person</span>
              </div>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Enter username"
                autoComplete="username"
                style={{
                  width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: 16, color: 'var(--on-surface)',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="text-label-sm" style={{
              display: 'block', color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-xs)', marginLeft: 4,
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 'var(--space-md)', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>lock</span>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: 'var(--space-md)', paddingLeft: 48,
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: 16, color: 'var(--on-surface)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 'var(--space-md)',
              background: 'var(--primary)', color: 'var(--on-primary)',
              borderRadius: 'var(--radius-xl)',
              fontWeight: 700, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 'var(--space-sm)',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">sync</span>
            ) : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'var(--space-xs)', margin: 'var(--space-lg) auto 0',
            color: 'var(--on-surface-variant)', fontSize: 14,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Back to Store
        </button>
      </div>
    </div>
  );
}
