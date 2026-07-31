import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

const NAV_LINKS = [
  { label: 'Tìm gia sư', href: '/find-tutor' },
  { label: 'Môn học', href: '/subjects' },
  { label: 'Bảng giá', href: '/pricing' },
  { label: 'Về chúng tôi', href: '/about' },
];

const LandingHeader: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleDashboard = () => {
    if (user?.role === 'Student') navigate('/student/dashboard');
    else if (user?.role === 'Tutor') navigate('/tutor/dashboard');
    else if (user?.role === 'Administrator') navigate('/admin/dashboard');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 40px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled
        ? 'rgba(255, 255, 255, 0.92)'
        : 'rgba(255, 255, 255, 0.0)',
      backdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
      transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
    }}>
      {/* Left: Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/src/assets/branding/Logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span style={{
            color: '#1d1d1f',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
          }}>TutorMatch</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  color: isActive ? '#0062FF' : '#6e6e73',
                  textDecoration: 'none',
                  borderRadius: 8,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  background: isActive ? 'rgba(0, 98, 255, 0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#1d1d1f';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#6e6e73';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isAuthenticated ? (
          <button
            onClick={handleDashboard}
            style={{
              padding: '7px 20px',
              background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 10px rgba(0, 98, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.88';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Dashboard
          </button>
        ) : (
          <>
            <Link to="/login">
              <button style={{
                padding: '7px 18px',
                background: 'transparent',
                color: '#1d1d1f',
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                }}
              >
                Đăng nhập
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '7px 18px',
                background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                boxShadow: '0 2px 10px rgba(0, 98, 255, 0.3)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Đăng ký
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingHeader;
