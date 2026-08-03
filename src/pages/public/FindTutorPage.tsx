import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingHeader, LandingFooter } from '../../layout/Landing';

// ── Mock data ──────────────────────────────────────────────
const MOCK_TUTORS = [
  {
    id: '1',
    name: 'Nguyễn Minh Anh',
    avatar: 'https://i.pravatar.cc/150?img=1',
    subjects: ['Toán', 'Lý'],
    rating: 4.9,
    sessions: 312,
    price: 2,
    bio: 'Thạc sĩ Toán-Tin ĐH Bách Khoa. 6 năm kinh nghiệm luyện thi ĐH, đặc biệt chuyên Toán AMC và VMO.',
    badges: ['Top Tutor', 'ĐH Bách Khoa'],
    location: 'TP. Hồ Chí Minh',
    online: true,
  },
  {
    id: '2',
    name: 'Trần Hoàng Nam',
    avatar: 'https://i.pravatar.cc/150?img=3',
    subjects: ['Anh Văn'],
    rating: 4.8,
    sessions: 198,
    price: 2,
    bio: 'IELTS 8.5 — Giáo viên chính thức của British Council. Chuyên gia luyện thi IELTS, TOEIC với phương pháp Cambridge.',
    badges: ['IELTS Expert', 'British Council'],
    location: 'Hà Nội',
    online: true,
  },
  {
    id: '3',
    name: 'Lê Thu Hà',
    avatar: 'https://i.pravatar.cc/150?img=5',
    subjects: ['Hóa Học', 'Sinh Học'],
    rating: 4.7,
    sessions: 256,
    price: 2,
    bio: 'Cử nhân Hóa — ĐH Y Dược TP.HCM. Chuyên luyện thi THPT QG môn Hóa, phương pháp giảng dạy dễ hiểu.',
    badges: ['ĐH Y Dược'],
    location: 'TP. Hồ Chí Minh',
    online: false,
  },
  {
    id: '4',
    name: 'Phạm Quang Dũng',
    avatar: 'https://i.pravatar.cc/150?img=7',
    subjects: ['Toán', 'Vật Lý'],
    rating: 4.9,
    sessions: 401,
    price: 3,
    bio: 'Kỹ sư cơ khí — ĐH Bách Khoa. Chuyên gia ôn thi chuyên Toán, Lý cấp THPT, phương pháp tư duy logic.',
    badges: ['Top Tutor', 'Kỹ sư'],
    location: 'Đà Nẵng',
    online: true,
  },
  {
    id: '5',
    name: 'Hoàng Thị Mai',
    avatar: 'https://i.pravatar.cc/150?img=9',
    subjects: ['Ngữ Văn', 'Lịch Sử'],
    rating: 4.6,
    sessions: 143,
    price: 2,
    bio: 'Thạc sĩ Sư phạm Văn — ĐH Sư phạm HN. Giảng dạy Ngữ Văn theo hướng phân tích, so sánh, rèn kỹ năng viết.',
    badges: ['ĐH Sư phạm'],
    location: 'Hà Nội',
    online: false,
  },
  {
    id: '6',
    name: 'Vũ Đình Khoa',
    avatar: 'https://i.pravatar.cc/150?img=11',
    subjects: ['Tin Học', 'Toán'],
    rating: 4.8,
    sessions: 227,
    price: 2,
    bio: 'Kỹ sư phần mềm — FPT Software. Chuyên lập trình Python, C++, giải thuật và cấu trúc dữ liệu cho học sinh.',
    badges: ['FPT Software', 'Code Expert'],
    location: 'TP. Hồ Chí Minh',
    online: true,
  },
];

const SUBJECTS_OPTIONS = ['Toán', 'Lý', 'Hóa', 'Anh Văn', 'Ngữ Văn', 'Sinh Học', 'Tin Học', 'Lịch Sử'];
const SORT_OPTIONS = ['Điểm uy tín cao nhất', 'Phiên học nhiều nhất', 'Giá thấp nhất', 'Mới nhất'];

// ─────────────────────────────────────────────────────────────
const FindTutorPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Điểm uy tín cao nhất');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const filtered = MOCK_TUTORS
    .filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchSubject =
        selectedSubjects.length === 0 ||
        selectedSubjects.some((s) => t.subjects.includes(s));
      const matchOnline = !showOnlineOnly || t.online;
      return matchSearch && matchSubject && matchOnline;
    })
    .sort((a, b) => {
      if (sortBy === 'Điểm uy tín cao nhất') return b.rating - a.rating;
      if (sortBy === 'Phiên học nhiều nhất') return b.sessions - a.sessions;
      if (sortBy === 'Giá thấp nhất') return a.price - b.price;
      return 0;
    });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#1d1d1f',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
    }}>
      <LandingHeader />

      {/* ── Page Hero ── */}
      <section style={{
        paddingTop: 100,
        paddingBottom: 64,
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,98,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(123,97,255,0.04) 0%, transparent 60%)
          `,
        }} />
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#1d1d1f',
              marginBottom: 16,
            }}>
              Tìm gia sư phù hợp<br />cho con em bạn
            </h1>
            <p style={{
              fontSize: 17, fontWeight: 400,
              lineHeight: 1.65, color: '#6e6e73',
              maxWidth: 520, marginBottom: 36,
            }}>
              Hơn 2.400 gia sư được phê duyệt, đa dạng môn học từ lớp 1 đến lớp 12 và luyện thi ĐH. Đặt phiên học chỉ từ 2 Credit.
            </p>

            {/* Search Bar */}
            <div style={{
              maxWidth: 560,
              position: 'relative',
              marginBottom: 24,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#86868b', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Tìm theo tên gia sư hoặc môn học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  fontSize: 16,
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  color: '#1d1d1f',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0062FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,102,255,0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Subject pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {SUBJECTS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 999,
                    border: `1px solid ${selectedSubjects.includes(s) ? '#0062FF' : 'rgba(0,0,0,0.12)'}`,
                    background: selectedSubjects.includes(s) ? '#0062FF' : '#ffffff',
                    color: selectedSubjects.includes(s) ? '#ffffff' : '#6e6e73',
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Controls row */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#ffffff',
                  fontSize: 13,
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  color: '#1d1d1f',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div
                  onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                  style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: showOnlineOnly ? '#0062FF' : '#d1d5db',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: 2, left: showOnlineOnly ? 18 : 2,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <span style={{ fontSize: 13, color: '#6e6e73', fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
                  Gia sư đang online
                </span>
              </label>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Results ── */}
      <section style={{ background: '#f5f5f7', padding: '48px 48px 80px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 14, color: '#6e6e73', fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
              <span style={{ fontWeight: 600, color: '#1d1d1f' }}>{filtered.length}</span> gia sư được tìm thấy
            </p>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px', color: '#d1d5db' }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 16, color: '#6e6e73', fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
                Không tìm thấy gia sư phù hợp. Thử thay đổi bộ lọc.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {filtered.map((tutor, i) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: 20,
                    padding: '24px',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Online badge */}
                  {tutor.online && (
                    <div style={{
                      position: 'absolute', top: 20, right: 20,
                      width: 10, height: 10, borderRadius: '50%',
                      background: '#00C48C',
                      border: '2px solid #ffffff',
                      boxShadow: '0 0 0 1px rgba(0,196,140,0.3)',
                    }} />
                  )}

                  {/* Header */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,98,255,0.1)' }}
                      />
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'SF Pro Display', system-ui, sans-serif",
                        fontSize: 15, fontWeight: 600,
                        color: '#1d1d1f', marginBottom: 4,
                        letterSpacing: '-0.01em',
                      }}>
                        {tutor.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>{tutor.rating}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#86868b' }}>·</span>
                        <span style={{ fontSize: 12, color: '#86868b' }}>{tutor.sessions} phiên</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {tutor.badges.map((b) => (
                          <span key={b} style={{
                            fontSize: 11, fontWeight: 500,
                            color: '#0062FF',
                            background: 'rgba(0,98,255,0.08)',
                            padding: '2px 8px',
                            borderRadius: 999,
                          }}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {tutor.subjects.map((s) => (
                      <span key={s} style={{
                        fontSize: 12, color: '#6e6e73',
                        background: '#f5f5f7',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontWeight: 400,
                      }}>
                        {s}
                      </span>
                    ))}
                    <span style={{ fontSize: 12, color: '#86868b', background: '#f5f5f7', padding: '3px 10px', borderRadius: 6 }}>
                      {tutor.location}
                    </span>
                  </div>

                  {/* Bio */}
                  <p style={{
                    fontSize: 13, color: '#6e6e73', lineHeight: 1.5,
                    marginBottom: 16, fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {tutor.bio}
                  </p>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#0062FF', fontFamily: "'SF Pro Display', system-ui, sans-serif" }}>
                        {tutor.price} Credit
                      </span>
                      <span style={{ fontSize: 12, color: '#86868b', marginLeft: 4 }}>/ phiên</span>
                    </div>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button className="apple-btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>
                        Đặt lịch
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section style={{ background: '#ffffff', padding: '64px 48px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { value: '2.400+', label: 'Gia sư chất lượng', sub: 'Được Admin phê duyệt' },
              { value: '15.000+', label: 'Phiên học hoàn thành', sub: 'Từ năm 2022' },
              { value: '49★', label: 'Điểm uy tín TB', sub: 'Trên thang 50 điểm' },
              { value: '8+', label: 'Môn học đa dạng', sub: 'Lớp 1 → Luyện thi ĐH' },
            ].map((item, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 40, fontWeight: 500,
                  color: '#0062FF',
                  letterSpacing: '-2px',
                  margin: '0 0 6px',
                  background: 'linear-gradient(135deg, #0062FF, #7B61FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {item.value}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 2, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 12, color: '#86868b', margin: 0, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: '#f5f5f7', padding: '80px 48px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 8,
            }}>
              Đặt phiên học trong 4 bước
            </h2>
            <p style={{ fontSize: 16, color: '#6e6e73', fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
              Quy trình đơn giản, minh bạch và hoàn toàn trực tuyến
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              {
                step: '01',
                title: 'Tìm & lọc gia sư',
                desc: 'Lọc theo môn học, lịch rảnh, điểm uy tín hoặc tìm kiếm trực tiếp.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
              },
              {
                step: '02',
                title: 'Chọn gia sư & thời gian',
                desc: 'Xem hồ sơ, đánh giá, chọn khung giờ phù hợp và gửi yêu cầu đặt lịch.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9H21M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
              },
              {
                step: '03',
                title: 'Xác nhận & thanh toán',
                desc: 'Gia sư xác nhận trong 2 giờ. Credit được trừ khi xác nhận — hoàn tiền nếu hủy đúng hạn.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              },
              {
                step: '04',
                title: 'Học & đánh giá',
                desc: 'Tham gia phiên qua link họp trực tuyến. Gia sư ghi kết quả. Cả hai đánh giá nhau.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: 16,
                padding: '24px 20px',
                border: '1px solid rgba(0,0,0,0.07)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'rgba(0,98,255,0.08)',
                  border: '1px solid rgba(0,98,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0062FF', marginBottom: 14,
                }}>
                  {item.icon}
                </div>
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, sans-serif",
                  fontSize: 36, fontWeight: 500, color: 'rgba(0,98,255,0.12)',
                  letterSpacing: '-2px', marginBottom: 8, lineHeight: 1,
                }}>
                  {item.step}
                </p>
                <h3 style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontSize: 14, fontWeight: 600, color: '#1d1d1f', marginBottom: 8,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontSize: 13, color: '#6e6e73', margin: 0, lineHeight: 1.5,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#ffffff', padding: '80px 48px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 12,
          }}>
            Sẵn sàng tìm gia sư cho con?
          </h2>
          <p style={{ fontSize: 16, color: '#6e6e73', lineHeight: 1.6, marginBottom: 28, fontFamily: "'SF Pro Text', system-ui, sans-serif" }}>
            Đăng ký miễn phí và bắt đầu đặt phiên học đầu tiên ngay hôm nay.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button className="apple-btn-store-hero">Bắt đầu miễn phí</button>
            </Link>
            <Link to="/pricing">
              <button className="apple-btn-secondary-pill">Xem bảng giá</button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (max-width: 480px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default FindTutorPage;
