import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* ── Background orbs ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(0, 98, 255, 0.06) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 80%, rgba(123, 97, 255, 0.05) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
      }} />

      {/* ── Fine dot grid ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 98, 255, 0.3)',
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
            color: '#1d1d1f',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontFamily: "'SF Pro Display', system-ui, sans-serif",
          }}>TutorMatch</span>
        </Link>
      </nav>

      {/* ── Card wrapper ── */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        margin: '0 auto',
        padding: '0 16px',
        animation: 'fadeSlideUp 0.45s ease forwards',
      }}>
        {/* Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <Outlet />
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: 20,
          marginBottom: 0,
          fontSize: 12,
          color: '#86868b',
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          © {new Date().getFullYear()} TutorMatch. Tất cả quyền được bảo lưu.
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
