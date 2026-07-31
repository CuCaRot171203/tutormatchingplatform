import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingHeader, LandingFooter } from '../../layout/Landing';

const SUBJECTS = [
  { name: 'Toán', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 487, avgRating: 4.8, description: 'Từ số học cơ bản đến giải tích nâng cao, luyện thi THPT QG và chuyên Toán.', levels: ['Lớp 1–5', 'Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH'], popular: true },
  { name: 'Vật Lý', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 312, avgRating: 4.7, description: 'Cơ học, điện, quang, nhiệt — hệ thống kiến thức vật lý từ cơ bản đến chuyên sâu.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Chuyên Lý', 'Luyện thi ĐH'], popular: true },
  { name: 'Hóa Học', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 245, avgRating: 4.7, description: 'Hóa vô cơ, hữu cơ, pin điện hóa — phương pháp học Hóa bằng thực hành và ghi nhớ thông minh.', levels: ['Lớp 8–9', 'Lớp 10–12', 'Chuyên Hóa', 'Luyện thi ĐH'], popular: false },
  { name: 'Anh Văn', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 389, avgRating: 4.8, description: 'Ngữ pháp, từ vựng, IELTS, TOEIC — giao tiếp và học thuật theo chuẩn Cambridge.', levels: ['Cơ bản', 'IELTS', 'TOEFL', 'Giao tiếp'], popular: true },
  { name: 'Ngữ Văn', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 198, avgRating: 4.6, description: 'Văn học, ngữ pháp, kỹ năng viết — phân tích tác phẩm và luyện viết luận theo phương pháp hiện đại.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH', 'Viết sáng tạo'], popular: false },
  { name: 'Sinh Học', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 167, avgRating: 4.7, description: 'Sinh học tế bào, di truyền, sinh thái — kết hợp lý thuyết với hình ảnh trực quan và sơ đồ.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Chuyên Sinh', 'Luyện thi ĐH'], popular: false },
  { name: 'Tin Học', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 203, avgRating: 4.8, description: 'Python, C++, thuật toán, cấu trúc dữ liệu — từ cơ bản đến nâng cao cho học sinh và sinh viên.', levels: ['Cơ bản', 'Python', 'C++', 'Giải thuật'], popular: false },
  { name: 'Lịch Sử', color: '#0062FF', bgColor: 'rgba(0,98,255,0.07)', tutorCount: 124, avgRating: 4.5, description: 'Lịch sử Việt Nam và thế giới — phương pháp ghi nhớ theo dòng thời gian, sự kiện và nhân vật.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH', 'Lịch sử thế giới'], popular: false },
];

const SubjectsPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1d1d1f', fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif" }}>
      <LandingHeader />
      <section style={{ paddingTop: 100, paddingBottom: 64, background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(0,98,255,0.06) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#1d1d1f', marginBottom: 16 }}>8 môn học từ lớp 1<br />đến luyện thi Đại học</h1>
            <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: '#6e6e73', maxWidth: 540 }}>Mỗi môn học được giảng dạy bởi gia sư chuyên nghiệp, có phương pháp riêng và đánh giá minh bạch từ học sinh.</p>
          </motion.div>
        </div>
      </section>
      <section style={{ background: '#f5f5f7', padding: '48px 48px 80px',marginTop: 16 }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {SUBJECTS.map((subject, i) => (
              <motion.div key={subject.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.06 }}
                style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 20, padding: '28px 24px', position: 'relative', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                {subject.popular && <div style={{ position: 'absolute', top: -1, right: 20, background: 'linear-gradient(135deg, #0062FF, #7B61FF)', color: '#ffffff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: '0 0 8px 8px', letterSpacing: '0.02em' }}>Phổ biến</div>}
                <div style={{ width: 52, height: 52, borderRadius: 14, background: subject.bgColor, border: `1px solid ${subject.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: subject.color, marginBottom: 16 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={subject.color} strokeWidth="1.8"/><path d="M12 8V12L15 15" stroke={subject.color} strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', margin: 0 }}>{subject.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>{subject.avgRating}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.55, marginBottom: 14, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{subject.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {subject.levels.map((l) => (<span key={l} style={{ fontSize: 11, color: '#86868b', background: '#f5f5f7', padding: '3px 10px', borderRadius: 6 }}>{l}</span>))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: 13, color: '#86868b' }}><span style={{ fontWeight: 600, color: '#1d1d1f' }}>{subject.tutorCount}</span> gia sư</span>
                  <Link to="/find-tutor" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '6px 14px', background: 'transparent', color: subject.color, border: `1px solid ${subject.color}44`, borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: "'SF Pro Text', system-ui, sans-serif", cursor: 'pointer', transition: 'all 0.2s ease' }}>Tìm gia sư →</button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: '#ffffff', padding: '64px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 40 }}>Số liệu theo từng môn học</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[{ label: 'Tổng gia sư', value: '2.400+', accent: '#0062FF' }, { label: 'Môn học', value: '8', accent: '#0062FF' }, { label: 'Phiên học hoàn thành', value: '15.000+', accent: '#0062FF' }, { label: 'Tỷ lệ hài lòng', value: '97%', accent: '#0062FF' }].map((item, i) => (
              <div key={i} style={{ background: '#f5f5f7', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 36, fontWeight: 500, color: item.accent, letterSpacing: '-2px', margin: '0 0 6px', background: `linear-gradient(135deg, ${item.accent}, ${item.accent}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{item.value}</p>
                <p style={{ fontSize: 13, color: '#86868b', margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: '#f5f5f7', padding: '80px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'SF Pro Display', system-ui, sans-serif", fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 12 }}>Tìm gia sư cho môn học bạn cần</h2>
          <p style={{ fontSize: 16, color: '#6e6e73', lineHeight: 1.6, marginBottom: 28, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>Đăng ký miễn phí, chọn môn học và bắt đầu đặt phiên học ngay hôm nay.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/find-tutor"><button className="apple-btn-store-hero">Tìm gia sư ngay</button></Link>
            <Link to="/register"><button className="apple-btn-secondary-pill">Đăng ký miễn phí</button></Link>
          </div>
        </div>
      </section>
      <LandingFooter />
      <style>{`@media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } } @media (max-width: 480px) { section { padding-left: 16px !important; padding-right: 16px !important; } }`}</style>
    </div>
  );
};

export default SubjectsPage;
