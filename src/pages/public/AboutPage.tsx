import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingHeader, LandingFooter } from '../../layout/Landing';

const TIMELINE = [
  { year: '2022', title: 'Khởi đầu', desc: 'TutorMatch được thành lập với sứ mệnh kết nối học sinh với gia sư chất lượng cao tại Việt Nam.' },
  { year: '2023', title: 'Mở rộng', desc: 'Đạt 1.000 gia sư được phê duyệt, 5.000 phiên học hoàn thành và mở rộng sang 6 tỉnh thành.' },
  { year: '2024', title: 'Nâng cấp', desc: 'Ra mắt hệ thống điểm uy tín tự động, cải tiến giao diện và tích hợp thanh toán trực tuyến.' },
  { year: '2025', title: 'Phát triển', desc: 'Đạt 2.400+ gia sư, 15.000 phiên học, 8 môn học đa dạng và cộng đồng 50.000+ học sinh.' },
];

const VALUES = [
  { title: 'Chất lượng là ưu tiên số 1', desc: 'Mọi gia sư đều được Admin phê duyệt, xác minh bằng cấp và theo dõi đánh giá liên tục.', color: '#0062FF' },
  { title: 'Minh bạch tuyệt đối', desc: 'Mọi đánh giá, điểm uy tín, giá cả và lịch sử giao dịch đều công khai và rõ ràng.', color: '#0062FF' },
  { title: 'Hỗ trợ tận tâm', desc: 'Đội ngũ hỗ trợ sẵn sàng giải đáp mọi thắc mắc, xử lý khiếu nại trong 24 giờ.', color: '#0062FF' },
  { title: 'Công nghệ hiện đại', desc: 'Nền tảng web + mobile, đặt lịch tự động, nhắc lịch thông minh, thanh toán trực tuyến.', color: '#0062FF' },
];

const TEAM = [
  { name: 'TS. Phạm Thị Lan Hương', role: 'Founder & CEO', bio: '15 năm kinh nghiệm trong giáo dục, cựu giảng viên ĐH Bách Khoa.', avatar: 'https://i.pravatar.cc/200?img=44' },
  { name: 'Nguyễn Hoàng Minh', role: 'CTO', bio: '10 năm kinh nghiệm kỹ thuật phần mềm, ex-FPT Software.', avatar: 'https://i.pravatar.cc/200?img=12' },
  { name: 'Trần Minh Đức', role: 'Head of Operations', bio: 'Chuyên gia vận hành nền tảng EdTech, điều phối 2.400+ gia sư toàn quốc.', avatar: 'https://i.pravatar.cc/200?img=33' },
  { name: 'Lê Ngọc Mai', role: 'Head of Education', bio: 'Thạc sĩ Sư phạm, 8 năm biên soạn giáo trình và đào tạo gia sư.', avatar: 'https://i.pravatar.cc/200?img=47' },
];

const AboutPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1d1d1f', fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif" }}>
      <LandingHeader />

      {/* Hero */}
      <section style={{ paddingTop: 100, paddingBottom: 80, background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 60% at 30% 0%, rgba(0,98,255,0.07) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 style={{ fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif", fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#1d1d1f', marginBottom: 20 }}>Kết nối tri thức,<br />kiến tạo tương lai</h1>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.7, color: '#6e6e73', maxWidth: 600 }}>TutorMatch là nền tảng kết nối Học sinh và Gia sư hàng đầu Việt Nam. Chúng tôi tin rằng mỗi học sinh đều xứng đáng được tiếp cận giáo dục chất lượng, dù ở bất kỳ đâu.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section style={{ background: '#f5f5f7', padding: '80px 48px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-story-grid">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 16, lineHeight: 1.1 }}>Câu chuyện của<br />chúng tôi</h2>
              <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.7, marginBottom: 14 }}>Năm 2022, nhận thấy khoảng cách lớn giữa nhu cầu học tập của học sinh và nguồn gia sư chất lượng, đội ngũ sáng lập TutorMatch đặt mục tiêu xây dựng một nền tảng nơi mọi học sinh đều có thể tìm được gia sư phù hợp.</p>
              <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.7 }}>Từ một dự án nhỏ với 50 gia sư tại TP.HCM, đến nay TutorMatch đã phục vụ hơn 50.000 học sinh với 2.400+ gia sư được phê duyệt trên khắp cả nước.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {TIMELINE.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 20, position: 'relative' }}>
                    {i < TIMELINE.length - 1 && <div style={{ position: 'absolute', left: 11, top: 28, bottom: -12, width: 2, background: 'rgba(0,98,255,0.15)' }} />}
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0062FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, boxShadow: '0 0 0 4px rgba(0,98,255,0.1)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />
                    </div>
                    <div style={{ paddingBottom: 28 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#0062FF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'SF Pro Display', system-ui, sans-serif", display: 'block', marginBottom: 4 }}>{item.year}</span>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 4, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{item.title}</h4>
                      <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.5, margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ background: '#ffffff', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { label: 'Sứ mệnh', title: 'Democratize Education', desc: 'Mang giáo dục chất lượng đến mọi học sinh, bất kể vị trí địa lý hay hoàn cảnh tài chính. Mỗi phiên học đều là một bước tiến.', color: '#0062FF' },
              { label: 'Tầm nhìn', title: 'EdTech Leader 2030', desc: 'Trở thành nền tảng EdTech số 1 tại Việt Nam, phục vụ 1 triệu học sinh với hệ sinh thái học tập toàn diện.', color: '#7B61FF' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#f5f5f7', borderRadius: 20, padding: '32px 28px', border: '1px solid rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#86868b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{item.label}</p>
                <h3 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: '#1d1d1f', marginBottom: 12, letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#6e6e73', lineHeight: 1.65, margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ background: '#f5f5f7', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 8 }}>Giá trị cốt lõi</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {VALUES.map((value, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{ background: '#ffffff', borderRadius: 20, padding: '24px', border: '1px solid rgba(0,0,0,0.07)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${value.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={value.color} strokeWidth="1.8"/><path d="M8 12L11 15L16 9" stroke={value.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h4 style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>{value.title}</h4>
                <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.55, margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: '#ffffff', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 8 }}>Đội ngũ lãnh đạo</h2>
            <p style={{ fontSize: 15, color: '#6e6e73' }}>Những người kiến tạo nên TutorMatch</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {TEAM.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{ textAlign: 'center', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; }}>
                <img src={member.avatar} alt={member.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 14, border: '3px solid rgba(0,98,255,0.1)' }} />
                <h4 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: '#1d1d1f', marginBottom: 4 }}>{member.name}</h4>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0062FF', marginBottom: 8, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{member.role}</p>
                <p style={{ fontSize: 12, color: '#86868b', lineHeight: 1.5, margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ background: '#f5f5f7', padding: '80px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="about-contact-grid">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 16 }}>Liên hệ với chúng tôi</h2>
              <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.7, marginBottom: 32 }}>Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Đội ngũ TutorMatch luôn sẵn sàng lắng nghe.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: 'M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z M22 6L12 13 2 6', label: 'Email', value: 'contact@tutormatch.vn' },
                  { icon: 'M3 12H5 M19 12H21 M12 3V5 M12 19V21 M4.93 4.93L7.05 7.05 M16.95 16.95L19.07 19.07 M4.93 19.07L7.05 16.95 M16.95 7.05L19.07 4.93', label: 'Điện thoại', value: '1900 1234' },
                  { icon: 'M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z M12 9C10.9 9 10 9.9 10 11C10 12.1 10.9 13 12 13C13.1 13 14 12.1 14 11C14 9.9 13.1 9 12 9Z', label: 'Địa chỉ', value: 'Số 7, hồ Thiền Quang, thành phố Hà Nội' },
                ].map((contact, ci) => (
                  <div key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,98,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0062FF', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={contact.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{contact.label}</p>
                      <p style={{ fontSize: 14, color: '#1d1d1f', fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ background: '#ffffff', borderRadius: 20, padding: '32px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: '#1d1d1f', marginBottom: 20 }}>Gửi tin nhắn</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ label: 'Họ và tên', type: 'text', placeholder: 'Nhập họ và tên của bạn' }, { label: 'Email', type: 'email', placeholder: 'email@example.com' }, { label: 'Số điện thoại', type: 'tel', placeholder: '0xxx xxx xxx' }].map((field, fi) => (
                  <div key={fi}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#6e6e73', display: 'block', marginBottom: 6, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14, fontFamily: "'SF Pro Text', system-ui, sans-serif", color: '#1d1d1f', background: '#fafafa', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s ease' }}
                      onFocus={(e) => { e.target.style.borderColor = '#0062FF'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: '#6e6e73', display: 'block', marginBottom: 6, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>Nội dung</label>
                  <textarea placeholder="Viết nội dung tin nhắn..." rows={4} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14, fontFamily: "'SF Pro Text', system-ui, sans-serif", color: '#1d1d1f', background: '#fafafa', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5, transition: 'border-color 0.2s ease' }}
                    onFocus={(e) => { e.target.style.borderColor = '#0062FF'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; }} />
                </div>
                <button className="apple-btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>Gửi tin nhắn</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#ffffff', padding: '80px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 12 }}>Tham gia cùng TutorMatch</h2>
          <p style={{ fontSize: 16, color: '#6e6e73', lineHeight: 1.6, marginBottom: 28 }}>Đăng ký miễn phí hoặc trở thành gia sư để kiến tạo tương lai giáo dục cùng chúng tôi.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button className="apple-btn-store-hero">Đăng ký học sinh</button></Link>
            <Link to="/register"><button className="apple-btn-secondary-pill">Đăng ký làm gia sư</button></Link>
          </div>
        </div>
      </section>

      <LandingFooter />
      <style>{`@media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } .about-story-grid { grid-template-columns: 1fr !important; gap: 40px !important; } .about-contact-grid { grid-template-columns: 1fr !important; } } @media (max-width: 480px) { section { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </div>
  );
};

export default AboutPage;
