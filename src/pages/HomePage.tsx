import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores';
import { LandingHeader, LandingFooter } from '../layout/Landing';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (user?.role === 'Student') navigate('/student/dashboard');
    else if (user?.role === 'Tutor') navigate('/tutor/dashboard');
    else if (user?.role === 'Administrator') navigate('/admin/dashboard');
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#1d1d1f',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, 'Segoe UI', sans-serif",
    }}>

      <LandingHeader />

      {/* =========================================
          HERO TILE — full-width banner layout
          Clean white with gradient accent
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {/* ── Subtle gradient orbs (left side) ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', gridColumn: '1' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,98,255,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 80% 20%, rgba(123,97,255,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 30% 30% at 60% 80%, rgba(0,98,255,0.04) 0%, transparent 60%)
            `,
          }} />
          {/* Fine dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.5,
          }} />
        </div>

        {/* ── Left: Text Content ── */}
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
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(38px, 5vw, 62px)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#1d1d1f',
            marginBottom: 20,
          }}>
            Kết nối gia sư<br />&amp; học sinh
          </h1>

          <p style={{
            fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.65,
            color: '#6e6e73',
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
            borderTop: '1px solid rgba(0,0,0,0.08)',
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
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1,
                }}>{stat.value}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#86868b',
                  margin: '6px 0 0',
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
            background: 'linear-gradient(to right, rgba(255,255,255,0.50) 0%, transparent 30%, transparent 60%, rgba(255,255,255,0.15) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Gradient overlay — bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(255,255,255,0.70) 0%, transparent 100%)',
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
              <div key={i} className={`hero-banner-dot-${i}`} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', cursor: 'pointer' }} />
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
            color: 'rgba(0,0,0,0.3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
          }}>Cuộn xuống</p>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)', animation: 'scrollLine 2s ease-in-out infinite' }} />
        </div>
      </motion.section>

      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1; transform: scaleY(1.3); }
        }
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
        .hero-banner-dot-0 { animation: bannerDot0 20s ease-in-out infinite; }
        .hero-banner-dot-1 { animation: bannerDot1 20s ease-in-out infinite; }
        .hero-banner-dot-2 { animation: bannerDot2 20s ease-in-out infinite; }
        .hero-banner-dot-3 { animation: bannerDot3 20s ease-in-out infinite; }
        @keyframes bannerDot0 {
          0%, 20%  { background: rgba(0,98,255,0.9) !important; transform: scale(1.5); }
          30%, 100%{ background: rgba(0,0,0,0.2) !important; transform: scale(1); }
        }
        @keyframes bannerDot1 {
          0%, 20%  { background: rgba(0,0,0,0.2) !important; transform: scale(1); }
          30%, 50% { background: rgba(0,98,255,0.9) !important; transform: scale(1.5); }
          60%, 100%{ background: rgba(0,0,0,0.2) !important; transform: scale(1); }
        }
        @keyframes bannerDot2 {
          0%, 50%  { background: rgba(0,0,0,0.2) !important; transform: scale(1); }
          60%, 80% { background: rgba(0,98,255,0.9) !important; transform: scale(1.5); }
          90%, 100%{ background: rgba(0,0,0,0.2) !important; transform: scale(1); }
        }
        @keyframes bannerDot3 {
          0%, 80%  { background: rgba(0,0,0,0.2) !important; transform: scale(1); }
          90%, 100%{ background: rgba(0,98,255,0.9) !important; transform: scale(1.5); }
        }
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
          TILE 2: PLATFORM OVERVIEW — white bg
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#ffffff',
          padding: '96px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient accent */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(0,98,255,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

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
              fontSize: 'clamp(26px, 3.5vw, 42px)',
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
              color: '#6e6e73',
              maxWidth: 420,
            }}>
              TutorMatch kết nối bạn với gia sư được phê duyệt, giúp bạn đặt lịch, theo dõi tiến độ và đánh giá chất lượng — tất cả trong một hệ thống duy nhất.
            </p>
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
                step: '01', title: 'Tìm kiếm thông minh',
                desc: 'Lọc gia sư theo môn học, lịch rảnh, điểm uy tín',
                accent: '#0062FF',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: '02', title: 'Đặt lịch linh hoạt',
                desc: 'Chọn thời gian phù hợp, gia sư xác nhận tức thì',
                accent: '#0062FF',
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
                step: '03', title: 'Theo dõi tiến độ',
                desc: 'Đặt mục tiêu, ghi kết quả, biểu đồ trực quan',
                accent: '#0062FF',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: '04', title: 'Hệ thống tín dụng',
                desc: 'Nạp credit, thanh toán phí, hoàn tiền minh bạch',
                accent: '#0062FF',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                step: '05', title: 'Đánh giá song phương',
                desc: 'Cả gia sư và học sinh đều có thể đánh giá',
                accent: '#0062FF',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                step: '06', title: 'Khiếu nại & xử lý',
                desc: 'Cơ chế phản hồi, cảnh cáo và tạm khóa vi phạm',
                accent: '#0062FF',
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
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 16,
                  padding: '18px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                  el.style.borderColor = 'rgba(0,0,0,0.07)';
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: ` transparent`,
                  borderRadius: '16px 16px 0 0',
                }} />
                {/* Icon */}
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: `${item.accent}12`,
                  border: `1px solid ${item.accent}22`,
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
                  color: '#6e6e73',
                  margin: 0,
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 3: HOW IT WORKS (Light section)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#f5f5f7',
          padding: '80px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 8,
            }}>
              Cách thức hoạt động
            </h2>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 16,
              color: '#6e6e73',
              margin: 0,
            }}>
              Chỉ 5 bước đơn giản để bắt đầu hành trình học tập
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
          }}>
            {[
              { step: '01', title: 'Đăng ký & chọn vai trò', desc: 'Đăng ký với vai trò Học sinh hoặc Gia sư. Hồ sơ gia sư cần Admin phê duyệt trước khi nhận học sinh.', accent: '#0062FF' },
              { step: '02', title: 'Tìm & kết nối', desc: 'Học sinh tìm gia sư theo môn học, lịch rảnh và điểm uy tín. Gửi yêu cầu đặt phiên học.', accent: '#0062FF' },
              { step: '03', title: 'Xác nhận phiên học', desc: 'Gia sư xác nhận yêu cầu. Phiên học được xác nhận, cả hai bên nhận email nhắc lịch tự động.', accent: '#0062FF' },
              { step: '04', title: 'Học & ghi nhận kết quả', desc: 'Phiên diễn ra qua link họp trực tuyến. Gia sư ghi nhận kết quả, tiến độ mục tiêu được cập nhật.', accent: '#0062FF' },
              { step: '05', title: 'Đánh giá & tính điểm', desc: 'Cả hai đánh giá phiên học. Điểm uy tín gia sư được tính lại tự động mỗi 24 giờ.', accent: '#0062FF' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '24px 20px',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.08)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: `${item.accent}18`,
                  marginBottom: 12,
                  lineHeight: 1,
                  letterSpacing: '-2px',
                }}>{item.step}</p>
                <h3 style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1d1d1f',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#6e6e73',
                  margin: 0,
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 4: USER ROLES (White)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 48px',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 8,
            }}>
              Ba vai trò, một hệ thống liền mạch
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Student */}
            <div style={{
              backgroundColor: '#f5f5f7',
              borderRadius: 20,
              padding: '32px',
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <h3 style={{
                fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                fontSize: 22, fontWeight: 700,
                color: '#1d1d1f',
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}>Học sinh</h3>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                fontSize: 14, fontWeight: 400,
                color: '#6e6e73',
                marginBottom: 20,
                lineHeight: 1.6,
              }}>
                Tìm gia sư phù hợp, đặt phiên học, theo dõi mục tiêu và đánh giá chất lượng giảng dạy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Tìm kiếm gia sư theo môn & lịch', 'Đặt & quản lý phiên học', 'Nạp & quản lý Credit', 'Đặt mục tiêu học tập', 'Xem biểu đồ tiến độ', 'Đánh giá gia sư'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0062FF, #7B61FF)',
                      flexShrink: 0,
                      boxShadow: '0 0 4px rgba(0,98,255,0.3)',
                    }} />
                    <span style={{
                      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                      fontSize: 13, color: '#1d1d1f',
                    }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor */}
            <div style={{
              background: 'rgb(13, 106, 255) 0%',
              borderRadius: 20,
              padding: '32px',
              color: '#fff',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(0,98,255,0.25)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <h3 style={{
                fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                fontSize: 22, fontWeight: 700,
                color: '#fff',
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}>Gia sư</h3>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                fontSize: 14, fontWeight: 400,
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 20,
                lineHeight: 1.6,
              }}>
                Cập nhật hồ sơ, quản lý lịch rảnh, xác nhận phiên học và ghi nhận kết quả học tập cho học sinh.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Cập nhật bio & bằng cấp', 'Quản lý lịch rảnh hàng tuần', 'Xác nhận / từ chối phiên học', 'Ghi nhận kết quả phiên', 'Đặt mục tiêu cho học sinh', 'Đánh giá học sinh'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.8)',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                      fontSize: 13, color: 'rgba(255,255,255,0.9)',
                    }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin */}
            <div style={{
              backgroundColor: '#f5f5f7',
              borderRadius: 20,
              padding: '32px',
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <h3 style={{
                fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                fontSize: 22, fontWeight: 700,
                color: '#1d1d1f',
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}>Quản trị</h3>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                fontSize: 14, fontWeight: 400,
                color: '#6e6e73',
                marginBottom: 20,
                lineHeight: 1.6,
              }}>
                Phê duyệt hồ sơ gia sư, quản lý tín dụng, xử lý khiếu nại và theo dõi thống kê hệ thống.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Duyệt / từ chối hồ sơ gia sư', 'Duyệt yêu cầu nạp credit', 'Xử lý khiếu nại vi phạm', 'Dashboard thống kê', 'Quản lý môn học', 'Cảnh cáo / tạm khóa tài khoản'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0062FF, #7B61FF)',
                      flexShrink: 0,
                      boxShadow: '0 0 4px rgba(0,98,255,0.3)',
                    }} />
                    <span style={{
                      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                      fontSize: 13, color: '#1d1d1f',
                    }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 5: FEATURES — 2 rows × 4 cols (white bg)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#f5f5f7',
          padding: '80px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 12,
            }}>
              Tất cả những gì bạn cần<br />để học tập hiệu quả
            </h2>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 16,
              color: '#6e6e73',
              margin: 0,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Một hệ sinh thái hoàn chỉnh được thiết kế cho cả học sinh, gia sư và quản trị viên.
            </p>
          </div>

          {/* 2 rows × 4 cols */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
          className="feature-card-grid"
          >
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#0062FF" strokeWidth="1.8"/><path d="M21 21L16.65 16.65" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round"/></svg>, title: 'Tìm kiếm thông minh', desc: 'Lọc gia sư theo môn học, lịch rảnh và điểm uy tín. Tìm kiếm nhanh chóng, chính xác.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#0062FF" strokeWidth="1.8"/><path d="M3 9H21M8 2V6M16 2V6" stroke="#7B61FF" strokeWidth="1.8" strokeLinecap="round"/></svg>, title: 'Đặt & quản lý lịch', desc: 'Chọn khung giờ phù hợp, gửi yêu cầu đặt phiên. Gia sư xác nhận, hệ thống tự nhắc lịch.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Theo dõi tiến độ', desc: 'Đặt mục tiêu học tập, ghi nhận kết quả từng phiên. Biểu đồ trực quan giúp thấy rõ tiến bộ.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#0062FF" strokeWidth="1.8"/><path d="M8 21H16M12 17V21" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round"/></svg>, title: 'Học trực tuyến', desc: 'Gia sư cập nhật link họp, cả hai bên tham gia phiên học 1-kèm-1 qua nền tảng.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0062FF" strokeWidth="1.8"/><path d="M14.5 9.5L10 14L9 13" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Hệ thống tín dụng', desc: 'Nạp credit, thanh toán phí tự động. Hoàn tiền khi hủy phiên hợp lệ.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20V14" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round"/></svg>, title: 'Đánh giá song phương', desc: 'Cả gia sư và học sinh đều đánh giá phiên học. Điểm uy tín tính lại tự động mỗi ngày.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.26 20.56 2.57 20.74C2.88 20.92 3.22 21.01 3.58 21H20.42C20.78 21.01 21.12 20.92 21.43 20.74C21.74 20.56 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.27 3.32 12.96 3.15C12.65 2.98 12.31 2.89 11.96 2.89C11.61 2.89 11.27 2.98 10.96 3.15C10.65 3.32 10.39 3.56 10.29 3.86Z" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'An toàn & minh bạch', desc: 'Khiếu nại, cảnh cáo, tạm khóa vi phạm. Khóa tài khoản khi đăng nhập sai 5 lần.', accent: '#0062FF' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#0062FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Tự động hóa', desc: 'Nhắc lịch, tính điểm uy tín, phát hiện hủy muộn. Không cần thao tác thủ công.', accent: '#0062FF' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.07)',
                  borderRadius: 16,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  animation: `featureCardIn 0.6s ease-out ${0.05 + i * 0.07}s both`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.08), 0 0 0 1px ${feature.accent}33`;
                  el.style.borderColor = `${feature.accent}55`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                  el.style.borderColor = 'rgba(0,0,0,0.07)';
                }}
              >
                
                {/* Icon */}
                <div style={{
                  width: 42, height: 42,
                  borderRadius: 11,
                  backgroundColor: `${feature.accent}12`,
                  border: `1px solid ${feature.accent}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  transition: 'transform 0.3s ease',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1d1d1f',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>{feature.title}</h3>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: '#6e6e73',
                  margin: 0,
                  lineHeight: 1.55,
                }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 6: STATS (white)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 48px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(26px, 3.5vw, 42px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#1d1d1f',
            marginBottom: 48,
          }}>
            Nền tảng đáng tin cậy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {[
              { value: '3', label: 'Vai trò người dùng', sub: 'Student · Tutor · Admin', accent: '#0062FF' },
              { value: '10+', label: 'Môn học đa dạng', sub: 'Toán, Lý, Hóa, Anh...', accent: '#0062FF' },
              { value: '5', label: 'Trạng thái phiên học', sub: 'Pending → Completed', accent: '#0062FF' },
              { value: '3', label: 'Loại khiếu nại', sub: 'Hủy muộn, hành vi, tranh chấp', accent: '#0062FF' },
            ].map((stat, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 52,
                  fontWeight: 400,
                  background: `linear-gradient(135deg, ${stat.accent}, ${stat.accent}aa)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: 8,
                  letterSpacing: '-2px',
                }}>{stat.value}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: '#1d1d1f',
                  marginBottom: 4,
                }}>{stat.label}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12, fontWeight: 400,
                  color: '#6e6e73',
                  margin: 0,
                }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 7: SESSION FLOW (light)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#f5f5f7',
          padding: '80px 48px',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 8,
            }}>
              Từ đặt lịch đến hoàn thành
            </h2>
          </div>

          {/* Session Status Flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 0,
            marginBottom: 40,
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.07)',
            overflow: 'hidden',
          }} className="session-flow-status">
            {[
              { status: 'Pending', desc: 'Chờ gia sư xác nhận', color: '#0062FF' },
              { status: 'Confirmed', desc: 'Đã xác nhận — nhắc lịch tự động', color: '#7B61FF' },
              { status: 'Completed', desc: 'Hoàn thành — ghi kết quả & đánh giá', color: '#00C48C' },
              { status: 'Cancelled', desc: 'Hủy bởi gia sư hoặc học sinh', color: '#86868b' },
              { status: 'PendingChange', desc: 'Chờ xác nhận thay đổi lịch', color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '20px 16px',
                borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${item.color}66`,
                  }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: item.color,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  }}>{item.status}</span>
                </div>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12, fontWeight: 400,
                  color: '#6e6e73',
                  margin: 0,
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Session Flow Detail */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }} className="session-flow-detail">
            {[
              { step: '01', title: 'Đặt phiên', desc: 'Học sinh chọn gia sư, môn học, thời gian. Hệ thống kiểm tra lịch trùng và tự động trừ credit.', accent: '#0062FF' },
              { step: '02', title: 'Xác nhận', desc: 'Gia sư nhận yêu cầu, xác nhận hoặc đề xuất thay đổi thời gian. Phiên được xác nhận khi cả hai đồng ý.', accent: '#0062FF' },
              { step: '03', title: 'Diễn ra', desc: 'Email nhắc lịch gửi trước 1 giờ. Gia sư cập nhật link họp. Phiên diễn ra trực tuyến 1-kèm-1.', accent: '#0062FF' },
              { step: '04', title: 'Hoàn tất', desc: 'Gia sư ghi kết quả, cập nhật tiến độ mục tiêu. Cả hai đánh giá. Điểm uy tín gia sư được cập nhật.', accent: '#0062FF' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: 16,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                animation: `securityCardIn 0.6s ease-out ${i * 0.12}s both`,
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.08)`;
                  el.style.borderColor = `${item.accent}44`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                  el.style.borderColor = 'rgba(0,0,0,0.07)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${item.accent}12`,
                  border: `1px solid ${item.accent}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                  color: item.accent,
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 400,
                    fontFamily: "'SF Pro Display', system-ui, sans-serif",
                    color: item.accent,
                  }}>{item.step}</span>
                </div>
                <h4 style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: '#1d1d1f',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>{item.title}</h4>
                </div>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12, fontWeight: 400,
                  lineHeight: 1.5,
                  color: '#6e6e73',
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          TILE 8: CTA (white)
      ========================================= */}
      {!isAuthenticated && (
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundColor: '#ffffff',
            padding: '96px 48px',
            textAlign: 'center',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 16,
            }}>
              Sẵn sàng bắt đầu<br />hành trình học tập?
            </h2>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 17, fontWeight: 400,
              color: '#6e6e73',
              lineHeight: 1.65,
              marginBottom: 36,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
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
        </motion.section>
      )}

      {/* =========================================
          TILE 9: TRUST & SECURITY (white with blue border)
      ========================================= */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 48px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background orb */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,98,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#1d1d1f',
              marginBottom: 12,
            }}>
              Hệ thống bảo vệ quyền lợi cả hai bên
            </h2>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 17, fontWeight: 400,
              color: '#6e6e73',
              lineHeight: 1.6,
              maxWidth: 520,
              margin: '0 auto',
            }}>
              Tài khoản được bảo vệ bằng JWT, khóa tự động khi đăng nhập sai nhiều lần, và cơ chế khiếu nại minh bạch cho mọi vi phạm.
            </p>
          </div>

          {/* Security Cards — 5 columns desktop */}
          <div className="homepage-security-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12,
            marginBottom: 32,
          }}>
            {[
              { accent: '#0062FF', bgCard: '#ffffff', border: 'rgba(0,98,255,0.12)', badgeBg: 'rgba(0,98,255,0.08)', badgeText: '#0062FF', titleColor: '#1d1d1f', descColor: '#6e6e73', subtitleColor: '#0062FF', title: 'Xác thực JWT', subtitle: 'Access 60 phút · Refresh 7 ngày', desc: 'Mật khẩu hash BCrypt. Mỗi phiên đăng nhập được mã hóa và xác thực độc lập.', badge: 'Mã hóa',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg> },
              { accent: '#0062FF', bgCard: '#ffffff', border: 'rgba(123,97,255,0.12)', badgeBg: 'rgba(123,97,255,0.08)', badgeText: '#0062FF', titleColor: '#1d1d1f', descColor: '#6e6e73', subtitleColor: '#0062FF', title: 'Khóa tài khoản', subtitle: '5 lần sai → khóa tự động', desc: 'Admin có thể treo tài khoản vi phạm. User bị khóa không thể đăng nhập cho đến khi được mở lại.', badge: 'Bảo vệ',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 17V15C16 13.34 14.66 12 13 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
              { accent: '#0062FF', bgCard: '#ffffff', border: 'rgba(0,196,140,0.12)', badgeBg: 'rgba(0,196,140,0.08)', badgeText: '#0062FF', titleColor: '#1d1d1f', descColor: '#6e6e73', subtitleColor: '#0062FF', title: 'Cơ chế khiếu nại', subtitle: 'Phản hồi trong 24 giờ', desc: 'Hủy muộn, hành vi không phù hợp, tranh chấp kết quả. Admin xử lý: cảnh cáo, tạm khóa, hoặc đóng khiếu nại.', badge: 'Minh bạch',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.35 1.64 19.69 1.82 20C2 20.3 2.26 20.56 2.57 20.74C2.88 20.92 3.22 21.01 3.58 21H20.42C20.78 21.01 21.12 20.92 21.43 20.74C21.74 20.56 22 20.3 22.18 20C22.36 19.69 22.45 19.35 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.27 3.32 12.96 3.15C12.65 2.98 12.31 2.89 11.96 2.89C11.61 2.89 11.27 2.98 10.96 3.15C10.65 3.32 10.39 3.56 10.29 3.86Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9V13M12 16.5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
              { accent: '#0062FF', bgCard: '#ffffff', border: 'rgba(245,158,11,0.12)', badgeBg: 'rgba(245,158,11,0.08)', badgeText: '#0062FF', titleColor: '#1d1d1f', descColor: '#6e6e73', subtitleColor: '#0062FF', title: 'Hoàn tiền minh bạch', subtitle: 'Credit hoàn tự động khi hủy hợp lệ', desc: 'Lịch sử giao dịch: nạp tiền, thanh toán phí, phí hủy muộn, hoàn tiền. Tất cả rõ ràng trong ví Credit.', badge: 'Tự động',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { accent: '#0062FF', bgCard: '#ffffff', border: 'rgba(139,92,246,0.12)', badgeBg: 'rgba(139,92,246,0.08)', badgeText: '#0062FF', titleColor: '#1d1d1f', descColor: '#6e6e73', subtitleColor: '#0062FF', title: 'Điểm uy tín', subtitle: 'Tính lại tự động mỗi 24 giờ', desc: 'Điểm gia sư từ đánh giá thực của học sinh trong 90 ngày gần nhất. Công khai và đáng tin cậy.', badge: '90 ngày',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: item.bgCard,
                  border: `1px solid ${item.border}`,
                  borderRadius: 16,
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  animation: `securityCardIn 0.6s ease-out ${i * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.borderColor = `${item.accent}44`;
                  el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.08)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = item.border;
                  el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div>
                    <h4 style={{
                      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                      fontSize: 14, fontWeight: 600,
                      color: item.titleColor,
                      marginBottom: 2, lineHeight: 1.3,
                    }}>{item.title}</h4>
                    <p style={{
                      fontSize: 11, fontWeight: 500,
                      color: item.subtitleColor,
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      margin: 0,
                    }}>{item.subtitle}</p>
                  </div>
                </div>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 12, fontWeight: 400,
                  lineHeight: 1.5,
                  color: item.descColor,
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Security Metrics Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '20px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {[
              { value: '60 phút', label: 'JWT Access Token', color: '#0062FF' },
              { value: '7 ngày', label: 'Refresh Token', color: '#0062FF' },
              { value: '5 lần', label: 'Sai → Khóa', color: '#0062FF' },
              { value: '24 giờ', label: 'Phản hồi khiếu nại', color: '#0062FF' },
              { value: '90 ngày', label: 'Chu kỳ tính điểm', color: '#0062FF' },
            ].map((metric, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '8px 12px',
                  borderRight: i < 4 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 24, fontWeight: 400,
                  color: metric.color,
                  marginBottom: 4,
                  letterSpacing: '-0.5px',
                }}>{metric.value}</p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 11, fontWeight: 400,
                  color: '#6e6e73',
                  margin: 0,
                }}>{metric.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
              fontSize: 17, fontWeight: 400,
              color: '#6e6e73',
              lineHeight: 1.6,
              marginBottom: 20,
              maxWidth: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Tham gia cùng hàng nghìn gia sư và học sinh đang học tập an toàn trên TutorMatch.
            </p>
            <Link to="/register">
              <button className="apple-btn-store-hero" style={{
                position: 'relative',
                overflow: 'hidden',
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0, left: '-100%',
                  width: '50%', height: '100%',
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
      </motion.section>

      {/* =========================================
          CSS KEYFRAME ANIMATIONS
      ========================================= */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes tileFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes featureCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
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

        /* 5-column grid responsive */
        @media (max-width: 1100px) {
          .homepage-security-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 680px) {
          .homepage-security-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 440px) {
          .homepage-security-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 800px) {
          .session-flow-status { grid-template-columns: repeat(3, 1fr) !important; }
          .session-flow-detail { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .session-flow-status { grid-template-columns: repeat(2, 1fr) !important; }
          .session-flow-detail { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .overview-2col { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 500px) {
          .overview-card-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .feature-card-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 380px) {
          .feature-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default HomePage;
