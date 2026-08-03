import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingHeader, LandingFooter } from '../../layout/Landing';

const PACKAGES = [
  { id: 'starter', name: 'Starter', color: '#86868b', badge: null, description: 'Dành cho học sinh muốn trải nghiệm nền tảng trước khi nạp tiền.', features: [{ text: 'Tìm kiếm gia sư', included: true }, { text: 'Xem hồ sơ & đánh giá', included: true }, { text: '5 Credit khởi đầu', included: true }, { text: 'Đặt phiên học', included: false }, { text: 'Theo dõi tiến độ', included: false }, { text: 'Ưu tiên hỗ trợ', included: false }], cta: 'Bắt đầu miễn phí', creditNote: 'Miễn phí — 5 Credit khởi đầu' },
  { id: 'basic', name: 'Basic', price: 99, color: '#0062FF', badge: 'Phổ biến', badgeColor: '#0062FF', description: 'Gói phù hợp cho học sinh học thường xuyên, 1–2 phiên mỗi tuần.', features: [{ text: 'Tìm kiếm gia sư', included: true }, { text: 'Xem hồ sơ & đánh giá', included: true }, { text: '100 Credit', included: true }, { text: 'Đặt phiên học', included: true }, { text: 'Theo dõi tiến độ', included: true }, { text: 'Ưu tiên hỗ trợ', included: false }], cta: 'Mua Basic', creditNote: '100 Credit · ~50 phiên học', highlight: true },
  { id: 'pro', name: 'Pro', price: 299, color: '#7B61FF', badge: 'Tiết kiệm 22%', badgeColor: '#7B61FF', description: 'Gói cho học sinh nghiêm túc — học 3–5 phiên mỗi tuần với gia sư chất lượng cao.', features: [{ text: 'Tìm kiếm gia sư', included: true }, { text: 'Xem hồ sơ & đánh giá', included: true }, { text: '350 Credit', included: true }, { text: 'Đặt phiên học', included: true }, { text: 'Theo dõi tiến độ', included: true }, { text: 'Ưu tiên hỗ trợ', included: true }], cta: 'Mua Pro', creditNote: '350 Credit · ~175 phiên học', gradient: true },
];

const PRICING_TABLE = [
  { feature: 'Tìm kiếm & lọc gia sư', starter: true, basic: true, pro: true },
  { feature: 'Xem đánh giá & hồ sơ', starter: true, basic: true, pro: true },
  { feature: 'Đặt phiên học trực tuyến', starter: false, basic: true, pro: true },
  { feature: 'Ghi nhận kết quả phiên', starter: false, basic: true, pro: true },
  { feature: 'Biểu đồ tiến độ học tập', starter: false, basic: true, pro: true },
  { feature: 'Hệ thống khiếu nại', starter: false, basic: true, pro: true },
  { feature: 'Nhắc lịch tự động', starter: false, basic: true, pro: true },
  { feature: 'Ưu tiên hỗ trợ', starter: false, basic: false, pro: true },
  { feature: 'Gia sư Top Tier', starter: false, basic: false, pro: true },
];

const FAQS = [
  { q: 'Credit là gì và hoạt động như thế nào?', a: 'Credit là đơn vị tiền tệ trong TutorMatch. Mỗi phiên học có giá từ 2 Credit (60 phút). Credit được trừ khi gia sư xác nhận phiên. Nếu gia sư hủy hoặc bạn hủy đúng hạn (24 giờ trước), Credit sẽ được hoàn lại tự động.' },
  { q: 'Tôi có thể nạp Credit theo cách nào?', a: 'Bạn có thể nạp Credit qua chuyển khoản ngân hàng hoặc ví điện tử (VNPay, MoMo). Yêu cầu nạp tiền sẽ được Admin xác nhận trong vòng 1 giờ làm việc.' },
  { q: 'Chính sách hoàn tiền như thế nào?', a: 'Credit được hoàn 100% nếu phiên bị hủy trước 24 giờ. Nếu hủy trong vòng 24 giờ, phí hủy là 1 Credit. Nếu gia sư không xác nhận trong 48 giờ, phiên bị hủy tự động và Credit được hoàn lại ngay.' },
  { q: 'Giá phí từng môn học có khác nhau không?', a: 'Mỗi gia sư tự đặt giá cho phiên học của mình (từ 2–5 Credit/phiên). Giá phổ biến là 2–3 Credit/phiên 60 phút. Gia sư có điểm uy tín cao hơn thường có giá nhỉnh hơn.' },
  { q: 'Tôi có thể đăng ký làm gia sư không?', a: 'Có. Sau khi đăng ký tài khoản, bạn chọn vai trò Gia sư, điền hồ sơ và bằng cấp. Hồ sơ sẽ được Admin phê duyệt trong vòng 24 giờ. Gia sư nhận Credit từ việc nhận và hoàn thành phiên học.' },
];

const PricingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1d1d1f', fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif" }}>
      <LandingHeader />
      <section style={{ paddingTop: 100, paddingBottom: 64, background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(0,98,255,0.07) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#1d1d1f', marginBottom: 16 }}>Chọn gói phù hợp cho hành trình học tập</h1>
            <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: '#6e6e73', maxWidth: 520, margin: '0 auto 8px' }}>Miễn phí để bắt đầu. Nạp Credit khi cần — hoàn tiền nếu hủy đúng hạn.</p>
            <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>Giá được tính bằng Credit. 1 phiên học 60 phút = từ 2 Credit.</p>
          </motion.div>
        </div>
      </section>
      <section style={{ background: '#f5f5f7', padding: '48px 48px 80px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: pkg.gradient ? 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)' : '#ffffff', border: pkg.highlight ? '2px solid #0062FF' : '1px solid rgba(0,0,0,0.1)', borderRadius: 24, padding: '32px 28px', position: 'relative', transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: pkg.highlight ? '0 16px 48px rgba(0,102,255,0.15)' : 'none' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; if (!pkg.highlight) { el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; } }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; if (!pkg.highlight) el.style.boxShadow = 'none'; }}>
                {pkg.badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: pkg.gradient ? '#ffffff' : pkg.badgeColor, color: pkg.gradient ? pkg.color : '#ffffff', fontSize: 11, fontWeight: 500, padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>{pkg.badge}</div>}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 20, fontWeight: 600, color: pkg.gradient ? '#ffffff' : '#1d1d1f', marginBottom: 4 }}>{pkg.name}</h3>
                  <p style={{ fontSize: 13, color: pkg.gradient ? 'rgba(255,255,255,0.7)' : '#86868b', margin: 0 }}>{pkg.description}</p>
                </div>
                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${pkg.gradient ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.07)'}` }}>
                  <p style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 32, fontWeight: 500, color: pkg.gradient ? '#ffffff' : pkg.color, margin: 0 }}>{pkg.id === 'starter' ? 'Miễn phí' : `${pkg.price}K`}</p>
                  <p style={{ fontSize: 12, color: pkg.gradient ? 'rgba(255,255,255,0.6)' : '#86868b', margin: '4px 0 0' }}>{pkg.creditNote}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {pkg.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: f.included ? (pkg.gradient ? 'rgba(255,255,255,0.25)' : 'rgba(0,98,255,0.1)') : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.included ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke={pkg.gradient ? '#ffffff' : '#0062FF'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                      </div>
                      <span style={{ fontSize: 13, color: f.included ? (pkg.gradient ? 'rgba(255,255,255,0.9)' : '#1d1d1f') : (pkg.gradient ? 'rgba(255,255,255,0.4)' : '#86868b') }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" style={{ textDecoration: 'none', display: 'block' }}>
                  <button style={{ width: '100%', padding: '12px', background: pkg.gradient ? 'rgba(255,255,255,0.2)' : (pkg.highlight ? pkg.color : 'transparent'), color: '#ffffff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "'SF Pro Text', system-ui, sans-serif", cursor: 'pointer', transition: 'all 0.2s ease' }}>{pkg.cta}</button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: '#ffffff', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 8 }}>So sánh tính năng</h2>
            <p style={{ fontSize: 15, color: '#6e6e73' }}>Chi tiết đầy đủ các tính năng giữa các gói dịch vụ</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)' }}><th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1d1d1f', minWidth: 240 }}>Tính năng</th>{PACKAGES.map((pkg) => (<th key={pkg.id} style={{ textAlign: 'center', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: pkg.color }}>{pkg.name}</th>))}</tr></thead>
              <tbody>
                {PRICING_TABLE.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6e6e73' }}>{row.feature}</td>
                    {[row.starter, row.basic, row.pro].map((val, ci) => (
                      <td key={ci} style={{ textAlign: 'center', padding: '14px 16px' }}>{val ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}><polyline points="20 6 9 17 4 12" stroke="#00C48C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', opacity: 0.3 }}><line x1="18" y1="6" x2="6" y2="18" stroke="#86868b" strokeWidth="2.5" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="#86868b" strokeWidth="2.5" strokeLinecap="round"/></svg>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section style={{ background: '#f5f5f7', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}><h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 8 }}>Câu hỏi thường gặp</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: 16, border: openFaq === i ? '1px solid rgba(0,102,255,0.2)' : '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', transition: 'border-color 0.2s ease' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '18px 20px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', color: '#86868b' }}><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {openFaq === i && <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(0,0,0,0.05)' }}><p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.65, margin: 0, paddingTop: 14 }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: '#ffffff', padding: '80px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 12 }}>Bắt đầu học hôm nay</h2>
          <p style={{ fontSize: 16, color: '#6e6e73', lineHeight: 1.6, marginBottom: 28 }}>Đăng ký miễn phí, nhận 5 Credit và trải nghiệm nền tảng ngay lập tức.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button className="apple-btn-store-hero">Đăng ký miễn phí</button></Link>
            <Link to="/find-tutor"><button className="apple-btn-secondary-pill">Tìm gia sư</button></Link>
          </div>
        </div>
      </section>
      <LandingFooter />
      <style>{`@media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } } @media (max-width: 480px) { section { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </div>
  );
};

export default PricingPage;
