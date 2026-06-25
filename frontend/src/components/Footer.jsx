import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function FooterLink({ onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: '12px',
        color: hover ? '#ffffff' : '#cbd5e1',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        textAlign: 'left',
        width: 'fit-content',
      }}
    >
      {children}
    </span>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      triggerToast('Please enter a valid email address');
      return;
    }

    triggerToast('Thank you for subscribing!');
    setEmail('');
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePlaceholderLink = (e, name) => {
    e.preventDefault();
    triggerToast(`"${name}" page will be available soon!`);
  };

  return (
    <footer style={{
      background: '#0d3421',
      color: '#cbd5e1',
      padding: '28px 16px 85px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Footer Top: Multi-Column Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Column 1: Brand Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Logo container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Logo type="mark" size={30} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                <span style={{ color: '#84c225' }}>Banda</span>
                <span>Mart</span>
              </h3>
              <span style={{ fontSize: '7.5px', color: '#a1c97a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Sab kuch, sabke paas
              </span>
            </div>
          </div>
          
          <p style={{ 
            fontSize: '12px', 
            color: '#a3b899', 
            lineHeight: '1.5', 
            margin: '0 0 12px 0',
            textAlign: 'left'
          }}>
            Your one-stop destination for fresh fruits, vegetables, juices & groceries in Banda.
          </p>

          {/* Social Icons (No WhatsApp) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={socialLinkStyle}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#84c225';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={socialLinkStyle}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#84c225';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 2-Column Links Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          {/* Column 2: Quick Links */}
          <div>
            <h4 style={columnTitleStyle}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <FooterLink onClick={() => navigate('/')}>Home</FooterLink>
              <FooterLink onClick={() => navigate('/categories')}>Categories</FooterLink>
              <FooterLink onClick={() => navigate('/about')}>About Us</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Track Order')}>Track Order</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Privacy Policy')}>Privacy Policy</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Terms & Conditions')}>Terms & Conditions</FooterLink>
            </div>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 style={columnTitleStyle}>Customer Service</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Help & Support')}>Help & Support</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Returns & Refunds')}>Returns & Refunds</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Shipping Policy')}>Shipping Policy</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Cancellation Policy')}>Cancellation Policy</FooterLink>
              <FooterLink onClick={() => navigate('/admin')}>Staff Portal</FooterLink>
            </div>
          </div>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 style={columnTitleStyle}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={contactItemStyle}>
              <span className="material-symbols-outlined" style={contactIconStyle}>map</span>
              <span style={contactTextStyle}>Banda, Uttar Pradesh</span>
            </div>
            <div style={contactItemStyle}>
              <span className="material-symbols-outlined" style={contactIconStyle}>call</span>
              <a href="tel:+918957471581" style={{ ...contactTextStyle, textDecoration: 'none', color: '#cbd5e1' }}>+91 8957471581</a>
            </div>
            <div style={contactItemStyle}>
              <span className="material-symbols-outlined" style={contactIconStyle}>mail</span>
              <a href="mailto:aman1833777@gmail.com" style={{ ...contactTextStyle, textDecoration: 'none', color: '#cbd5e1' }}>aman1833777@gmail.com</a>
            </div>
            <div style={contactItemStyle}>
              <span className="material-symbols-outlined" style={contactIconStyle}>schedule</span>
              <span style={contactTextStyle}>Mon - Sun: 7:00 AM - 10:00 PM</span>
            </div>
          </div>
        </div>

        {/* Column 5: Subscribe to Newsletter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '4px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Subscribe to Our Newsletter
          </h4>
          <p style={{ fontSize: '10.5px', color: '#a3b899', marginBottom: '8px', textAlign: 'left' }}>
            Get daily offers & updates directly.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '12px',
                color: '#1e293b',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#84c225',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#72a81e'}
              onMouseLeave={e => e.currentTarget.style.background = '#84c225'}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom Area */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10.5px',
        color: '#a3b899',
        textAlign: 'center'
      }}>
        <span>© 2026 BandaMart. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <span style={{ color: '#e11d48' }}>❤️</span> in Banda
        </span>
      </div>

      {/* Custom Local Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '95px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#333333',
          color: '#ffffff',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 500,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease',
        }}>
          {toastMsg}
        </div>
      )}
    </footer>
  );
}

// Resusable Styles
const socialLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
  transition: 'all 0.2s ease',
};

const columnTitleStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '12px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  textAlign: 'left',
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const contactIconStyle = {
  color: '#84c225',
  fontSize: '16px',
};

const contactTextStyle = {
  fontSize: '12px',
  color: '#cbd5e1',
  textAlign: 'left',
};
