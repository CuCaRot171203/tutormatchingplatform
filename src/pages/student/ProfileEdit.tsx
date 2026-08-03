import React, { useState } from 'react';
import {
  Row, Col, Avatar, Form, Input, Button, Divider,
  Select, Upload, App, message, Tag,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  CameraOutlined, SaveOutlined,
  MailOutlined, BookOutlined, AimOutlined, UserOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { MOCK_USER, MOCK_SUBJECTS } from '../../data/mockData';

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
};

// Apple pill button styles (inline for demo  in production use CSS classes)
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
  transition: 'transform 0.15s ease',
};

const pillBtnSecondary: React.CSSProperties = {
  background: 'transparent',
  color: T.primary,
  border: `1px solid ${T.primary}`,
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
  transition: 'transform 0.15s ease',
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
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const CARD_STYLE: React.CSSProperties = {
  background: T.canvas,
  border: `1px solid ${T.dividerSoft}`,
  borderRadius: 18,
  padding: '28px 28px',
};

const StatusBadge: React.FC<{ status: 'Active' | 'Suspended' }> = ({ status }) => {
  const active = status === 'Active';
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 9999,
      backgroundColor: active ? T.greenLight : T.redLight,
      color: active ? T.green : T.red,
      fontSize: 12,
      fontWeight: 500,
      fontFamily: "'SF Pro Text', system-ui, sans-serif",
      letterSpacing: '-0.224px',
    }}>
      {active ? 'Ho¡t Ùng' : 'BË khóa'}
    </span>
  );
};

const StudentProfileEdit: React.FC = () => {
  const { notification } = App.useApp();
  const [profileForm] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(MOCK_USER.avatarUrl);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([1, 2, 5]);

  const subjectOptions = MOCK_SUBJECTS.map(s => ({
    value: s.id,
    label: s.name,
  }));

  const handleAvatarChange: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const url = URL.createObjectURL(fileList[0].originFileObj);
      setAvatarUrl(url);
      message.success('ã c­p nh­t £nh ¡i diÇn!');
    }
  };

  const handleSaveProfile = async (values: { fullName: string }) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    notification.success({
      message: 'L°u hÓ s¡ thành công!',
      description: 'Thông tin cá nhân cça b¡n ã °ãc c­p nh­t.',
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleSaveSubjects = async () => {
    if (selectedSubjects.length === 0) {
      message.warning('Vui lòng chÍn ít nh¥t 1 môn hÍc!');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    notification.success({
      message: 'ã l°u môn hÍc!',
      description: `B¡n ã chÍn ${selectedSubjects.length} môn hÍc quan tâm.`,
      placement: 'topRight',
      duration: 3,
    });
  };

  const handleSaveGoals = async (values: { studyGoals: string }) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    notification.success({
      message: 'ã l°u måc tiêu hÍc t­p!',
      description: 'Måc tiêu hÍc t­p cça b¡n ã °ãc c­p nh­t.',
      placement: 'topRight',
      duration: 3,
    });
  };

  const avatarInitials = MOCK_USER.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      maxWidth: 1100,
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
          ChÉnh sía hÓ s¡
        </h1>
        <p style={{
          fontSize: 12,
          color: T.inkMuted48,
          margin: 0,
          letterSpacing: '-0.12px',
        }}>
          C­p nh­t thông tin cá nhân, môn hÍc quan tâm và måc tiêu hÍc t­p
        </p>
      </motion.div>

      <Row gutter={[20, 20]}>
        {/* Left Column  Avatar Card */}
        <Col xs={24} lg={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  accept="image/*"
                >
                  <div style={{
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
                  </div>
                </Upload>
              </div>
              <h2 style={{
                margin: '14px 0 4px',
                fontSize: 17,
                fontWeight: 500,
                color: T.ink,
                letterSpacing: '-0.374px',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}>
                {MOCK_USER.fullName}
              </h2>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: '0 0 12px',
                letterSpacing: '-0.12px',
              }}>
                {MOCK_USER.email}
              </p>
              <div>
                <StatusBadge status={MOCK_USER.isSuspended ? 'Suspended' : 'Active'} />
              </div>
            </div>

            <Divider style={{ margin: '0 0 20px', borderColor: T.dividerSoft }} />

            {/* Quick Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'SÑ d° ví', value: `${MOCK_USER.creditBalance.toLocaleString('vi-VN')}`, accent: T.primary },
                { label: 'Tr¡ng thái', value: 'ã xác minh', accent: T.green },
                { label: 'Vai trò', value: 'HÍc sinh', accent: T.orange },
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

            <Divider style={{ margin: '20px 0' }} />

            <p style={{
              fontSize: 11,
              color: T.inkMuted48,
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.08px',
            }}>
              Nh¥n biÃu t°ãng camera Ã thay £nh ¡i diÇn
            </p>
          </motion.div>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={17}>
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, marginBottom: 16 }}
          >
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <UserOutlined style={{ color: T.primary, fontSize: 14 }} />
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
              </div>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: 0,
                letterSpacing: '-0.12px',
              }}>
                HÍ và tên, email và thông tin liên hÇ
              </p>
            </div>

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleSaveProfile}
              initialValues={{ fullName: MOCK_USER.fullName, email: MOCK_USER.email }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>HÍ và tên</span>}
                    name="fullName"
                    rules={[
                      { required: true, message: 'Vui lòng nh­p hÍ và tên!' },
                      { min: 2, message: 'HÍ và tên ph£i có ít nh¥t 2 ký tñ!' },
                    ]}
                    style={{ marginBottom: 16 }}
                  >
                    <Input
                      size="large"
                      placeholder="Nh­p hÍ và tên"
                      prefix={<UserOutlined style={{ color: T.inkMuted48 }} />}
                      style={{ borderRadius: 11, fontSize: 14 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Email</span>}
                    name="email"
                    style={{ marginBottom: 16 }}
                  >
                    <Input
                      size="large"
                      disabled
                      prefix={<MailOutlined style={{ color: T.inkMuted48 }} />}
                      style={{ borderRadius: 11, fontSize: 14 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={ghostBtn}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  onClick={() => profileForm.resetFields()}
                >
                  ·t l¡i
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
                  {loading ? 'ang l°u...' : 'L°u hÓ s¡'}
                </button>
              </div>
            </Form>
          </motion.div>

          {/* Target Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, marginBottom: 16 }}
          >
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <BookOutlined style={{ color: T.primary, fontSize: 14 }} />
                <h3 style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  color: T.ink,
                  letterSpacing: '-0.224px',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                }}>
                  Môn hÍc quan tâm
                </h3>
              </div>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: 0,
                letterSpacing: '-0.12px',
              }}>
                ChÍn nhïng môn b¡n muÑn tìm gia s°  giúp hÇ thÑng gãi ý gia s° phù hãp
              </p>
            </div>

            <Select
              mode="multiple"
              placeholder="-- ChÍn các môn hÍc quan tâm --"
              value={selectedSubjects}
              onChange={setSelectedSubjects}
              options={subjectOptions}
              style={{ width: '100%', marginBottom: 16 }}
              size="large"
              maxTagCount={6}
              tagRender={({ label, closable, onClose }) => (
                <Tag
                  closable={closable}
                  onClose={onClose}
                  style={{
                    borderRadius: 9999,
                    background: T.primaryLight,
                    color: T.primary,
                    border: `1px solid ${T.primaryBorder}`,
                    fontWeight: 500,
                    fontSize: 12,
                    padding: '1px 10px',
                    fontFamily: "'SF Pro Text', sans-serif",
                    letterSpacing: '-0.12px',
                  }}
                >
                  {label}
                </Tag>
              )}
            />

            {selectedSubjects.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                padding: '12px 16px',
                background: T.primaryLight,
                borderRadius: 11,
                marginBottom: 16,
                border: `1px solid ${T.primaryBorder}`,
              }}>
                <p style={{
                  fontSize: 11,
                  color: T.inkMuted48,
                  width: '100%',
                  margin: '0 0 4px',
                  letterSpacing: '-0.08px',
                }}>
                  ã chÍn {selectedSubjects.length} môn:
                </p>
                {selectedSubjects.map(id => {
                  const sub = MOCK_SUBJECTS.find(s => s.id === id);
                  return sub ? (
                    <Tag
                      key={id}
                      closable
                      onClose={() => setSelectedSubjects(prev => prev.filter(x => x !== id))}
                      style={{
                        borderRadius: 9999,
                        background: T.primary,
                        color: '#fff',
                        border: 'none',
                        fontWeight: 500,
                        fontSize: 12,
                        padding: '2px 10px',
                        fontFamily: "'SF Pro Text', sans-serif",
                        letterSpacing: '-0.12px',
                      }}
                    >
                      {sub.name}
                    </Tag>
                  ) : null;
                })}
              </div>
            )}

            <button
              type="button"
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
              {loading ? 'ang l°u...' : 'L°u môn hÍc quan tâm'}
            </button>
          </motion.div>

          {/* Study Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <AimOutlined style={{ color: T.primary, fontSize: 14 }} />
                <h3 style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  color: T.ink,
                  letterSpacing: '-0.224px',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                }}>
                  Måc tiêu hÍc t­p
                </h3>
              </div>
              <p style={{
                fontSize: 12,
                color: T.inkMuted48,
                margin: 0,
                letterSpacing: '-0.12px',
              }}>
                Mô t£ ng¯n vÁ måc tiêu hÍc t­p cça b¡n  giúp gia s° hiÃu rõ nhu c§u
              </p>
            </div>

            <Form
              form={goalForm}
              layout="vertical"
              onFinish={handleSaveGoals}
              initialValues={{ studyGoals: 'Ôn thi tÑt nghiÇp THPT 2026, t­p trung các môn Toán, V­t lý, Hóa hÍc và Ti¿ng Anh. Mong muÑn c£i thiÇn iÃm sÑ të 7.0 lên 8.5+.' }}
            >
              <Form.Item
                label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Måc tiêu hÍc t­p</span>}
                name="studyGoals"
                rules={[
                  { required: true, message: 'Vui lòng nh­p måc tiêu hÍc t­p!' },
                  { min: 20, message: 'Mô t£ ph£i có ít nh¥t 20 ký tñ!' },
                  { max: 500, message: 'Mô t£ không quá 500 ký tñ!' },
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Ví då: Ôn thi tÑt nghiÇp THPT 2026, t­p trung Toán, Lý, Hóa, Anh. Mong c£i thiÇn iÃm të 7.0 lên 8.5+..."
                  style={{ borderRadius: 11, fontSize: 14, resize: 'vertical', fontFamily: "'SF Pro Text', system-ui, sans-serif", letterSpacing: '-0.224px' }}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={ghostBtn}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  onClick={() => goalForm.resetFields()}
                >
                  ·t l¡i
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
                  {loading ? 'ang l°u...' : 'L°u måc tiêu'}
                </button>
              </div>
            </Form>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfileEdit;
