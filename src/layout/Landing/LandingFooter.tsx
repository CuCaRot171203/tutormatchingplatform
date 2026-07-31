import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const FOOTER_LINKS: Record<string, { label: string; to?: string; href?: string }[]> = {
  'Nền tảng': [
    { label: 'Tìm gia sư', href: '/find-tutor' },
    { label: 'Đặt phiên học', href: '/login' },
    { label: 'Môn học', href: '/subjects' },
    { label: 'Bảng giá', href: '/pricing' },
  ],
  'Hỗ trợ': [
    { label: 'Trung tâm trợ giúp', href: '#' },
    { label: 'Liên hệ', href: '#' },
    { label: 'Câu hỏi thường gặp', href: '#' },
    { label: 'Điều khoản', href: '#' },
  ],
};

const FOOTER_LINKS_2: Record<string, { label: string; to?: string; href?: string }[]> = {
  'Công ty': [
    { label: 'Về chúng tôi', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Tuyển dụng', href: '#' },
    { label: 'Báo chí', href: '#' },
  ],
  'Pháp lý': [
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
    { label: 'Chính sách hoàn tiền', href: '#' },
  ],
};

const SOCIALS = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080b12" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.59a4.85 4.85 0 0 1-1-.22z" />
      </svg>
    ),
  },
];

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const topRef = useScrollReveal(0.1);

  return (
    <footer style={{
      background: '#f5f5f7',
      borderTop: '1px solid rgba(0,0,0,0.07)',
      color: '#6e6e73',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      padding: '0px 40px 32px',
    }}>
      {/* Gradient divider line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(0,98,255,0.3) 30%, rgba(123,97,255,0.3) 70%, transparent)',
        marginBottom: 40,
        borderRadius: 1,
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Row 1: Logo + Links + Social + Contact */}
        <div
          ref={topRef.ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
            gap: 48,
            alignItems: 'start',
            marginBottom: 32,
            opacity: topRef.visible ? 1 : 0,
            transform: topRef.visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 160 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/src/assets/branding/Logo.png" alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              <span style={{
                color: '#1d1d1f', fontSize: 14, fontWeight: 600,
                fontFamily: "'SF Pro Display', system-ui, sans-serif",
              }}>TutorMatch</span>
            </Link>
            <p style={{
              fontSize: 12, color: '#86868b', margin: 0, lineHeight: 1.6,
            }}>
              Nền tảng kết nối Học sinh và Gia sư hàng đầu Việt Nam.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 6 }}>
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30,
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#86868b',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.background = 'rgba(0,98,255,0.08)';
                    a.style.borderColor = 'rgba(0,98,255,0.2)';
                    a.style.color = '#0062FF';
                  }}
                  onMouseLeave={(e) => {
                    const a = e.currentTarget as HTMLAnchorElement;
                    a.style.background = '#ffffff';
                    a.style.borderColor = 'rgba(0,0,0,0.1)';
                    a.style.color = '#86868b';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p style={{
                fontSize: 11, fontWeight: 700,
                color: '#1d1d1f',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                {title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map((link, i) => (
                  typeof link === 'object' && (link.to || link.href) ? (
                    <Link key={i} to={link.to || '#'} style={{
                      fontSize: 13, color: '#6e6e73',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#6e6e73')}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span key={i}>{link.label}</span>
                  )
                ))}
              </div>
            </div>
          ))}

          {Object.entries(FOOTER_LINKS_2).map(([title, links]) => (
            <div key={title}>
              <p style={{
                fontSize: 11, fontWeight: 700,
                color: '#1d1d1f',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                {title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map((link, i) => (
                  <Link key={i} to={link.to || '#'} style={{
                    fontSize: 13, color: '#6e6e73',
                    textDecoration: 'none', transition: 'color 0.15s',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6e6e73')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Legal */}
        <div style={{
          borderTop: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{
            fontSize: 12, color: '#86868b', margin: 0,
          }}>
            © {currentYear} TutorMatch. Tất cả quyền được bảo lưu. · MST: 0123456789
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Chính sách bảo mật', 'Điều khoản sử dụng'].map((item) => (
              <a key={item} href="#" style={{
                fontSize: 12, color: '#86868b',
                textDecoration: 'none', transition: 'color 0.15s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#86868b')}
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
