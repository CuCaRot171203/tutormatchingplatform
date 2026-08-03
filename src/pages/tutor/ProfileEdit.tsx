import React, { useState } from 'react';
import {
  Row, Col, Avatar, Form, Input, Button, Divider,
  Select, InputNumber, App, message,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  CameraOutlined, EditOutlined, SaveOutlined, DeleteOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { mockTutorProfile, SUBJECTS } from '../../data/tutorMockData';

const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.14)',
  primaryDark: '#0052cc',
  ink: '#1d1d1f',
  inkMuted80: '#333333',
  inkMuted48: '#7a7a7a',
  dividerSoft: '#f0f0f0',
  hairline: '#e0e0e0',
  canvas: '#ffffff',
  parchment: '#f5f5f7',
  pearl: '#fafafc',
  green: '#149e61',
  greenLight: 'rgba(20, 158, 97, 0.08)',
  red: '#dc2626',
  redLight: 'rgba(220, 38, 38, 0.08)',
  orange: '#d97706',
  orangeLight: 'rgba(217, 119, 6, 0.08)',
  yellow: '#f59e0b',
};

const pillBtnPrimary: React.CSSProperties = {
  background: T.primary,
  color: '#fff',
  border: 'none',
  borderRadius: 9999,
  padding: '10px 22px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
  letterSpacing: '-0.224px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  color: T.inkMuted80,
  border: `1px solid ${T.hairline}`,
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
  cursor: 'pointer',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.canvas,
  border: `1px solid ${T.dividerSoft}`,
  borderRadius: 18,
  padding: '28px 28px',
};

const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 });

interface SubjectEntry {
  subjectId: number;
  subjectName: string;
  hourlyRate: number;
}

const TutorProfileEdit: React.FC = () => {
  const { notification } = App.useApp();
  const [profileForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(mockTutorProfile.avatarUrl);

  const [subjects, setSubjects] = useState<SubjectEntry[]>(
    mockTutorProfile.subjects.map(s => ({
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      hourlyRate: s.hourlyRate,
    }))
  );
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [newSubject, setNewSubject] = useState<{ subjectId: number | null; hourlyRate: number }>({
    subjectId: null,
    hourlyRate: 0,
  });

  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const availableSubjects = SUBJECTS.filter(s => !subjects.find(sub => sub.subjectId === s.id));

  const avatarInitials = mockTutorProfile.fullName[0];

  const handleAvatarChange: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const url = URL.createObjectURL(fileList[0].originFileObj);
      setAvatarUrl(url);
      message.success('Đã cập nhật ảnh đại diện!');
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setEditProfile(false);
    notification.success({
      message: 'Lưu hồ sơ thành công!',
      description: 'Thông tin cá nhân đã được cập nhật.',
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleAddSubject = () => {
    if (!newSubject.subjectId || !newSubject.hourlyRate) {
      message.warning('Vui lòng chọn môn và nhập học phí!');
      return;
    }
    if (subjects.find(s => s.subjectId === newSubject.subjectId)) {
      message.warning('Môn học đã tồn tại!');
      return;
    }
    const sub = SUBJECTS.find(s => s.id === newSubject.subjectId)!;
    setSubjects([...subjects, {
      subjectId: sub.id,
      subjectName: sub.name,
      hourlyRate: newSubject.hourlyRate,
    }]);
    setNewSubject({ subjectId: null, hourlyRate: 0 });
    message.success('Đã thêm môn học!');
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.subjectId !== id));
    message.success('Đã xóa môn học!');
  };

  const handleEditSubject = (id: number) => {
    const sub = subjects.find(s => s.subjectId === id);
    if (sub) {
      setEditingSubjectId(id);
      setEditRate(sub.hourlyRate);
    }
  };

  const handleSaveEditSubject = () => {
    if (!editingSubjectId) return;
    setSubjects(subjects.map(s =>
      s.subjectId === editingSubjectId ? { ...s, hourlyRate: editRate } : s
    ));
    setEditingSubjectId(null);
    setEditRate(0);
    message.success('Đã cập nhật học phí!');
  };

  const handleSaveSubjects = async () => {
    if (subjects.length === 0) {
      message.warning('Vui lòng thêm ít nhất 1 môn học!');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    notification.success({
      message: 'Lưu môn học thành công!',
      description: `Danh sách ${subjects.length} môn học đã được cập nhật.`,
      placement: 'topRight',
      duration: 3,
    });
  };

  return (
    <div style={{
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
    }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{
          fontSize: 22,
          fontWeight: 500,
          color: T.ink,
          margin: '0 0 4px',
          letterSpacing: '-0.28px',
          fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
        }}>
          Chỉnh sửa hồ sơ gia sư
        </h1>
        <p style={{
          fontSize: 12,
          color: T.inkMuted48,
          margin: 0,
          letterSpacing: '-0.12px',
        }}>
          Cập nhật thông tin cá nhân, môn học và học phí của bạn
        </p>
      </motion.div>

      <Row gutter={[16, 16]}>
        {/* Left Column — Profile Card */}
        <Col xs={24} lg={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={108}
                  src={avatarUrl}
                  style={{
                    backgroundColor: T.primary,
                    fontSize: 36,
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '3px solid #fff',
                    boxShadow: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0',
                  }}
                >
                  {avatarInitials}
                </Avatar>
                <label style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: T.primary,
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  boxShadow: '0 2px 8px rgba(0, 98, 255, 0.3)',
                }}>
                  <CameraOutlined />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setAvatarUrl(url);
                        message.success('Đã cập nhật ảnh đại diện!');
                      }
                    }}
                  />
                </label>
              </div>
              <h2 style={{
                margin: '12px 0 4px',
                fontSize: 17,
                fontWeight: 500,
                color: T.ink,
                letterSpacing: '-0.374px',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}>
                {mockTutorProfile.fullName}
              </h2>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: '0 0 10px',
                letterSpacing: '-0.12px',
              }}>
                {mockTutorProfile.email}
              </p>
              <div>
                {mockTutorProfile.status === 'Approved' ? (
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 9999,
                    background: T.greenLight,
                    color: T.green,
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'SF Pro Text', sans-serif",
                    letterSpacing: '-0.12px',
                  }}>
                    <CheckCircleOutlined style={{ marginRight: 4, fontSize: 11 }} />
                    Đã xác minh
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 9999,
                    background: T.orangeLight,
                    color: T.orange,
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'SF Pro Text', sans-serif",
                    letterSpacing: '-0.12px',
                  }}>
                    <ClockCircleOutlined style={{ marginRight: 4, fontSize: 11 }} />
                    Đang chờ duyệt
                  </span>
                )}
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Điểm uy tín', value: `${mockTutorProfile.reputationScore}/5`, accent: T.yellow },
                { label: 'Số môn học', value: `${subjects.length} môn`, accent: T.primary },
                { label: 'Số năm kinh nghiệm', value: `${mockTutorProfile.yearsExperience || 5} năm`, accent: T.green },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: T.parchment,
                  borderRadius: 8,
                }}>
                  <span style={{
                    fontSize: 12,
                    color: T.inkMuted48,
                    letterSpacing: '-0.12px',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: item.accent,
                    letterSpacing: '-0.12px',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <Divider style={{ margin: '20px 0 16px' }} />

            <p style={{
              fontSize: 11,
              color: T.inkMuted48,
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.08px',
            }}>
              Nhấn biểu tượng camera để thay ảnh đại diện
            </p>
          </motion.div>
        </Col>

        {/* Right Column — Forms */}
        <Col xs={24} lg={17}>
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, marginBottom: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  color: T.ink,
                  letterSpacing: '-0.224px',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                }}>
                  Thông tin cá nhân
                </h3>
                <p style={{
                  fontSize: 12,
                  color: T.inkMuted48,
                  margin: '3px 0 0',
                  letterSpacing: '-0.12px',
                }}>
                  Họ và tên, giới thiệu, trình độ
                </p>
              </div>
              {!editProfile && (
                <button
                  onClick={() => {
                    profileForm.setFieldsValue({
                      fullName: mockTutorProfile.fullName,
                      bio: mockTutorProfile.bio,
                      qualifications: mockTutorProfile.qualifications,
                    });
                    setEditProfile(true);
                  }}
                  style={{
                    ...ghostBtn,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <EditOutlined style={{ fontSize: 12 }} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {editProfile ? (
              <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
                <Form.Item
                  label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Họ và tên</span>}
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  style={{ marginBottom: 16 }}
                >
                  <Input size="large" style={{ borderRadius: 11, fontSize: 14 }} />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Giới thiệu (Bio)</span>}
                  name="bio"
                  rules={[{ required: true, message: 'Vui lòng nhập giới thiệu!' }]}
                  style={{ marginBottom: 16 }}
                >
                  <Input.TextArea rows={3} placeholder="Viết vài dòng giới thiệu về bản thân, phương pháp giảng dạy..." style={{ borderRadius: 11, fontSize: 14 }} />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Trình độ & Kinh nghiệm</span>}
                  name="qualifications"
                  style={{ marginBottom: 20 }}
                >
                  <Input.TextArea rows={3} placeholder="Mô tả trình độ học vấn, kinh nghiệm giảng dạy, thành tựu..." style={{ borderRadius: 11, fontSize: 14 }} />
                </Form.Item>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    style={ghostBtn}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    onClick={() => setEditProfile(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...pillBtnPrimary,
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >
                    <SaveOutlined style={{ fontSize: 12 }} />
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </Form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  padding: '12px 16px',
                  background: T.primaryLight,
                  borderRadius: 11,
                  border: `1px solid ${T.primaryBorder}`,
                }}>
                  <p style={{ fontSize: 11, color: T.inkMuted48, margin: '0 0 3px', letterSpacing: '-0.08px' }}>Họ và tên</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: T.ink, margin: 0, letterSpacing: '-0.224px' }}>{mockTutorProfile.fullName}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: T.inkMuted48, margin: '0 0 6px', letterSpacing: '-0.08px' }}>Giới thiệu</p>
                  <p style={{ fontSize: 13, color: T.inkMuted80, lineHeight: 1.6, margin: 0, letterSpacing: '-0.12px' }}>{mockTutorProfile.bio}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: T.inkMuted48, margin: '0 0 6px', letterSpacing: '-0.08px' }}>Trình độ & Kinh nghiệm</p>
                  <p style={{ fontSize: 13, color: T.inkMuted80, lineHeight: 1.6, margin: 0, letterSpacing: '-0.12px', whiteSpace: 'pre-line' }}>{mockTutorProfile.qualifications}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Subjects Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{ marginBottom: 22 }}>
              <h3 style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                color: T.ink,
                letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}>
                Môn học & Học phí
              </h3>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: '3px 0 0',
                letterSpacing: '-0.12px',
              }}>
                Quản lý danh sách môn bạn có thể dạy và học phí theo giờ
              </p>
            </div>

            {/* Add subject form */}
            <div style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
              padding: '14px 16px',
              background: T.primaryLight,
              borderRadius: 12,
              marginBottom: 16,
              border: `1px solid ${T.primaryBorder}`,
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: T.inkMuted48, margin: '0 0 4px', letterSpacing: '-0.08px' }}>Chọn môn học</p>
                <Select
                  placeholder="-- Chọn môn --"
                  style={{ width: '100%' }}
                  size="large"
                  value={newSubject.subjectId}
                  onChange={v => setNewSubject({ ...newSubject, subjectId: v })}
                >
                  {availableSubjects.map(s => (
                    <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                  ))}
                </Select>
              </div>
              <div style={{ width: 160 }}>
                <p style={{ fontSize: 11, color: T.inkMuted48, margin: '0 0 4px', letterSpacing: '-0.08px' }}>Học phí/giờ (VNĐ)</p>
                <InputNumber
                  size="large"
                  placeholder="100.000"
                  min={10000}
                  step={10000}
                  value={newSubject.hourlyRate}
                  onChange={v => setNewSubject({ ...newSubject, hourlyRate: v || 0 })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/,/g, '') as unknown as number}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                onClick={handleAddSubject}
                style={pillBtnPrimary}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                Thêm môn
              </button>
            </div>

            {/* Subject list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subjects.map(sub => (
                <div
                  key={sub.subjectId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: editingSubjectId === sub.subjectId ? T.primaryLight : T.parchment,
                    borderRadius: 11,
                    border: `1px solid ${editingSubjectId === sub.subjectId ? T.primaryBorder : T.dividerSoft}`,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36,
                      borderRadius: 10,
                      background: `${T.primary}15`,
                      color: T.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16, fontWeight: 500,
                    }}>
                      {sub.subjectName[0]}
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: 500,
                      color: T.ink,
                      letterSpacing: '-0.224px',
                    }}>
                      {sub.subjectName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {editingSubjectId === sub.subjectId ? (
                      <>
                        <InputNumber
                          size="small"
                          value={editRate}
                          onChange={v => setEditRate(v || 0)}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/,/g, '') as unknown as number}
                          style={{ width: 130, borderRadius: 8 }}
                        />
                        <button
                          onClick={handleSaveEditSubject}
                          style={{ ...pillBtnPrimary, padding: '6px 14px', fontSize: 11 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                        >
                          <CheckCircleOutlined style={{ fontSize: 11 }} />
                        </button>
                        <button
                          onClick={() => setEditingSubjectId(null)}
                          style={{ ...ghostBtn, padding: '6px 14px', fontSize: 11 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 9999,
                          background: T.greenLight,
                          color: T.green,
                          fontWeight: 500,
                          fontSize: 12,
                          letterSpacing: '-0.12px',
                        }}>
                          {fmtVnd(sub.hourlyRate)}/giờ
                        </span>
                        <button
                          onClick={() => handleEditSubject(sub.subjectId)}
                          style={{ ...ghostBtn, padding: '6px 10px', fontSize: 11 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          <EditOutlined style={{ fontSize: 11 }} />
                        </button>
                        <button
                          onClick={() => handleRemoveSubject(sub.subjectId)}
                          style={{
                            ...ghostBtn,
                            padding: '6px 10px',
                            fontSize: 11,
                            color: T.red,
                            borderColor: 'rgba(220,38,38,0.2)',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.redLight; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          <DeleteOutlined style={{ fontSize: 11 }} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {subjects.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '32px 0',
                  color: T.inkMuted48,
                  fontSize: 12,
                  letterSpacing: '-0.12px',
                }}>
                  Chưa có môn học nào. Thêm môn học bên trên.
                </div>
              )}
            </div>

            {subjects.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={handleSaveSubjects}
                  style={{
                    ...pillBtnPrimary,
                    width: '100%',
                    justifyContent: 'center',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                >
                  <SaveOutlined style={{ fontSize: 12 }} />
                  {loading ? 'Đang lưu...' : 'Lưu danh sách môn học'}
                </button>
              </div>
            )}
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default TutorProfileEdit;
