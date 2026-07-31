import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftOutlined, CheckOutlined, CloseOutlined,
  MailOutlined, CalendarOutlined, StarOutlined,
  UserOutlined, BookOutlined, TrophyOutlined,
  PhoneOutlined, GlobalOutlined, AimOutlined,
  TeamOutlined, ClockCircleOutlined, SafetyOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';

// ─── Design Tokens (aligned with Dashboard) ─────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',

  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',

  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',
  accentGlow:    'rgba(79,110,247,0.15)',

  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  purple:        '#8b5cf6',
  purpleLight:   'rgba(139,92,246,0.08)',
};

const FONT = "'Inter', system-ui, -apple-system, sans-serif";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_TUTORS = [
  {
    id: '1',
    fullName: 'Trần Thị Mai Anh',
    email: 'maitran.teacher@gmail.com',
    phone: '0912 345 678',
    location: 'Quận Cầu Giấy, Hà Nội',
    website: 'maianhtran.edu.vn',
    bio: 'Gia sư Toán với 5 năm kinh nghiệm giảng dạy tại trường THPT chuyên. Yêu thích phương pháp giáo dục hiện đại, luôn tìm cách truyền cảm hứng cho học sinh qua từng bài giảng.',
    longBio: `Tôi bắt đầu sự nghiệp giảng dạy từ năm 2019 tại một trường THPT chuyên ở Hà Nội, nơi tôi phụ trách các lớp chuyên Toán và luyện thi Đại học. Trong suốt 5 năm qua, tôi đã giúp hơn 120 học sinh đạt điểm số mong muốn trong các kỳ thi quan trọng.

Phương pháp giảng dạy của tôi kết hợp giữa lý thuyết nền tảng và thực hành bài tập có chọn lọc. Tôi tin rằng hiểu bản chất vấn đề quan trọng hơn học vẹt công thức. Mỗi buổi học đều được thiết kế riêng phù hợp với năng lực và mục tiêu của từng học sinh.

Ngoài giảng dạy, tôi còn tham gia nghiên cứu các phương pháp giáo dục mới và đã có bài báo được đăng trên tạp chí Giáo dục. Tôi luôn cập nhật xu hướng ra đề thi mới nhất để đảm bảo học sinh được tiếp cận kiến thức sát thực tế nhất.`,
    qualifications: 'Thạc sĩ Sư phạm Toán - ĐH Sư phạm Hà Nội; Chứng chỉ bồi dưỡng kiến thức chuyên môn 2024; Giải thưởng Giao sư xuất sắc cấp thành phố 2023.',
    achievements: [
      'Top 5% gia sư được đánh giá cao nhất nềền tảng 2025',
      'Hơn 120 học sinh đạt điểm Toán > 8 trong kỳ thi THPT 2024',
      'Giải thưởng Giao sư xuất sắc cấp thành phố Hà Nội 2023',
      'Tác giả bộ đề luyện thi Toán chất lượng cao (2024)',
      'Tham gia hội thảo Giáo dục Toán học Quốc tế 2024',
    ],
    teachingStyle: 'Giảng dạy theo phương pháp socratic — đặt câu hỏi dẫn dắt để học sinh tự khám phá. Kết hợp sơ đồ tư duy, bài tập tình huống thực tế và ôn thi có hệ thống.',
    availableTime: 'Thứ 2 - Thứ 6: 18:00 - 21:00\nThứ 7 - CN: 09:00 - 21:00',
    pricePerHour: 200000,
    subjects: [
      { subjectId: '1', subjectName: 'Toán', color: T.accent },
      { subjectId: '2', subjectName: 'Toán cao cấp', color: T.purple },
    ],
    languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (IELTS 7.0)'],
    education: 'Thạc sĩ Sư phạm Toán — ĐH Sư phạm Hà Nội (2022)\nCử nhân Sư phạm Toán — ĐH Sư phạm Hà Nội (2020)',
    experience: '5 năm giảng dạy tại trường THPT chuyên\n3 năm gia sư trực tuyến trên nềền tảng',
    reviews: [
      {
        id: 1,
        studentName: 'Nguyễn Hoàng Minh',
        studentAvatar: 'M',
        date: '2026-07-15',
        rating: 5,
        content: 'Cô Mai Anh giảng bài rất dễ hiểu, từ những bài khó nhất em cũng có thể nắm được. Nhờ cô mà điểm Toán của em tăng từ 5.5 lên 8.5 trong một học kỳ. Cô rất kiên nhẫn và luôn quan tâm đến từng học sinh.',
        subject: 'Toán',
      },
      {
        id: 2,
        studentName: 'Trần Đình Phong',
        studentAvatar: 'P',
        date: '2026-06-28',
        rating: 5,
        content: 'Tôi đã tìm được cô Mai Anh qua nềền tảng này cho con gái. Kết quả thi vào lớp 10 của con rất khả quan. Điểm đặc biệt là cô ấy hiểu tâm lý học sinh và biết cách tạo động lực.',
        subject: 'Toán',
      },
      {
        id: 3,
        studentName: 'Lê Thu Hà',
        studentAvatar: 'H',
        date: '2026-06-10',
        rating: 5,
        content: 'Cô giáo tuyệt vời! Trước đây em rất sợ Toán nhưng từ khi học với cô Mai Anh, em bắt đầu thích môn này. Cô có cách giảng thú vị, dùng nhiều ví dụ thực tế khiến bài học không còn khô khan.',
        subject: 'Toán',
      },
      {
        id: 4,
        studentName: 'Phạm Quang Huy',
        studentAvatar: 'H',
        date: '2026-05-22',
        rating: 4,
        content: 'Rất hài lòng với khóa học Toán cao cấp. Cô giáo nắm chắc kiến thức, giảng bài mạch lạc và có tài liệu ôn tập rất chất lượng. Một điểm trừ nhỏ là lịch hẹn đôi khi khó đặt vào cuối tuần.',
        subject: 'Toán cao cấp',
      },
    ],
    stats: {
      rating: 4.9,
      studentCount: 38,
      sessionCount: 312,
      responseTime: '< 1 giờ',
      completionRate: 98,
      yearsExperience: 5,
    },
    joinDate: '2026-07-20',
    avatar: 'MA',
    avatarColor: T.accent,
    status: 'Pending',
    isFeatured: true,
  },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────

const StarDisplay = ({ value }: { value: number }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 2,
    fontSize: 13, fontWeight: 500, color: T.orange,
    fontFamily: FONT,
  }}>
    <StarOutlined style={{ color: T.orange, fontSize: 12 }} />
    {value}
  </span>
);

const SectionTitle = ({
  icon, title, subtitle,
}: {
  icon: React.ReactNode; title: string; subtitle?: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: subtitle ? 6 : 0 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: T.accentLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: T.accent, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <h2 style={{
        margin: 0, fontSize: 15, fontWeight: 500,
        fontFamily: FONT, color: T.text, letterSpacing: '-0.2px',
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          margin: 0, fontSize: 12, color: T.textSubtle,
          fontFamily: FONT, fontWeight: 400,
        }}>{subtitle}</p>
      )}
    </div>
  </div>
);

const InfoGrid = ({ items }: {
  items: Array<{
    icon: React.ReactNode; label: string; value: string; color?: string;
  }>;
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${item.color || T.accent}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: item.color || T.accent, flexShrink: 0,
        }}>
          {item.icon}
        </div>
        <div>
          <div style={{
            fontSize: 10, color: T.textSubtle,
            fontFamily: FONT, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3,
          }}>{item.label}</div>
          <div style={{
            fontSize: 13, color: T.textMuted,
            fontFamily: FONT, fontWeight: 400, lineHeight: 1.4,
          }}>{item.value}</div>
        </div>
      </div>
    ))}
  </div>
);

const InfoList = ({ items }: {
  items: Array<{
    icon: React.ReactNode; label: string; value: string; color?: string;
  }>;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
    {items.map((item, i) => (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 0',
        borderBottom: i < items.length - 1 ? `1px solid ${T.borderLight}` : 'none',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${item.color || T.accent}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: item.color || T.accent, flexShrink: 0,
        }}>
          {item.icon}
        </div>
        <div style={{
          fontSize: 13, color: T.text,
          fontFamily: FONT, fontWeight: 500,
        }}>{item.value}</div>
      </div>
    ))}
  </div>
);

const ReviewCard = ({
  review,
}: {
  review: (typeof MOCK_TUTORS)[0]['reviews'][0];
}) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 14, padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 12,
    transition: 'box-shadow 0.2s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: T.accentLight, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500, color: T.accent,
          fontFamily: FONT, flexShrink: 0,
        }}>
          {review.studentAvatar}
        </div>
        <div>
          <div style={{
            fontSize: 13, fontWeight: 500, color: T.text,
            fontFamily: FONT,
          }}>{review.studentName}</div>
          <div style={{
            fontSize: 11, color: T.textSubtle, fontFamily: FONT, fontWeight: 400,
          }}>{review.subject} · {dayjs(review.date).format('MMM YYYY')}</div>
        </div>
      </div>
      <StarDisplay value={review.rating} />
    </div>
    <p style={{
      margin: 0, fontSize: 13, color: T.textMuted,
      fontFamily: FONT, fontWeight: 400, lineHeight: 1.65,
    }}>
      {review.content}
    </p>
  </div>
);

const Card = ({
  children, delay = 0,
}: {
  children: React.ReactNode; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: '22px 26px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    {children}
  </motion.div>
);

// ─── TutorDetail Page ──────────────────────────────────────────────────────────
const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const tutor = MOCK_TUTORS.find(t => t.id === id);

  if (!tutor) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 400, gap: 16,
        background: T.bg,
      }}>
        <SafetyOutlined style={{ fontSize: 48, color: T.textSubtle }} />
        <h2 style={{
          margin: 0, fontSize: 18, fontWeight: 500,
          fontFamily: FONT, color: T.text,
        }}>Không tìm thấy gia sư</h2>
        <p style={{
          margin: 0, fontSize: 13, color: T.textSubtle, fontFamily: FONT,
          fontWeight: 400,
        }}>Hồ sơ gia sư này không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 8, padding: '9px 22px', borderRadius: 10,
            background: T.accent, color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 500, fontFamily: FONT, cursor: 'pointer',
          }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const qualList = tutor.qualifications.split(';').map(q => q.trim()).filter(Boolean);

  return (
    <div style={{ fontFamily: FONT, color: T.text, width: '100%' }}>

      {/* ── Top Nav Bar ────────────────────────────────────────────── */}
      <div style={{
        background: T.card,
        borderBottom: `1px solid ${T.border}`,
        padding: '12px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 10,
            background: T.card, color: T.textMuted,
            border: `1px solid ${T.border}`,
            fontSize: 13, fontWeight: 500, fontFamily: FONT,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: 12 }} />
          Quay lại danh sách
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag color="orange" style={{
            borderRadius: 9999, fontFamily: FONT, fontSize: 12,
            fontWeight: 500, padding: '2px 12px',
          }}>
            Chờ duyệt
          </Tag>
        </div>
      </div>

      {/* ── Page Content ───────────────────────────────────────────── */}
      <div style={{ padding: '24px 28px' }}>

        {/* ══ SECTION 1: Hero Banner ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: '28px 32px 26px',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28 }}>

            {/* Avatar */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 20,
                background: T.accentLight,
                border: `2px solid ${T.accent}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 500, color: T.accent,
                fontFamily: FONT,
              }}>
                {tutor.avatar}
              </div>
              {tutor.isFeatured && (
                <Tag color="gold" style={{
                  display: 'block', textAlign: 'center', marginTop: 8,
                  borderRadius: 9999, fontFamily: FONT, fontSize: 10,
                  fontWeight: 500,
                }}>
                  Nổi bật
                </Tag>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{
                  margin: 0, fontSize: 24, fontWeight: 500,
                  fontFamily: FONT, color: T.text,
                  letterSpacing: '-0.3px', lineHeight: 1.15,
                }}>
                  {tutor.fullName}
                </h1>
              </div>

              <p style={{
                margin: '0 0 14px', fontSize: 14, color: T.textMuted,
                fontFamily: FONT, fontWeight: 400, lineHeight: 1.6,
                maxWidth: 800,
              }}>
                {tutor.bio}
              </p>

              {/* Subjects */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {tutor.subjects.map(s => (
                  <Tag
                    key={s.subjectId}
                    color={s.color === T.accent ? 'blue' : 'purple'}
                    style={{
                      borderRadius: 9999, fontFamily: FONT, fontSize: 12,
                      fontWeight: 500, padding: '2px 12px',
                    }}
                  >
                    {s.subjectName}
                  </Tag>
                ))}
              </div>

              {/* Contact row */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: <MailOutlined style={{ fontSize: 12 }} />, text: tutor.email, color: T.accent },
                  { icon: <PhoneOutlined style={{ fontSize: 12 }} />, text: tutor.phone, color: T.green },
                  { icon: <GlobalOutlined style={{ fontSize: 12 }} />, text: tutor.website, color: T.orange },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12.5, color: T.textSubtle, fontFamily: FONT, fontWeight: 400,
                  }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ SECTION 2: Stats Row ═════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 10, marginBottom: 12,
          }}
        >
          {[
            { label: 'Điểm uy tín', value: `★ ${tutor.stats.rating}`, color: T.orange },
            { label: 'Học sinh', value: `${tutor.stats.studentCount}+`, color: T.accent },
            { label: 'Buổi dạy', value: `${tutor.stats.sessionCount}+`, color: T.green },
            { label: 'Tỷ lệ hoàn thành', value: `${tutor.stats.completionRate}%`, color: T.purple },
            { label: 'Kinh nghiệm', value: `${tutor.stats.yearsExperience}y`, color: T.orange },
            { label: 'Phản hồi', value: tutor.stats.responseTime, color: T.green },
          ].map(item => (
            <div key={item.label} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${item.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color, flexShrink: 0,
              }}>
                {item.label.includes('uy tín') && <StarOutlined style={{ fontSize: 14 }} />}
                {item.label.includes('Học sinh') && <TeamOutlined style={{ fontSize: 14 }} />}
                {item.label.includes('Buổi') && <BookOutlined style={{ fontSize: 14 }} />}
                {item.label.includes('Tỷ lệ') && <CheckOutlined style={{ fontSize: 14 }} />}
                {item.label.includes('Kinh') && <TrophyOutlined style={{ fontSize: 14 }} />}
                {item.label.includes('Phản') && <ClockCircleOutlined style={{ fontSize: 14 }} />}
              </div>
              <div>
                <div style={{
                  fontSize: 18, fontWeight: 500, color: T.text,
                  fontFamily: FONT, letterSpacing: '-0.3px', lineHeight: 1,
                }}>{item.value}</div>
                <div style={{
                  fontSize: 11, color: T.textSubtle,
                  fontFamily: FONT, fontWeight: 400, marginTop: 3,
                }}>{item.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ══ SECTION 3: Main 2-col layout ════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, alignItems: 'start' }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* About */}
            <Card delay={0.08}>
              <SectionTitle
                icon={<UserOutlined style={{ fontSize: 14 }} />}
                title="Giới thiệu"
                subtitle="Tìm hiểu thêm về phong cách giảng dạy và kinh nghiệm"
              />
              <div style={{ marginTop: 16 }}>
                {tutor.longBio.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    margin: i === 0 ? 0 : '12px 0 0',
                    fontSize: 13.5, color: T.textMuted,
                    fontFamily: FONT, fontWeight: 400, lineHeight: 1.75,
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </Card>

            {/* Teaching Style */}
            <Card delay={0.1}>
              <SectionTitle
                icon={<AimOutlined style={{ fontSize: 14 }} />}
                title="Phong cách giảng dạy"
              />
              <div style={{
                marginTop: 14, padding: '14px 18px', borderRadius: 12,
                background: T.accentLight,
                border: `1px solid ${T.accent}12`,
              }}>
                <p style={{
                  margin: 0, fontSize: 13.5, color: T.textMuted,
                  fontFamily: FONT, fontWeight: 400, lineHeight: 1.7,
                }}>
                  {tutor.teachingStyle}
                </p>
              </div>
            </Card>

            {/* Education & Experience */}
            <Card delay={0.12}>
              <SectionTitle
                icon={<BookOutlined style={{ fontSize: 14 }} />}
                title="Học vấn & Kinh nghiệm"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 14 }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 500, color: T.textSubtle,
                    fontFamily: FONT, textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: 10,
                  }}>Học vấn</div>
                  {tutor.education.split('\n').map((edu, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: T.accent, marginTop: 6, flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 13, color: T.textMuted, fontFamily: FONT,
                        fontWeight: 400, lineHeight: 1.5,
                      }}>{edu}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${T.borderLight}`, paddingTop: 18 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 500, color: T.textSubtle,
                    fontFamily: FONT, textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: 10,
                  }}>Kinh nghiệm</div>
                  {tutor.experience.split('\n').map((exp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: T.green, marginTop: 6, flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 13, color: T.textMuted, fontFamily: FONT,
                        fontWeight: 400, lineHeight: 1.5,
                      }}>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Certificates */}
            <Card delay={0.14}>
              <SectionTitle
                icon={<SafetyOutlined style={{ fontSize: 14 }} />}
                title="Chứng chỉ & Danh hiệu"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                {qualList.map((qual, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '11px 14px', borderRadius: 12,
                    background: T.greenLight, border: `1px solid ${T.green}14`,
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: `${T.green}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: T.green, flexShrink: 0, marginTop: 1,
                    }}>
                      <CheckOutlined style={{ fontSize: 10 }} />
                    </div>
                    <span style={{
                      fontSize: 13, color: T.textMuted, fontFamily: FONT,
                      fontWeight: 400, lineHeight: 1.5,
                    }}>{qual}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card delay={0.16}>
              <SectionTitle
                icon={<TrophyOutlined style={{ fontSize: 14 }} />}
                title="Thành tích nổi bật"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                {tutor.achievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: T.orange, marginTop: 6, flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 13, color: T.textMuted, fontFamily: FONT,
                      fontWeight: 400, lineHeight: 1.55,
                    }}>{ach}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card delay={0.18}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <SectionTitle
                  icon={<StarOutlined style={{ fontSize: 14 }} />}
                  title="Đánh giá từ học sinh"
                  subtitle={`${tutor.reviews.length} đánh giá`}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: 22, fontWeight: 500, color: T.text,
                    fontFamily: FONT, letterSpacing: '-0.3px',
                  }}>{tutor.stats.rating}</span>
                  <StarDisplay value={tutor.stats.rating} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tutor.reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </Card>

          </div>

          {/* ── RIGHT COLUMN (sticky sidebar) ──────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 80 }}>

            {/* Pricing Card */}
            <Card delay={0.08}>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{
                  fontSize: 11, color: T.textSubtle, fontFamily: FONT,
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px',
                  marginBottom: 6,
                }}>Học phí theo giờ</div>
                <div style={{
                  fontSize: 34, fontWeight: 500, color: T.text,
                  fontFamily: FONT, letterSpacing: '-0.8px', lineHeight: 1,
                }}>
                  {tutor.pricePerHour.toLocaleString('vi-VN')}
                  <span style={{ fontSize: 15, fontWeight: 400, color: T.textSubtle }}>đ</span>
                </div>
                <div style={{
                  fontSize: 12, color: T.textSubtle, fontFamily: FONT,
                  fontWeight: 400, marginTop: 4,
                }}>/ buổi 90 phút</div>
              </div>

              {tutor.status === 'Pending' ? (
                <>
                  <div style={{
                    padding: '10px 14px', borderRadius: 12, marginBottom: 14,
                    background: T.orangeLight, border: `1px solid ${T.orange}18`,
                    fontSize: 12, color: T.orange, fontFamily: FONT, fontWeight: 500,
                    textAlign: 'center',
                  }}>
                    Hồ sơ đang chờ admin duyệt
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={() => navigate('/admin/tutors/pending')}
                      style={{
                        width: '100%', padding: '11px', borderRadius: 12,
                        background: T.green, color: '#fff', border: 'none',
                        fontSize: 13.5, fontWeight: 500, fontFamily: FONT,
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <CheckOutlined style={{ fontSize: 13 }} />
                      Duyệt gia sư
                    </button>
                    <button
                      onClick={() => navigate('/admin/tutors/pending')}
                      style={{
                        width: '100%', padding: '11px', borderRadius: 12,
                        background: T.card, color: T.red,
                        border: `1px solid ${T.border}`,
                        fontSize: 13.5, fontWeight: 500, fontFamily: FONT,
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <CloseOutlined style={{ fontSize: 13 }} />
                      Từ chối hồ sơ
                    </button>
                  </div>
                </>
              ) : (
                <button
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: T.accent, color: '#fff', border: 'none',
                    fontSize: 13.5, fontWeight: 500, fontFamily: FONT,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <CalendarOutlined style={{ fontSize: 13 }} />
                  Đặt lịch học thử
                </button>
              )}
            </Card>

            {/* Contact Info */}
            <Card delay={0.11}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: T.text,
                fontFamily: FONT, marginBottom: 16, letterSpacing: '-0.1px',
              }}>Thông tin liên hệ</div>
              <InfoList items={[
                { icon: <MailOutlined style={{ fontSize: 13 }} />, label: 'Email', value: tutor.email, color: T.accent },
                { icon: <PhoneOutlined style={{ fontSize: 13 }} />, label: 'Điện thoại', value: tutor.phone, color: T.green },
                { icon: <GlobalOutlined style={{ fontSize: 13 }} />, label: 'Website', value: tutor.website, color: T.orange },
                { icon: <CalendarOutlined style={{ fontSize: 13 }} />, label: 'Ngày tham gia', value: dayjs(tutor.joinDate).format('DD/MM/YYYY'), color: T.purple },
              ]} />
            </Card>

            {/* Availability */}
            <Card delay={0.14}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: T.text,
                fontFamily: FONT, marginBottom: 14, letterSpacing: '-0.1px',
              }}>Lịch trống có thể đặt</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tutor.availableTime.split('\n').map((line, i) => {
                  const [day, ...rest] = line.split(':');
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 12,
                      background: T.greenLight, border: `1px solid ${T.green}14`,
                    }}>
                      <ClockCircleOutlined style={{ fontSize: 13, color: T.green }} />
                      <span style={{
                        fontSize: 12, fontWeight: 500, color: T.green,
                        fontFamily: FONT, minWidth: 100,
                      }}>{day}:</span>
                      <span style={{
                        fontSize: 12, color: T.textMuted, fontFamily: FONT, fontWeight: 400,
                      }}>{rest.join(':').trim()}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Languages */}
            <Card delay={0.17}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: T.text,
                fontFamily: FONT, marginBottom: 14, letterSpacing: '-0.1px',
              }}>Ngôn ngữ giảng dạy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tutor.languages.map((lang, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', borderRadius: 10,
                    background: '#f8f9fa',
                    border: `1px solid ${T.border}`,
                  }}>
                    <GlobalOutlined style={{ fontSize: 13, color: T.accent }} />
                    <span style={{
                      fontSize: 13, color: T.textMuted, fontFamily: FONT, fontWeight: 400,
                    }}>{lang}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subjects */}
            <Card delay={0.2}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: T.text,
                fontFamily: FONT, marginBottom: 14, letterSpacing: '-0.1px',
              }}>Môn giảng dạy</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tutor.subjects.map(s => (
                  <Tag
                    key={s.subjectId}
                    color={s.color === T.accent ? 'blue' : 'purple'}
                    style={{
                      borderRadius: 9999, fontFamily: FONT, fontSize: 12,
                      fontWeight: 500, padding: '2px 12px',
                    }}
                  >
                    {s.subjectName}
                  </Tag>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;
