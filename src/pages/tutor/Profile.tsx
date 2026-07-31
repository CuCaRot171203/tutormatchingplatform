import React, { useState } from 'react';
import {
  Card, Row, Col, Avatar, Form, Input, Button, Tag, Divider,
  Typography, message, Select, InputNumber, Upload, UploadProps,
} from 'antd';
import {
  UserOutlined, EditOutlined, CameraOutlined, DeleteOutlined,
  CheckCircleOutlined, ClockCircleOutlined, SaveOutlined,
} from '@ant-design/icons';
import { mockTutorProfile, SUBJECTS } from '../../data/tutorMockData';
import { StatusBadge } from '../../components/common';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  yellow: '#f59e0b', blue: '#3b82f6', red: '#dc2626', redLight: 'rgba(220,38,38,0.08)',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '24px',
};

const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 });

interface SubjectEntry {
  subjectId: number;
  subjectName: string;
  hourlyRate: number;
}

const TutorProfile: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [subjects, setSubjects] = useState<SubjectEntry[]>(mockTutorProfile.subjects.map(s => ({
    subjectId: s.subjectId,
    subjectName: s.subjectName,
    hourlyRate: s.hourlyRate,
  })));
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [newSubject, setNewSubject] = useState<{ subjectId: number | null; hourlyRate: number }>({ subjectId: null, hourlyRate: 0 });
  const [saving, setSaving] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const availableSubjects = SUBJECTS.filter(
    s => !subjects.find(sub => sub.subjectId === s.id)
  );

  const handleSaveProfile = (values: any) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditProfile(false);
      message.success('Cập nhật hồ sơ thành công!');
    }, 800);
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
    setSubjects([...subjects, { subjectId: sub.id, subjectName: sub.name, hourlyRate: newSubject.hourlyRate }]);
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

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Hồ sơ gia sư</h1>
        <Text type="secondary">Quản lý thông tin và môn học của bạn</Text>
      </div>

      <Row gutter={[16, 16]}>

        {/* Left Column - Profile Card */}
        <Col xs={24} lg={7}>
          <div style={CARD_STYLE}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar size={120} style={{ backgroundColor: T.primary, fontSize: 40, fontWeight: 600, cursor: 'pointer' }}>
                  {mockTutorProfile.fullName[0]}
                </Avatar>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 32, height: 32, borderRadius: '50%',
                  background: T.primary, border: '3px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', fontSize: 14,
                }}>
                  <CameraOutlined />
                </div>
              </div>
              <Title level={4} style={{ margin: '12px 0 4px', fontWeight: 700 }}>{mockTutorProfile.fullName}</Title>
              <Text type="secondary">{mockTutorProfile.email}</Text>
              <div style={{ marginTop: 10 }}>
                {mockTutorProfile.status === 'Approved' ? (
                  <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
                    Đã xác minh
                  </Tag>
                ) : (
                  <Tag icon={<ClockCircleOutlined />} color="warning" style={{ borderRadius: 20, fontWeight: 600 }}>
                    Đang chờ duyệt
                  </Tag>
                )}
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Điểm uy tín', value: `${mockTutorProfile.reputationScore}/5`, color: T.yellow },
                { label: 'Số môn học', value: `${subjects.length} môn`, color: T.primary },
                { label: 'Số năm kinh nghiệm', value: '5 năm', color: T.green },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                    <Text strong style={{ fontSize: 14 }}>{item.value}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Right Column - Forms */}
        <Col xs={24} lg={17}>

          {/* Profile Info */}
          <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Thông tin cá nhân</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>Họ và tên, giới thiệu, trình độ</Text>
              </div>
              {!editProfile && (
                <Button icon={<EditOutlined />} onClick={() => {
                  profileForm.setFieldsValue({
                    fullName: mockTutorProfile.fullName,
                    bio: mockTutorProfile.bio,
                    qualifications: mockTutorProfile.qualifications,
                  });
                  setEditProfile(true);
                }} style={{ borderRadius: 10 }}>
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {editProfile ? (
              <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile}>
                <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                  <Input size="large" style={{ borderRadius: 10 }} />
                </Form.Item>
                <Form.Item label="Giới thiệu (Bio)" name="bio">
                  <TextArea rows={3} placeholder="Viết vài dòng giới thiệu về bản thân..." style={{ borderRadius: 10 }} />
                </Form.Item>
                <Form.Item label="Trình độ & Kinh nghiệm" name="qualifications">
                  <TextArea rows={3} placeholder="Mô tả trình độ học vấn, kinh nghiệm giảng dạy..." style={{ borderRadius: 10 }} />
                </Form.Item>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button onClick={() => setEditProfile(false)} style={{ borderRadius: 10 }}>Hủy</Button>
                  <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}
                    style={{ borderRadius: 10, background: T.primary }}>
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: T.primaryLight, borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Họ và tên</Text>
                  <Text strong style={{ fontSize: 14 }}>{mockTutorProfile.fullName}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Giới thiệu</Text>
                  <Paragraph style={{ color: T.textMuted, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                    {mockTutorProfile.bio}
                  </Paragraph>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Trình độ & Kinh nghiệm</Text>
                  <Paragraph style={{ color: T.textMuted, margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {mockTutorProfile.qualifications}
                  </Paragraph>
                </div>
              </div>
            )}
          </div>

          {/* Subjects */}
          <div style={CARD_STYLE}>
            <div style={{ marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Môn học & Học phí</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>Quản lý danh sách môn bạn có thể dạy</Text>
            </div>

            {/* Add subject form */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-end',
              padding: '14px 16px', background: T.primaryLight, borderRadius: 12, marginBottom: 16,
            }}>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: T.textMuted, display: 'block', marginBottom: 4 }}>Chọn môn học</Text>
                <Select
                  placeholder="-- Chọn môn --"
                  style={{ width: '100%' }}
                  size="large"
                  value={newSubject.subjectId}
                  onChange={v => setNewSubject({ ...newSubject, subjectId: v })}
                >
                  {availableSubjects.map(s => (
                    <Option key={s.id} value={s.id}>{s.name}</Option>
                  ))}
                </Select>
              </div>
              <div style={{ width: 160 }}>
                <Text style={{ fontSize: 12, color: T.textMuted, display: 'block', marginBottom: 4 }}>Học phí/giờ (VNĐ)</Text>
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
              <Button type="primary" size="large" onClick={handleAddSubject} style={{ borderRadius: 10, background: T.primary }}>
                Thêm môn
              </Button>
            </div>

            {/* Subject list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjects.map(sub => (
                <div key={sub.subjectId} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: editingSubjectId === sub.subjectId ? T.primaryLight : 'rgba(0,0,0,0.02)',
                  borderRadius: 10, border: `1px solid ${editingSubjectId === sub.subjectId ? T.primary : T.border}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${T.primary}15`, color: T.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700,
                    }}>
                      {sub.subjectName[0]}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 14 }}>{sub.subjectName}</Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {editingSubjectId === sub.subjectId ? (
                      <>
                        <InputNumber
                          size="small"
                          value={editRate}
                          onChange={v => setEditRate(v || 0)}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/,/g, '') as unknown as number}
                          style={{ width: 130 }}
                        />
                        <Button size="small" type="primary" icon={<CheckCircleOutlined />}
                          onClick={handleSaveEditSubject}
                          style={{ borderRadius: 8, background: T.primary }} />
                        <Button size="small" onClick={() => setEditingSubjectId(null)} style={{ borderRadius: 8 }}>Hủy</Button>
                      </>
                    ) : (
                      <>
                        <div style={{
                          padding: '4px 12px', borderRadius: 20,
                          background: T.greenLight, color: T.green,
                          fontWeight: 700, fontSize: 14,
                        }}>
                          {fmtVnd(sub.hourlyRate)}/giờ
                        </div>
                        <Button size="small" icon={<EditOutlined />} onClick={() => handleEditSubject(sub.subjectId)}
                          style={{ borderRadius: 8 }} />
                        <Button size="small" danger icon={<DeleteOutlined />}
                          onClick={() => handleRemoveSubject(sub.subjectId)}
                          style={{ borderRadius: 8 }} />
                      </>
                    )}
                  </div>
                </div>
              ))}

              {subjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: T.textSubtle, fontSize: 13 }}>
                  Chưa có môn học nào. Thêm môn học bên trên.
                </div>
              )}
            </div>

            {subjects.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Button type="primary" block size="large" icon={<SaveOutlined />}
                  onClick={() => message.success('Đã lưu danh sách môn học!')}
                  style={{ borderRadius: 12, background: T.primary }}>
                  Lưu môn học
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TutorProfile;
