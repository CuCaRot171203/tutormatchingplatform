import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (user?.role === 'Student') navigate('/student/dashboard');
    else if (user?.role === 'Tutor') navigate('/tutor/dashboard');
    else if (user?.role === 'Administrator') navigate('/admin/dashboard');
  };

  return (
    <div style={{ backgroundColor: 'var(--apple-surface-black)', color: 'var(--apple-on-dark)', fontFamily: "'SF Pro Text', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>

      {/* =========================================
          GLOBAL NAV
      ========================================= */}
      <nav className="apple-global-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 28,
              height: 28,
              backgroundColor: 'var(--apple-primary)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'SF Pro Display', system-ui, sans-serif" }}>TM</span>
            </div>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 400, letterSpacing: '-0.01em' }}>TutorMatch</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isAuthenticated ? (
            <button
              onClick={handleDashboard}
              className="apple-btn-dark-utility"
              style={{ fontSize: 12 }}
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="apple-btn-dark-utility" style={{ fontSize: 12 }}>Đăng nhập</button>
              </Link>
              <Link to="/register">
                <button className="apple-btn-primary" style={{ padding: '6px 16px', fontSize: 13 }}>Đăng ký</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* =========================================
          HERO TILE — full-width banner layout
          Image takes 50% of screen, text left, all white
      ========================================= */}
      <section
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          overflow: 'hidden',
          background: '#080b12',
        }}
      >
        {/* ── Fabric/Water animated background (text side) ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', gridColumn: '1' }}>
          {/* Mesh gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 100% 80% at 10% 50%, rgba(0,102,204,0.20) 0%, transparent 60%),
              radial-gradient(ellipse 60% 60% at 90% 20%, rgba(94,92,230,0.14) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 50% 90%, rgba(100,210,255,0.08) 0%, transparent 60%)
            `,
          }} />
          {/* SVG turbulence fabric overlay */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
            <filter id="fabric-filter-hero">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.008" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <rect width="100%" height="100%" fill="none" />
            <g filter="url(#fabric-filter-hero)">
              <circle cx="40%" cy="50%" r="50vw" fill="rgba(0,102,204,0.4)" />
              <circle cx="80%" cy="30%" r="35vw" fill="rgba(94,92,230,0.3)" />
              <circle cx="20%" cy="80%" r="25vw" fill="rgba(100,210,255,0.2)" />
            </g>
          </svg>
          {/* Scanline */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* ── Left: Text Content (all white) ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 64px',
          position: 'relative',
          zIndex: 2,
          animation: 'heroFadeIn 0.9s ease-out both',
        }}>
          <h1 style={{
            fontSize: 'clamp(40px, 5.5vw, 68px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            marginBottom: 24,
          }}>
            Nền tảng kết nối<br/> gia sư &amp; học sinh
          </h1>

          <p style={{
            fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 16,
            maxWidth: 420,
          }}>
            Đặt phiên học trực tuyến, theo dõi tiến độ, đánh giá gia sư — tất cả trong một nền tảng.
          </p>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/register">
                <button className="apple-btn-store-hero">Bắt đầu miễn phí</button>
              </Link>
              <Link to="/login">
                <button className="apple-btn-secondary-pill">Tìm hiểu thêm</button>
              </Link>
            </div>
          ) : (
            <button className="apple-btn-store-hero" onClick={handleDashboard}>
              Đi đến Dashboard
            </button>
          )}

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: 40,
            marginTop: 20,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { value: '2,400+', label: 'Gia sư chất lượng' },
              { value: '15,000+', label: 'Phiên học hoàn thành' },
              { value: '4.9★', label: 'Điểm uy tín trung bình' },
            ].map((stat, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1,
                }}>{stat.value}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.45)',
                  margin: '6px 0 0',
                  letterSpacing: '0.01em',
                }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Banner image 50% viewport ── */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          animation: 'heroFadeIn 0.9s ease-out 0.15s both',
        }}>
          {/* Image crossfade */}
          {[
            {
              src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85',
              alt: 'Học sinh & gia sư học trực tuyến',
            },
            {
              src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=85',
              alt: 'Học tập trên giấy và thiết bị',
            },
            {
              src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=85',
              alt: 'Giáo viên giảng dạy trên lớp',
            },
            {
              src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=85',
              alt: 'Học nhóm và thảo luận',
            },
          ].map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className={`hero-banner-img hero-banner-img-${i}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ))}

          {/* Gradient overlay — left fade into text */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(8,11,18,0.50) 0%, transparent 30%, transparent 60%, rgba(8,11,18,0.15) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Gradient overlay — bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(8,11,18,0.80) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Navigation dots */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
            zIndex: 5,
          }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`hero-banner-dot-${i}`} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.40)', cursor: 'pointer' }} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 3,
          animation: 'heroFadeIn 1s ease-out 1s both',
        }}>
          <p style={{
            fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
          }}>Cuộn xuống</p>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)', animation: 'scrollLine 2s ease-in-out infinite' }} />
        </div>
      </section>

      <style>{`
        /* Hero entrance */
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1; transform: scaleY(1.3); }
        }

        /* Banner image cycling — 4 images, 5s each */
        .hero-banner-img-0 { animation: bannerImg0 20s ease-in-out infinite; }
        .hero-banner-img-1 { animation: bannerImg1 20s ease-in-out infinite; }
        .hero-banner-img-2 { animation: bannerImg2 20s ease-in-out infinite; }
        .hero-banner-img-3 { animation: bannerImg3 20s ease-in-out infinite; }

        @keyframes bannerImg0 {
          0%, 20%   { opacity: 1; transform: scale(1); }
          30%, 100% { opacity: 0; transform: scale(1.04); }
        }
        @keyframes bannerImg1 {
          0%, 20%   { opacity: 0; transform: scale(1.04); }
          30%, 50%  { opacity: 1; transform: scale(1); }
          60%, 100% { opacity: 0; transform: scale(1.04); }
        }
        @keyframes bannerImg2 {
          0%, 50%   { opacity: 0; transform: scale(1.04); }
          60%, 80%  { opacity: 1; transform: scale(1); }
          90%, 100% { opacity: 0; transform: scale(1.04); }
        }
        @keyframes bannerImg3 {
          0%, 80%   { opacity: 0; transform: scale(1.04); }
          90%, 100% { opacity: 1; transform: scale(1); }
        }

        /* Banner dots cycling */
        .hero-banner-dot-0 { animation: bannerDot0 20s ease-in-out infinite; }
        .hero-banner-dot-1 { animation: bannerDot1 20s ease-in-out infinite; }
        .hero-banner-dot-2 { animation: bannerDot2 20s ease-in-out infinite; }
        .hero-banner-dot-3 { animation: bannerDot3 20s ease-in-out infinite; }

        @keyframes bannerDot0 {
          0%, 20%  { background: rgba(255,255,255,0.90) !important; transform: scale(1.5); }
          30%, 100%{ background: rgba(255,255,255,0.35) !important; transform: scale(1); }
        }
        @keyframes bannerDot1 {
          0%, 20%  { background: rgba(255,255,255,0.35) !important; transform: scale(1); }
          30%, 50% { background: rgba(255,255,255,0.90) !important; transform: scale(1.5); }
          60%, 100%{ background: rgba(255,255,255,0.35) !important; transform: scale(1); }
        }
        @keyframes bannerDot2 {
          0%, 50%  { background: rgba(255,255,255,0.35) !important; transform: scale(1); }
          60%, 80% { background: rgba(255,255,255,0.90) !important; transform: scale(1.5); }
          90%, 100%{ background: rgba(255,255,255,0.35) !important; transform: scale(1); }
        }
        @keyframes bannerDot3 {
          0%, 80%  { background: rgba(255,255,255,0.35) !important; transform: scale(1); }
          90%, 100%{ background: rgba(255,255,255,0.90) !important; transform: scale(1.5); }
        }

        /* Responsive: stack on mobile */
        @media (max-width: 768px) {
          section {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          section > div:first-child {
            padding: 60px 24px 32px !important;
          }
          section > div:last-child {
            height: 50vw !important;
            min-height: 260px !important;
          }
        }
      `}</style>

      {/* =========================================
          TILE 2: PLATFORM OVERVIEW — 2-col layout
          Light surface with subtle animated mesh
      ========================================= */}
      <section style={{
        backgroundColor: '#f5f5f7',
        padding: '96px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ── Animated mesh background ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Soft gradient blobs */}
          <div style={{
            position: 'absolute',
            top: '-20%', left: '-10%',
            width: '60vw', height: '60vw',
            background: 'radial-gradient(ellipse, rgba(0,102,204,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'meshFloatA 18s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-15%', right: '-5%',
            width: '50vw', height: '50vw',
            background: 'radial-gradient(ellipse, rgba(94,92,230,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'meshFloatB 22s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '30%', right: '20%',
            width: '30vw', height: '30vw',
            background: 'radial-gradient(ellipse, rgba(100,210,255,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'meshFloatC 16s ease-in-out infinite',
          }} />
          {/* Fine dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }} />
          {/* SVG wave border */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 80, overflow: 'visible' }} viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="rgba(0,0,0,0.04)" />
          </svg>
        </div>

        {/* ── Content: 2-column grid ── */}
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
          position: 'relative',
          zIndex: 2,
        }}
        className="overview-2col"
        >
          {/* Left: Text */}
          <div style={{ animation: 'tileFadeUp 0.7s ease-out both' }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 20,
            }}>
              Một hệ thống hoàn chỉnh<br />cho hành trình học tập
            </h2>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.65,
              color: 'rgba(0,0,0,0.55)',
              maxWidth: 420,
            }}>
              TutorMatch kết nối bạn với gia sư được phê duyệt, giúp bạn đặt lịch, theo dõi tiến độ và đánh giá chất lượng — tất cả trong một hệ thống duy nhất.
            </p>

            {/* Mini feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 36 }}>
              {['Đặt lịch tức thì', 'Theo dõi tiến độ', 'Đánh giá minh bạch'].map((tag, i) => (
                <div key={i} style={{
                  padding: '6px 14px',
                  backgroundColor: 'rgba(0,102,204,0.07)',
                  border: '1px solid rgba(0,102,204,0.15)',
                  borderRadius: 100,
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#0066cc',
                  letterSpacing: '0.01em',
                }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            animation: 'tileFadeUp 0.7s ease-out 0.15s both',
          }} className="overview-card-grid">
            {[
              {
                step: '01',
                title: 'Tìm kiếm thông minh',
                desc: 'Lọc gia sư theo môn học, lịch rảnh, điểm uy tín',
                accent: '#0066cc',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Đặt lịch linh hoạt',
                desc: 'Chọn thời gian phù hợp, gia sư xác nhận tức thì',
                accent: '#5e5ce6',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Theo dõi tiến độ',
                desc: 'Đặt mục tiêu, ghi kết quả, biểu đồ trực quan',
                accent: '#64d2ff',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Hệ thống tín dụng',
                desc: 'Nạp credit, thanh toán phí, hoàn tiền minh bạch',
                accent: '#bf5af2',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: '05',
                title: 'Đánh giá song phương',
                desc: 'Cả gia sư và học sinh đều có thể đánh giá',
                accent: '#ff9f0a',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: '06',
                title: 'Khiếu nại & xử lý',
                desc: 'Cơ chế phản hồi, cảnh cáo và tạm khóa vi phạm',
                accent: '#ff3b30',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 8V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="overview-card"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 16,
                  padding: '18px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${item.accent}22`;
                  el.style.borderColor = `${item.accent}44`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'rgba(0,0,0,0.08)';
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                  borderRadius: '16px 16px 0 0',
                }} />
                {/* Icon */}
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: `${item.accent}14`,
                  border: `1px solid ${item.accent}28`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  color: item.accent,
                }}>
                  {item.icon}
                </div>
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1d1d1f',
                  margin: '0 0 4px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>{item.title}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.45)',
                  margin: 0,
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TILE 3: HOW IT WORKS (Dark 2)
      ========================================= */}
      <section className="apple-tile-dark-2">
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--apple-primary-on-dark)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Quy trình
          </p>
          <h2 className="apple-display-lg" style={{ color: '#fff', marginBottom: 56 }}>
            Cách thức hoạt động
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
            {[
              { step: '01', title: 'Đăng ký & chọn vai trò', desc: 'Đăng ký với vai trò Học sinh hoặc Gia sư. Hồ sơ gia sư cần Admin phê duyệt trước khi nhận học sinh.' },
              { step: '02', title: 'Tìm & kết nối', desc: 'Học sinh tìm gia sư theo môn học, lịch rảnh và điểm uy tín. Gửi yêu cầu đặt phiên học.' },
              { step: '03', title: 'Xác nhận phiên học', desc: 'Gia sư xác nhận yêu cầu. Phiên học được xác nhận, cả hai bên nhận email nhắc lịch tự động.' },
              { step: '04', title: 'Học & ghi nhận kết quả', desc: 'Phiên diễn ra qua link họp trực tuyến. Gia sư ghi nhận kết quả, tiến độ mục tiêu được cập nhật.' },
              { step: '05', title: 'Đánh giá & tính điểm', desc: 'Cả hai đánh giá phiên học. Điểm uy tín gia sư được tính lại tự động mỗi 24 giờ.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '24px',
                borderRight: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <p style={{ fontSize: 48, fontWeight: 700, color: 'rgba(255,255,255,0.1)', marginBottom: 12, lineHeight: 1 }}>{item.step}</p>
                <h3 className="apple-body-strong" style={{ color: '#fff', marginBottom: 10 }}>{item.title}</h3>
                <p className="apple-caption" style={{ color: 'var(--apple-body-muted)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TILE 4: USER ROLES (Light)
      ========================================= */}
      <section className="apple-tile-light">
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--apple-ink-muted-48)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Vai trò người dùng
          </p>
          <h2 className="apple-display-lg" style={{ color: 'var(--apple-ink)', marginBottom: 48 }}>
            Ba vai trò, một hệ thống liền mạch
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Student */}
            <div style={{
              backgroundColor: 'var(--apple-canvas-parchment)',
              borderRadius: 'var(--apple-rounded-lg)',
              padding: '32px',
              textAlign: 'left',
              border: '1px solid var(--apple-divider-soft)',
            }}>
              <div style={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L15.09 8.26L20 9.27L16 13.14L16.58 18.02L12 15.77L7.42 18.02L8 13.14L4 9.27L8.91 8.26L12 4Z" fill="#0066cc" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="apple-display-md" style={{ color: 'var(--apple-ink)', marginBottom: 8, fontSize: 24 }}>Học sinh</h3>
              <p className="apple-caption" style={{ color: 'var(--apple-ink-muted-80)', marginBottom: 20 }}>
                Tìm gia sư phù hợp, đặt phiên học, theo dõi mục tiêu và đánh giá chất lượng giảng dạy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Tìm kiếm gia sư theo môn & lịch', 'Đặt & quản lý phiên học', 'Nạp & quản lý Credit', 'Đặt mục tiêu học tập', 'Xem biểu đồ tiến độ', 'Đánh giá gia sư'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--apple-primary)', flexShrink: 0 }} />
                    <span className="apple-caption" style={{ color: 'var(--apple-ink)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor */}
            <div style={{
              backgroundColor: 'var(--apple-surface-tile-1)',
              borderRadius: 'var(--apple-rounded-lg)',
              padding: '32px',
              textAlign: 'left',
            }}>
              <div style={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(41, 151, 255, 0.15)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" stroke="#2997ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="4" stroke="#2997ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 8C20.5 9.5 21 11 21 13C21 15.5 19.5 17 17 17" stroke="#2997ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="apple-display-md" style={{ color: '#fff', marginBottom: 8, fontSize: 24 }}>Gia sư</h3>
              <p className="apple-caption" style={{ color: 'var(--apple-body-muted)', marginBottom: 20 }}>
                Cập nhật hồ sơ, quản lý lịch rảnh, xác nhận phiên học và ghi nhận kết quả học tập cho học sinh.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Cập nhật bio & bằng cấp', 'Quản lý lịch rảnh hàng tuần', 'Xác nhận / từ chối phiên học', 'Ghi nhận kết quả phiên', 'Đặt mục tiêu cho học sinh', 'Đánh giá học sinh'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--apple-primary-on-dark)', flexShrink: 0 }} />
                    <span className="apple-caption" style={{ color: 'var(--apple-body-muted)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin */}
            <div style={{
              backgroundColor: 'var(--apple-canvas-parchment)',
              borderRadius: 'var(--apple-rounded-lg)',
              padding: '32px',
              textAlign: 'left',
              border: '1px solid var(--apple-divider-soft)',
            }}>
              <div style={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 21C3 17.134 7.02944 14 11 14C14.9706 14 19 17.134 19 21" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="apple-display-md" style={{ color: 'var(--apple-ink)', marginBottom: 8, fontSize: 24 }}>Quản trị</h3>
              <p className="apple-caption" style={{ color: 'var(--apple-ink-muted-80)', marginBottom: 20 }}>
                Phê duyệt hồ sơ gia sư, quản lý tín dụng, xử lý khiếu nại và theo dõi thống kê hệ thống.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Duyệt / từ chối hồ sơ gia sư', 'Duyệt yêu cầu nạp credit', 'Xử lý khiếu nại vi phạm', 'Dashboard thống kê', 'Quản lý môn học', 'Cảnh cáo / tạm khóa tài khoản'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--apple-primary)', flexShrink: 0 }} />
                    <span className="apple-caption" style={{ color: 'var(--apple-ink)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          TILE 5: FEATURES — 2 rows × 4 cols with hover effects
      ========================================= */}
      <section style={{
        backgroundColor: '#0a0a14',
        padding: '96px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ── Background ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 15% 30%, rgba(0,102,204,0.12) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 85% 70%, rgba(94,92,230,0.10) 0%, transparent 55%)
            `,
          }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
            <filter id="fabric-filter-features">
              <feTurbulence type="fractalNoise" baseFrequency="0.014 0.010" numOctaves="4" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <g filter="url(#fabric-filter-features)">
              <circle cx="25%" cy="40%" r="30vw" fill="rgba(41,151,255,0.5)" />
              <circle cx="75%" cy="65%" r="25vw" fill="rgba(94,92,230,0.4)" />
            </g>
          </svg>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: 'rgba(41,151,255,0.7)',
            textTransform: 'uppercase',
            marginBottom: 14,
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
          }}>
            Tính năng cốt lõi
          </p>
          <h2 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: 60,
          }}>
            Tất cả những gì bạn cần<br />để học tập hiệu quả
          </h2>

          {/* 2 rows × 4 cols */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
          }}
          className="feature-card-grid"
          >
            {[
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#2997ff" strokeWidth="1.8"/>
                    <path d="M21 21L16.65 16.65" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Tìm kiếm thông minh',
                desc: 'Lọc gia sư theo môn học, lịch rảnh và điểm uy tín. Tìm kiếm nhanh chóng, chính xác.',
                accent: '#2997ff',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#5e5ce6" strokeWidth="1.8"/>
                    <path d="M3 9H21" stroke="#5e5ce6" strokeWidth="1.8"/>
                    <path d="M8 2V6" stroke="#5e5ce6" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16 2V6" stroke="#5e5ce6" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Đặt & quản lý lịch',
                desc: 'Chọn khung giờ phù hợp, gửi yêu cầu đặt phiên. Gia sư xác nhận, hệ thống tự nhắc lịch.',
                accent: '#5e5ce6',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#64d2ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Theo dõi tiến độ',
                desc: 'Đặt mục tiêu học tập, ghi nhận kết quả từng phiên. Biểu đồ trực quan giúp thấy rõ tiến bộ.',
                accent: '#64d2ff',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#bf5af2" strokeWidth="1.8"/>
                    <path d="M8 21H16" stroke="#bf5af2" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 17V21" stroke="#bf5af2" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Học trực tuyến',
                desc: 'Gia sư cập nhật link họp, cả hai bên tham gia phiên học 1-kèm-1 qua nền tảng.',
                accent: '#bf5af2',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff9f0a" strokeWidth="1.8"/>
                    <path d="M14.5 9.5L10 14L9 13" stroke="#ff9f0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Hệ thống tín dụng',
                desc: 'Nạp credit, thanh toán phí tự động. Hoàn tiền khi hủy phiên hợp lệ.',
                accent: '#ff9f0a',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 20V10" stroke="#30d158" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M18 20V4" stroke="#30d158" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M6 20V16" stroke="#30d158" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Đánh giá song phương',
                desc: 'Cả gia sư và học sinh đều đánh giá phiên học. Điểm uy tín tính lại tự động mỗi ngày.',
                accent: '#30d158',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.26 20.56 2.57 20.74C2.88 20.92 3.22 21.01 3.58 21H20.42C20.78 21.01 21.12 20.92 21.43 20.74C21.74 20.56 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.27 3.32 12.96 3.15C12.65 2.98 12.31 2.89 11.96 2.89C11.61 2.89 11.27 2.98 10.96 3.15C10.65 3.32 10.39 3.56 10.29 3.86Z" stroke="#ff3b30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'An toàn & minh bạch',
                desc: 'Khiếu nại, cảnh cáo, tạm khóa vi phạm. Khóa tài khoản khi đăng nhập sai 5 lần.',
                accent: '#ff3b30',
              },
              {
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8C19.6569 9.65685 20 11 20 13C20 15.2091 18.2091 17 16 17" stroke="#ffd60a" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M6 8C4.34315 9.65685 4 11 4 13C4 15.2091 5.79086 17 8 17" stroke="#ffd60a" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 17V22" stroke="#ffd60a" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M8 22H16" stroke="#ffd60a" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Tự động hóa',
                desc: 'Nhắc lịch, tính điểm uy tín, phát hiện hủy muộn. Không cần thao tác thủ công.',
                accent: '#ffd60a',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`feature-card feature-card-${i}`}
                style={{
                  padding: '28px 24px',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  animation: `featureCardIn 0.6s ease-out ${0.05 + i * 0.07}s both`,
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = `${feature.accent}10`;
                  el.style.borderColor = `${feature.accent}50`;
                  const shimmer = el.querySelector('.feature-shimmer') as HTMLElement;
                  if (shimmer) shimmer.style.left = '200%';
                  const iconWrap = el.querySelector('.feature-icon-wrap') as HTMLElement;
                  if (iconWrap) {
                    iconWrap.style.backgroundColor = `${feature.accent}20`;
                    iconWrap.style.borderColor = `${feature.accent}40`;
                    iconWrap.style.transform = 'scale(1.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.backgroundColor = 'rgba(255,255,255,0.025)';
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                  const shimmer = el.querySelector('.feature-shimmer') as HTMLElement;
                  if (shimmer) shimmer.style.left = '-100%';
                  const iconWrap = el.querySelector('.feature-icon-wrap') as HTMLElement;
                  if (iconWrap) {
                    iconWrap.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    iconWrap.style.borderColor = 'rgba(255,255,255,0.10)';
                    iconWrap.style.transform = 'scale(1)';
                  }
                }}
              >
                {/* Top glow line on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }} className="feature-top-line" />

                {/* Shimmer sweep */}
                <div className="feature-shimmer" style={{
                  position: 'absolute',
                  top: 0, left: '-100%',
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  transition: 'left 0s',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />

                {/* Icon */}
                <div
                  className="feature-icon-wrap"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  position: 'relative',
                  zIndex: 2,
                }}>{feature.title}</h3>

                {/* Desc */}
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.50)',
                  margin: 0,
                  lineHeight: 1.55,
                  position: 'relative',
                  zIndex: 2,
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes featureCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top glow line appears on card hover via sibling trick */
        .feature-card:hover .feature-top-line {
          opacity: 1 !important;
        }

        /* Shimmer sweep on hover */
        .feature-card:hover .feature-shimmer {
          left: 200% !important;
          transition: left 0.7s ease-in-out !important;
        }

        /* Responsive: 4 cols → 2 cols → 1 col */
        @media (max-width: 960px) {
          .feature-card { min-height: 180px; }
        }
        @media (max-width: 640px) {
          .feature-card-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 380px) {
          .feature-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* =========================================
          TILE 6: STATS (Parchment)
      ========================================= */}
      <section className="apple-tile-parchment">
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="apple-display-lg" style={{ color: 'var(--apple-ink)', marginBottom: 48 }}>
            Nền tảng đáng tin cậy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {[
              { value: '3', label: 'Vai trò người dùng', sub: 'Student · Tutor · Admin' },
              { value: '10+', label: 'Môn học đa dạng', sub: 'Toán, Lý, Hóa, Anh...' },
              { value: '5', label: 'Trạng thái phiên học', sub: 'Pending → Completed' },
              { value: '3', label: 'Loại khiếu nại', sub: 'Hủy muộn, hành vi, tranh chấp' },
            ].map((stat, i) => (
              <div key={i}>
                <p style={{ fontSize: 56, fontWeight: 700, color: 'var(--apple-primary)', lineHeight: 1, marginBottom: 8, letterSpacing: '-2px' }}>{stat.value}</p>
                <p className="apple-body-strong" style={{ color: 'var(--apple-ink)', marginBottom: 4 }}>{stat.label}</p>
                <p className="apple-caption" style={{ color: 'var(--apple-ink-muted-80)', margin: 0 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TILE 7: SESSION FLOW (Dark 3)
      ========================================= */}
      <section style={{
        backgroundColor: 'var(--apple-surface-tile-3)',
        color: '#fff',
        padding: 'var(--apple-spacing-section) 48px',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--apple-primary-on-dark)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Vòng đời phiên học
          </p>
          <h2 className="apple-display-lg" style={{ color: '#fff', marginBottom: 48 }}>
            Từ đặt lịch đến hoàn thành
          </h2>

          {/* Session Status Flow — exactly 5 equal columns */}
          <div className="session-flow-status" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, marginBottom: 0 }}>
            {[
              { status: 'Pending', desc: 'Chờ gia sư xác nhận', color: '#2997ff' },
              { status: 'Confirmed', desc: 'Đã xác nhận — nhắc lịch tự động', color: '#5e5ce6' },
              { status: 'Completed', desc: 'Hoàn thành — ghi kết quả & đánh giá', color: '#64d2ff' },
              { status: 'Cancelled', desc: 'Hủy bởi gia sư hoặc học sinh', color: '#8e8e93' },
              { status: 'PendingChange', desc: 'Chờ xác nhận thay đổi lịch', color: '#bf5af2' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '0 16px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                {/* Status dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${item.color}66`,
                  }} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: item.color,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  }}>
                    {item.status}
                  </span>
                </div>
                <p className="apple-caption" style={{ color: 'rgba(200,200,205,0.75)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0', marginBottom: 40 }} />

          {/* Session Flow Detail — exactly 4 equal columns */}
          <div className="session-flow-detail" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              {
                step: '01',
                title: 'Đặt phiên',
                desc: 'Học sinh chọn gia sư, môn học, thời gian. Hệ thống kiểm tra lịch trùng và tự động trừ credit.',
                accent: '#0066cc',
              },
              {
                step: '02',
                title: 'Xác nhận',
                desc: 'Gia sư nhận yêu cầu, xác nhận hoặc đề xuất thay đổi thời gian. Phiên được xác nhận khi cả hai đồng ý.',
                accent: '#5e5ce6',
              },
              {
                step: '03',
                title: 'Diễn ra',
                desc: 'Email nhắc lịch gửi trước 1 giờ. Gia sư cập nhật link họp. Phiên diễn ra trực tuyến 1-kèm-1.',
                accent: '#64d2ff',
              },
              {
                step: '04',
                title: 'Hoàn tất',
                desc: 'Gia sư ghi kết quả, cập nhật tiến độ mục tiêu. Cả hai đánh giá. Điểm uy tín gia sư được cập nhật.',
                accent: '#bf5af2',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--apple-rounded-lg)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  animation: `securityCardIn 0.6s ease-out ${i * 0.12}s both`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${item.accent}44`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${item.accent}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Step number */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 16,
                  fontSize: 40,
                  fontWeight: 800,
                  color: `${item.accent}15`,
                  lineHeight: 1,
                  fontFamily: "'SF Pro Display', system-ui, sans-serif",
                  letterSpacing: '-2px',
                  userSelect: 'none',
                }}>
                  {item.step}
                </div>

                {/* Top accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                  borderRadius: '4px 4px 0 0',
                }} />

                {/* Icon placeholder */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${item.accent}18`,
                  border: `1px solid ${item.accent}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  color: item.accent,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'SF Pro Display', system-ui, sans-serif" }}>{item.step}</span>
                </div>

                <h4 style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>{item.title}</h4>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'rgba(200,200,205,0.70)',
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          TILE 8: CTA (Light)
      ========================================= */}
      {!isAuthenticated && (
        <section className="apple-tile-light">
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="apple-display-lg" style={{ color: 'var(--apple-ink)', marginBottom: 20 }}>
              Sẵn sàng bắt đầu hành trình học tập?
            </h2>
            <p className="apple-lead" style={{ color: 'var(--apple-ink-muted-80)', marginBottom: 40 }}>
              Đăng ký miễn phí hôm nay, tìm gia sư phù hợp và bắt đầu phiên học đầu tiên.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register">
                <button className="apple-btn-store-hero">Tạo tài khoản miễn phí</button>
              </Link>
              <Link to="/login">
                <button className="apple-btn-secondary-pill">Đã có tài khoản? Đăng nhập</button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          TILE 9: TRUST & SECURITY (Dark)
          Redesigned with animations & visual effects
      ========================================= */}
      <section
        className="apple-tile-dark"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Background animated gradient orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,204,0.12) 0%, rgba(0,102,204,0) 70%)',
          pointerEvents: 'none',
          animation: 'securityPulse 4s ease-in-out infinite',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            {/* Shield badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(0,102,204,0.3), rgba(41,151,255,0.15))',
              border: '1px solid rgba(0,102,204,0.4)',
              marginBottom: 20,
              animation: 'shieldFloat 3s ease-in-out infinite',
              boxShadow: '0 0 40px rgba(0,102,204,0.2)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                  fill="rgba(0,102,204,0.3)" stroke="#2997ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#2997ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <p style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--apple-primary-on-dark)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              An toàn &amp; bảo mật
            </p>
            <h2 className="apple-display-lg" style={{ color: '#fff', marginBottom: 16 }}>
              Hệ thống bảo vệ quyền lợi cả hai bên
            </h2>
            <p className="apple-lead-airy" style={{ color: 'var(--apple-body-muted)', maxWidth: 520, margin: '0 auto' }}>
              Tài khoản được bảo vệ bằng JWT, khóa tự động khi đăng nhập sai nhiều lần, và cơ chế khiếu nại minh bạch cho mọi vi phạm.
            </p>
          </div>

          {/* Security Cards — 5 columns desktop */}
          <div className="homepage-security-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 40 }}>
            {[
              {
                accent: '#0066cc',
                bgIcon: 'rgba(0,102,204,0.12)',
                bgCard: 'rgba(255,255,255,0.04)',
                border: 'rgba(0,102,204,0.20)',
                badgeBg: 'rgba(0,102,204,0.15)',
                badgeText: '#2997ff',
                titleColor: '#ffffff',
                descColor: 'rgba(200,200,205,0.75)',
                subtitleColor: '#7ab8f5',
                glow: 'rgba(0,102,204,0.15)',
                title: 'Xác thực JWT',
                subtitle: 'Access token 60 phút · Refresh 7 ngày',
                desc: 'Mật khẩu hash BCrypt. Mỗi phiên đăng nhập được mã hóa và xác thực độc lập.',
                badge: 'Mã hóa',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                ),
              },
              {
                accent: '#5e5ce6',
                bgIcon: 'rgba(94,92,230,0.12)',
                bgCard: 'rgba(255,255,255,0.03)',
                border: 'rgba(94,92,230,0.18)',
                badgeBg: 'rgba(94,92,230,0.12)',
                badgeText: '#7a78e8',
                titleColor: '#ffffff',
                descColor: 'rgba(200,200,205,0.75)',
                subtitleColor: '#9895f0',
                glow: 'rgba(94,92,230,0.15)',
                title: 'Khóa tài khoản',
                subtitle: '5 lần sai → khóa tự động',
                desc: 'Admin có thể treo tài khoản vi phạm. User bị khóa không thể đăng nhập cho đến khi được mở lại.',
                badge: 'Bảo vệ',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16 17V15C16 13.34 14.66 12 13 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                accent: '#64d2ff',
                bgIcon: 'rgba(100,210,255,0.10)',
                bgCard: 'rgba(255,255,255,0.04)',
                border: 'rgba(100,210,255,0.15)',
                badgeBg: 'rgba(100,210,255,0.10)',
                badgeText: '#64d2ff',
                titleColor: '#ffffff',
                descColor: 'rgba(200,200,205,0.75)',
                subtitleColor: '#8adfff',
                glow: 'rgba(100,210,255,0.12)',
                title: 'Cơ chế khiếu nại',
                subtitle: 'Phản hồi trong 24 giờ',
                desc: 'Hủy muộn, hành vi không phù hợp, tranh chấp kết quả. Admin xử lý: cảnh cáo, tạm khóa, hoặc đóng khiếu nại.',
                badge: 'Minh bạch',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.26 20.56 2.57 20.74C2.88 20.92 3.22 21.01 3.58 21H20.42C20.78 21.01 21.12 20.92 21.43 20.74C21.74 20.56 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.27 3.32 12.96 3.15C12.65 2.98 12.31 2.89 11.96 2.89C11.61 2.89 11.27 2.98 10.96 3.15C10.65 3.32 10.39 3.56 10.29 3.86Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16.5" r="0.75" fill="currentColor"/>
                  </svg>
                ),
              },
              {
                accent: '#8e8e93',
                bgIcon: 'rgba(142,142,147,0.10)',
                bgCard: 'rgba(255,255,255,0.03)',
                border: 'rgba(142,142,147,0.15)',
                badgeBg: 'rgba(142,142,147,0.10)',
                badgeText: '#98989d',
                titleColor: '#ffffff',
                descColor: 'rgba(200,200,205,0.75)',
                subtitleColor: '#b0b0b5',
                glow: 'rgba(142,142,147,0.10)',
                title: 'Hoàn tiền minh bạch',
                subtitle: 'Credit hoàn tự động khi hủy hợp lệ',
                desc: 'Lịch sử giao dịch: nạp tiền, thanh toán phí, phí hủy muộn, hoàn tiền. Tất cả rõ ràng trong ví Credit.',
                badge: 'Tự động',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                accent: '#bf5af2',
                bgIcon: 'rgba(191,90,242,0.10)',
                bgCard: 'rgba(255,255,255,0.04)',
                border: 'rgba(191,90,242,0.18)',
                badgeBg: 'rgba(191,90,242,0.10)',
                badgeText: '#bf5af2',
                titleColor: '#ffffff',
                descColor: 'rgba(200,200,205,0.75)',
                subtitleColor: '#d08ef5',
                glow: 'rgba(191,90,242,0.12)',
                title: 'Điểm uy tín',
                subtitle: 'Tính lại tự động mỗi 24 giờ',
                desc: 'Điểm gia sư từ đánh giá thực của học sinh trong 90 ngày gần nhất. Công khai và đáng tin cậy.',
                badge: '90 ngày',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="security-card"
                style={{
                  background: item.bgCard,
                  border: `1px solid ${item.border}`,
                  borderRadius: 'var(--apple-rounded-lg)',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  animation: `securityCardIn 0.6s ease-out ${i * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${item.accent}55`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${item.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = item.border;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                  borderRadius: '4px 4px 0 0',
                }} />

                {/* Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 9999,
                  background: item.badgeBg,
                  border: `1px solid ${item.accent}33`,
                  marginBottom: 14,
                  fontSize: 11,
                  fontWeight: 600,
                  color: item.badgeText,
                  letterSpacing: '0.04em',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.badgeText, display: 'inline-block' }} />
                  {item.badge}
                </div>

                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: item.bgIcon,
                    border: `1px solid ${item.accent}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.badgeText,
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: item.titleColor,
                      marginBottom: 2,
                      lineHeight: 1.3,
                    }}>{item.title}</h4>
                    <p style={{
                      fontSize: 11,
                      color: item.subtitleColor,
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 500,
                      margin: 0,
                    }}>{item.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: item.descColor,
                  margin: 0,
                }}>{item.desc}</p>

                {/* Hover shimmer */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                  transition: 'left 0.5s ease',
                  pointerEvents: 'none',
                }} className="shimmer" />
              </div>
            ))}
          </div>

          {/* Security Metrics Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 'var(--apple-rounded-lg)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 0,
          }}>
            {[
              { value: '60 phút', label: 'JWT Access Token', icon: '⏱', color: '#2997ff' },
              { value: '7 ngày', label: 'Refresh Token', icon: '🔑', color: '#a855f7' },
              { value: '5 lần', label: 'Sai → Khóa', icon: '🔒', color: '#ef4444' },
              { value: '24 giờ', label: 'Phản hồi khiếu nại', icon: '⚡', color: '#f59e0b' },
              { value: '90 ngày', label: 'Chu kỳ tính điểm', icon: '📊', color: '#22c55e' },
            ].map((metric, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '8px 16px',
                  borderRight: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <p style={{ fontSize: 28, fontWeight: 700, color: metric.color, marginBottom: 4, letterSpacing: '-0.5px' }}>{metric.value}</p>
                <p className="apple-caption" style={{ color: 'var(--apple-body-muted)', margin: 0 }}>{metric.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p className="apple-lead-airy" style={{ color: 'var(--apple-body-muted)', marginBottom: 20 }}>
              Tham gia cùng hàng nghìn gia sư và học sinh đang học tập an toàn trên TutorMatch.
            </p>
            <Link to="/register">
              <button className="apple-btn-store-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Shine effect */}
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shine 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Đăng ký miễn phí
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          CSS KEYFRAME ANIMATIONS (injected via style tag)
      ========================================= */}
      <style>{`
        @keyframes securityPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.7; }
        }

        @keyframes shieldFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes securityCardIn {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine {
          0% { left: -100%; }
          40% { left: 200%; }
          100% { left: 200%; }
        }

        /* Overview tile entrance */
        @keyframes tileFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Animated mesh blobs on light bg */
        @keyframes meshFloatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(4vw, -3vh) scale(1.05); }
          66%       { transform: translate(-2vw, 2vh) scale(0.97); }
        }
        @keyframes meshFloatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-3vw, 4vh) scale(1.08); }
          70%       { transform: translate(2vw, -2vh) scale(0.96); }
        }
        @keyframes meshFloatC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(2vw, -3vh) scale(1.06); }
        }

        .security-card:hover .shimmer {
          left: 200% !important;
        }

        /* 5-column grid responsive */
        @media (max-width: 1100px) {
          .homepage-security-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 680px) {
          .homepage-security-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 440px) {
          .homepage-security-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Session flow grid responsive */
        @media (max-width: 800px) {
          .session-flow-status {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .session-flow-detail {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .session-flow-status {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .session-flow-detail {
            grid-template-columns: 1fr !important;
          }
        }

        /* Overview tile 2-col responsive */
        @media (max-width: 860px) {
          .overview-2col {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }

        @media (max-width: 500px) {
          .overview-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="apple-footer">
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          {/* Footer Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <p className="apple-caption-strong" style={{ color: 'var(--apple-ink)', marginBottom: 12 }}>Nền tảng</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Tìm gia sư', 'Đặt phiên học', 'Môn học', 'Bảng giá'].map((link, i) => (
                  <a key={i} href="#" className="apple-fine-print">{link}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="apple-caption-strong" style={{ color: 'var(--apple-ink)', marginBottom: 12 }}>Tài khoản</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Đăng nhập', 'Đăng ký', 'Quên mật khẩu', 'Dashboard'].map((link, i) => (
                  <a key={i} href="#" className="apple-fine-print">{link}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="apple-caption-strong" style={{ color: 'var(--apple-ink)', marginBottom: 12 }}>Hỗ trợ</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Trung tâm trợ giúp', 'Liên hệ', 'Câu hỏi thường gặp', 'Báo cáo sự cố'].map((link, i) => (
                  <a key={i} href="#" className="apple-fine-print">{link}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="apple-caption-strong" style={{ color: 'var(--apple-ink)', marginBottom: 12 }}>Pháp lý</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách hoàn tiền', 'Giấy phép'].map((link, i) => (
                  <a key={i} href="#" className="apple-fine-print">{link}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'var(--apple-hairline)', marginBottom: 16 }} />

          {/* Legal Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p className="apple-fine-print" style={{ color: 'var(--apple-ink-muted-48)', margin: 0 }}>
              © {new Date().getFullYear()} TutorMatch. Tất cả quyền được bảo lưu.
            </p>
            <p className="apple-fine-print" style={{ color: 'var(--apple-ink-muted-48)', margin: 0 }}>
              Kiến trúc: Clean Architecture · ASP.NET Core 10 · Entity Framework Core · JWT
            </p>
          </div>

          {/* Tech Stack Note */}
          <p className="apple-fine-print" style={{ color: 'var(--apple-ink-muted-48)', marginTop: 12, marginBottom: 0, fontStyle: 'italic' }}>
            Xây dựng trên nền tảng TutorMatchingPlatform — CQRS + MediatR + FluentValidation + React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
