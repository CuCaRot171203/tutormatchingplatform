import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingHeader, LandingFooter } from '../../layout/Landing';
import Logo from '../../assets/branding/Logo.png';

import mathImg from '../../assets/image/subject/01-toan.png';
import physicsImg from '../../assets/image/subject/02-vat-ly.png';
import chemistryImg from '../../assets/image/subject/03-hoa-hoc.png';
import englishImg from '../../assets/image/subject/04-anh-van.png';
import literatureImg from '../../assets/image/subject/05-ngu-van.png';
import biologyImg from '../../assets/image/subject/06-sinh-hoc.png';
import informaticsImg from '../../assets/image/subject/07-tin-hoc.png';
import historyImg from '../../assets/image/subject/08-lich-su.png';

const SUBJECTS = [
  { name: 'Toán', image: mathImg, tutorCount: 487, avgRating: 4.8, description: 'Từ số học cơ bản đến giải tích nâng cao, luyện thi THPT QG và chuyên Toán.', levels: ['Lớp 1–5', 'Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH'], popular: true },
  { name: 'Vật Lý', image: physicsImg, tutorCount: 312, avgRating: 4.7, description: 'Cơ học, điện, quang, nhiệt — hệ thống kiến thức vật lý từ cơ bản đến chuyên sâu.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Chuyên Lý', 'Luyện thi ĐH'], popular: true },
  { name: 'Hóa Học', image: chemistryImg, tutorCount: 245, avgRating: 4.7, description: 'Hóa vô cơ, hữu cơ, pin điện hóa — phương pháp học Hóa bằng thực hành và ghi nhớ thông minh.', levels: ['Lớp 8–9', 'Lớp 10–12', 'Chuyên Hóa', 'Luyện thi ĐH'], popular: false },
  { name: 'Anh Văn', image: englishImg, tutorCount: 389, avgRating: 4.8, description: 'Ngữ pháp, từ vựng, IELTS, TOEIC — giao tiếp và học thuật theo chuẩn Cambridge.', levels: ['Cơ bản', 'IELTS', 'TOEFL', 'Giao tiếp'], popular: true },
  { name: 'Ngữ Văn', image: literatureImg, tutorCount: 198, avgRating: 4.6, description: 'Văn học, ngữ pháp, kỹ năng viết — phân tích tác phẩm và luyện viết luận theo phương pháp hiện đại.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH', 'Viết sáng tạo'], popular: false },
  { name: 'Sinh Học', image: biologyImg, tutorCount: 167, avgRating: 4.7, description: 'Sinh học tế bào, di truyền, sinh thái — kết hợp lý thuyết với hình ảnh trực quan và sơ đồ.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Chuyên Sinh', 'Luyện thi ĐH'], popular: false },
  { name: 'Tin Học', image: informaticsImg, tutorCount: 203, avgRating: 4.8, description: 'Python, C++, thuật toán, cấu trúc dữ liệu — từ cơ bản đến nâng cao cho học sinh và sinh viên.', levels: ['Cơ bản', 'Python', 'C++', 'Giải thuật'], popular: false },
  { name: 'Lịch Sử', image: historyImg, tutorCount: 124, avgRating: 4.5, description: 'Lịch sử Việt Nam và thế giới — phương pháp ghi nhớ theo dòng thời gian, sự kiện và nhân vật.', levels: ['Lớp 6–9', 'Lớp 10–12', 'Luyện thi ĐH', 'Lịch sử thế giới'], popular: false },
];

const AUTO_PLAY_INTERVAL = 5000;

const SubjectsPage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const target = container.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveIndex(index);
  };

  const next = () => {
    const nextIndex = (activeIndex + 1) % SUBJECTS.length;
    scrollToIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex = (activeIndex - 1 + SUBJECTS.length) % SUBJECTS.length;
    scrollToIndex(prevIndex);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const scrollTop = container.scrollTop;
    const closest = children.reduce((prev, curr) => {
      const prevTop = Math.abs(prev.offsetTop - scrollTop);
      const currTop = Math.abs(curr.offsetTop - scrollTop);
      return currTop < prevTop ? curr : prev;
    });
    const idx = parseInt(closest.dataset.index ?? '0', 10);
    setActiveIndex(idx);
  };

  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, isPaused]);

  return (
    <div style={{
      backgroundColor: 'var(--apple-canvas)',
      color: 'var(--apple-ink)',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
    }}>
      <LandingHeader />

      {/* Hero Section */}
      <section style={{
        paddingTop: 130,
        paddingBottom: 48,
        paddingLeft: 'max(48px, calc((100vw - 1440px) / 2 + 48px))',
        paddingRight: 'max(48px, calc((100vw - 1440px) / 2 + 48px))',
        background: 'var(--apple-canvas)',
        position: 'relative',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: 'var(--apple-ink)',
            marginBottom: 20,
            maxWidth: 640,
          }}>
            8 môn học từ lớp 1<br />đến luyện thi Đại học
          </h1>
          <p style={{
            fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: '-0.374px',
            color: 'var(--apple-ink-muted-48)',
            maxWidth: 540,
          }}>
            Mỗi môn học được giảng dạy bởi gia sư chuyên nghiệp, có phương pháp riêng và đánh giá minh bạch từ học sinh.
          </p>
        </motion.div>
      </section>

      {/* Full-width Auto-scroll Slider */}
      <section style={{ position: 'relative', overflow: 'visible' }}>
        {/* Slider Controls — top right */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 24,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={prev}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--apple-ink)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }}
            aria-label="Môn trước"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={next}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--apple-primary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              boxShadow: '0 2px 12px rgba(0,102,204,0.3)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--apple-primary-focus)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--apple-primary)'; }}
            aria-label="Môn tiếp theo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
            width: '100%',
            height: 'calc(100vh - 100px)',
            minHeight: 640,
            maxHeight: 900,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            .subjects-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          {SUBJECTS.map((subject, i) => (
            <div
              key={subject.name}
              data-index={i}
              style={{
                width: '100%',
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={subject.image}
                alt={subject.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
                draggable={false}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.55) 100%)',
                pointerEvents: 'none',
              }} />

              {subject.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === activeIndex ? 0.15 : 0, duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 24,
                    background: 'var(--apple-primary)',
                    color: '#fff',
                    fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    padding: '5px 14px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                    zIndex: 3,
                  }}
                >
                  Phổ biến
                </motion.div>
              )}

              {/* Logo — top-left corner */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i === activeIndex ? 0.05 : 0, duration: 0.4 }}
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 24,
                  zIndex: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <img
                  src={Logo}
                  alt="TutorHub"
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                  }}
                  draggable={false}
                />
              </motion.div>

              {/* Top-left text block: name + rating + description */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '40px 48px 0',
                zIndex: 2,
              }}>
                <motion.h2
                  key={`title-${i}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === activeIndex ? 0.1 : 0, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.0,
                    color: '#ffffff',
                    margin: '0 0 12px',
                    textShadow: '0 2px 16px rgba(0,0,0,0.6)',
                  }}
                >
                  {subject.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i === activeIndex ? 0.14 : 0, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif", fontSize: 14, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.2px' }}>
                    {subject.avgRating}
                  </span>
                  <span style={{ fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.2px' }}>
                    · <span style={{ fontWeight: 600 }}>{subject.tutorCount}</span> gia sư
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === activeIndex ? 0.18 : 0, duration: 0.4 }}
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    letterSpacing: '-0.2px',
                    color: 'rgba(255,255,255,0.88)',
                    marginBottom: 0,
                    maxWidth: 600,
                    textShadow: '0 1px 6px rgba(0,0,0,0.45)',
                  }}
                >
                  {subject.description}
                </motion.p>
              </div>

              {/* Bottom text block: level tags + CTA */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0 48px 48px',
                zIndex: 2,
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === activeIndex ? 0.24 : 0, duration: 0.4 }}
                  style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}
                >
                  {subject.levels.map((level) => (
                    <span
                      key={level}
                      style={{
                        fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: '-0.2px',
                        color: '#ffffff',
                        background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        padding: '5px 12px',
                        borderRadius: 999,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      {level}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === activeIndex ? 0.3 : 0, duration: 0.4 }}
                >
                  <Link to="/find-tutor" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '11px 24px',
                        background: 'var(--apple-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 999,
                        fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: '-0.2px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 16px rgba(0,102,204,0.4)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--apple-primary-focus)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--apple-primary)'; }}
                    >
                      Tìm gia sư
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators — bottom center */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {SUBJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === activeIndex ? 'var(--apple-primary)' : 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(4px)',
                border: i === activeIndex ? 'none' : '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.35s ease, background 0.35s ease',
                flexShrink: 0,
              }}
              aria-label={`Chuyển đến môn ${SUBJECTS[i].name}`}
            />
          ))}
        </div>

        {/* Counter — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          right: 24,
          zIndex: 20,
          fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '-0.12px',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '5px 12px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(SUBJECTS.length).padStart(2, '0')}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        background: 'var(--apple-canvas)',
        padding: '80px max(48px, calc((100vw - 1440px) / 2 + 48px))',
        borderTop: '1px solid var(--apple-divider-soft)',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--apple-ink)',
            marginBottom: 48,
            textAlign: 'center',
          }}>
            Số liệu theo từng môn học
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { label: 'Tổng gia sư', value: '2.400+' },
              { label: 'Môn học', value: '8' },
              { label: 'Phiên học hoàn thành', value: '15.000+' },
              { label: 'Tỷ lệ hài lòng', value: '97%' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  background: 'var(--apple-canvas-parchment)',
                  borderRadius: 18,
                  padding: '28px 24px',
                  textAlign: 'center',
                  border: '1px solid var(--apple-hairline)',
                }}
              >
                <p style={{
                  fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
                  fontSize: 36,
                  fontWeight: 600,
                  letterSpacing: '-2px',
                  color: 'var(--apple-primary)',
                  margin: '0 0 8px',
                }}>
                  {item.value}
                </p>
                <p style={{
                  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: '-0.224px',
                  color: 'var(--apple-ink-muted-48)',
                  margin: 0,
                }}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'var(--apple-canvas-parchment)',
        padding: '80px max(48px, calc((100vw - 1440px) / 2 + 48px))',
        textAlign: 'center',
        borderTop: '1px solid var(--apple-divider-soft)',
      }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
            fontSize: 'clamp(26px, 3.5vw, 38px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--apple-ink)',
            marginBottom: 14,
          }}>
            Tìm gia sư cho môn học bạn cần
          </h2>
          <p style={{
            fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: '-0.374px',
            color: 'var(--apple-ink-muted-48)',
            marginBottom: 32,
          }}>
            Đăng ký miễn phí, chọn môn học và bắt đầu đặt phiên học ngay hôm nay.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/find-tutor">
              <button className="apple-btn-store-hero">Tìm gia sư ngay</button>
            </Link>
            <Link to="/register">
              <button className="apple-btn-secondary-pill">Đăng ký miễn phí</button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default SubjectsPage;
