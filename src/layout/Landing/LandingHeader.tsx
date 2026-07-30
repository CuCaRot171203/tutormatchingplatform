import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

const NAV_LINKS = [
  { label: 'Tìm gia sư', href: '/find-tutor' },
  { label: 'Môn học', href: '/subjects' },
  { label: 'Bảng giá', href: '/pricing' },
  { label: 'Về chúng tôi', href: '/about' },
];

const LandingHeader: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      background: 'rgba(8, 11, 18, 0.72)',
      backdropFilter: 'blur(20px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    }}>
      {/* Left: Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 98, 255, 0.35)',
          }}>
            <span style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
              letterSpacing: '-0.02em',
            }}>TM</span>
          </div>
          <span style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
          }}>TutorMatch</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                fontSize: 13,
                color: 'rgba(255, 255, 255, 0.65)',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 400,
                transition: 'all 0.2s ease',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
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
            Dashboard
          </button>
        ) : (
          <>
            <Link to="/login">
              <button style={{
                padding: '7px 18px',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'transparent';
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
