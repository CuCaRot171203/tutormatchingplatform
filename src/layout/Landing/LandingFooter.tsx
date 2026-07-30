import React from 'react';
import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const ZaloIcon = () => (
  <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#0068FF" />
    <path d="M24 10c-7.732 0-14 4.477-14 10 0 3.17 1.88 6.003 4.72 7.92l-1.44 5.08h2.72l1.68-5.28c1.28.28 2.63.44 4 .44 7.732 0 14-4.477 14-10S31.732 10 24 10z" fill="#fff" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080b12" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.59a4.85 4.85 0 0 1-1-.22z" />
  </svg>
);

const FOOTER_LINKS: Record<string, (string | { label: string; to: string })[]> = {
  'Nền tảng': ['Tìm gia sư', 'Đặt phiên học', 'Môn học', 'Bảng giá'],
  'Hỗ trợ': ['Trung tâm trợ giúp', 'Liên hệ', 'Câu hỏi thường gặp', 'Điều khoản'],
};

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#080b12',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.6)',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      padding: '32px 40px',
    }}>
      {/* Gradient line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #0062FF 40%, #7B61FF 60%, transparent)',
        opacity: 0.5,
        marginBottom: 32,
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Row 1: Logo + Links + Social ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 32,
          marginBottom: 24,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '-0.02em' }}>TM</span>
            </div>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>TutorMatch</span>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <p style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  {title}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {links.map((link, i) => (
                    typeof link === 'string' ? (
                      <a key={i} href="#" style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.4)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                      >
                        {link}
                      </a>
                    ) : (
                      <Link key={i} to={link.to} style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.4)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social + Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: ZaloIcon, href: '#', label: 'Zalo' },
                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
                { Icon: TikTokIcon, href: '#', label: 'TikTok' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,98,255,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0,98,255,0.3)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              Tầng 15, Lotte Center Hà Nội · 54 Liễu Giai, Ba Đình, Hà Nội
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              (024) 7300 8888 · support@tutormatch.vn
            </p>
          </div>
        </div>

        {/* ── Row 2: Legal ── */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          marginBottom: 16,
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {currentYear} TutorMatch. Tất cả quyền được bảo lưu. · MST: 0123456789
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Chính sách bảo mật', 'Điều khoản sử dụng'].map((item) => (
              <a key={item} href="#" style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
