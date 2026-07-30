import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── SVG Icons ── */
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const ZaloIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#0068FF" />
    <path d="M24 10c-7.732 0-14 4.477-14 10 0 3.17 1.88 6.003 4.72 7.92l-1.44 5.08h2.72l1.68-5.28c1.28.28 2.63.44 4 .44 7.732 0 14-4.477 14-10S31.732 10 24 10z" fill="#fff" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#080b12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.59a4.85 4.85 0 0 1-1-.22z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const FOOTER_LINKS = {
  'Nền tảng': ['Tìm gia sư', 'Đặt phiên học', 'Môn học', 'Bảng giá'],
  'Tài khoản': [
    { label: 'Đăng nhập', to: '/login' },
    { label: 'Đăng ký', to: '/register' },
    { label: 'Quên mật khẩu', to: '/forgot-password' },
    { label: 'Dashboard', to: '/' },
  ],
  'Hỗ trợ': ['Trung tâm trợ giúp', 'Liên hệ', 'Câu hỏi thường gặp', 'Báo cáo sự cố'],
  'Pháp lý': ['Điều khoản sử dụng', 'Chính sách bảo mật', 'Chính sách hoàn tiền', 'Giấy phép'],
};

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'ATM / Internet Banking', 'VNPay', 'ZaloPay', 'Momo', 'ViettelPay'];

const PARTNERS = ['FPT University', 'FPT Software', 'FPT Education', 'FPT Smart Cloud', 'FPT Play', 'MISA', 'VietinBank', 'VNPay'];

const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#080b12',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      paddingTop: 64,
    }}>
      {/* ── Gradient Wave Separator ── */}
      <div style={{
        position: 'relative',
        height: 3,
        overflow: 'hidden',
        marginBottom: 0,
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, #0062FF 30%, #7B61FF 60%, transparent 100%)',
          opacity: 0.6,
        }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px 32px' }}>

        {/* ── Top: Newsletter + Company Info ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }}>
          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 6,
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
            }}>
              Đăng ký nhận tin
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
              Nhận ưu đãi, tin tức giáo dục và cập nhật từ TutorMatch mỗi tuần.
            </p>
            {subscribed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'rgba(0, 200, 83, 0.1)',
                border: '1px solid rgba(0, 200, 83, 0.25)',
                borderRadius: 10,
                fontSize: 13,
                color: '#00c853',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Cảm ơn bạn! Tin tức sẽ được gửi đến email của bạn.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0, 98, 255, 0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '9px 18px',
                    background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <SendIcon />
                  Đăng ký
                </button>
              </form>
            )}
          </div>

          {/* Company Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 98, 255, 0.35)',
              }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em' }}>TM</span>
              </div>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>TutorMatch</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 16 }}>
              Nền tảng kết nối gia sư và học viên hàng đầu Việt Nam.<br />
              Học mọi lúc, mọi nơi với gia sư chất lượng cao.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: ZaloIcon, href: '#', label: 'Zalo' },
                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
                { Icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
                { Icon: TikTokIcon, href: '#', label: 'TikTok' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 98, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 98, 255, 0.3)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Middle: Link Columns ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          padding: '32px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 32,
        }}>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}>
                {title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map((link, i) => (
                  typeof link === 'string' ? (
                    <a
                      key={i}
                      href="#"
                      style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link}
                    </a>
                  ) : (
                    <Link
                      key={i}
                      to={link.to}
                      style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Contact Info Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {[
            {
              Icon: MapPinIcon,
              label: 'Địa chỉ',
              lines: [
                'Tầng 15, Tòa nhà Lotte Center Hà Nội',
                '54 Liễu Giai, Ba Đình, Hà Nội, Việt Nam',
              ],
            },
            {
              Icon: PhoneIcon,
              label: 'Tổng đài',
              lines: ['(024) 7300 8888', 'Hotline: 0904 123 456'],
            },
            {
              Icon: MailIcon,
              label: 'Liên hệ',
              lines: ['support@tutormatch.vn', 'business@tutormatch.vn'],
            },
            {
              Icon: ClockIcon,
              label: 'Giờ làm việc',
              lines: ['Thứ 2 – Thứ 6: 08:00 – 18:00', 'Thứ 7: 08:00 – 12:00'],
            },
          ].map(({ Icon, label, lines }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                gap: 12,
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(0,98,255,0.15) 0%, rgba(123,97,255,0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0062FF',
                flexShrink: 0,
              }}>
                <Icon />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>
                  {label}
                </p>
                {lines.map((line, i) => (
                  <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Payment Methods ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 10,
          }}>
            Phương thức thanh toán
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method}
                style={{
                  padding: '5px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.01em',
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* ── Partners ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 10,
          }}>
            Đối tác & Các bên liên quan
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                style={{
                  padding: '5px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)',
          marginBottom: 20,
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>
              © {currentYear} TutorMatch. Tất cả quyền được bảo lưu. · Mã số thuế: 0123456789
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0, fontStyle: 'italic' }}>
              TutorMatchingPlatform — Clean Architecture · ASP.NET Core 10 · EF Core · JWT · CQRS + MediatR
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {['Điều khoản sử dụng', 'Chính sách bảo mật'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
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
