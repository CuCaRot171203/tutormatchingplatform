import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, message, Alert, Tag, Modal, Form, Select } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { mockScheduleGrid, SUBJECTS } from '../../data/tutorMockData';

const { Title, Text } = Typography;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

interface ScheduleSlot {
  day: number;
  hour: number;
  available: boolean;
}

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(
    mockScheduleGrid.map(s => ({ ...s }))
  );
  const [saving, setSaving] = useState(false);
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleSlot = (day: number, hour: number) => {
    setSchedule(prev =>
      prev.map(slot =>
        slot.day === day && slot.hour === hour
          ? { ...slot, available: !slot.available }
          : slot
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      message.success('Lưu lịch rảnh thành công!');
    }, 800);
  };

  const handleQuickAdd = () => {
    if (selectedDay === null || selectedHours.length === 0) {
      message.warning('Vui lòng chọn ngày và giờ!');
      return;
    }
    setSchedule(prev =>
      prev.map(slot =>
        slot.day === selectedDay && selectedHours.includes(slot.hour)
          ? { ...slot, available: true }
          : slot
      )
    );
    setHasChanges(true);
    setQuickAddModal(false);
    setSelectedDay(null);
    setSelectedHours([]);
    message.success('Đã thêm lịch rảnh nhanh!');
  };

  const isSlotAvailable = (day: number, hour: number) => {
    const slot = schedule.find(s => s.day === day && s.hour === hour);
    return slot?.available || false;
  };

  const availableCount = schedule.filter(s => s.available).length;

  // Stats
  const byDay = DAYS.map((day, i) => ({
    day, count: schedule.filter(s => s.day === i && s.available).length,
  }));
  const maxCount = Math.max(...byDay.map(d => d.count));

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Quản lý lịch rảnh</h1>
        <Text type="secondary">Cập nhật lịch có thể nhận dạy</Text>
      </div>

      {/* Alert + Save */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <Alert
          message="Hướng dẫn"
          description="Nhấp vào các ô bên dưới để bật/tắt lịch rảnh. Lịch rảnh giúp học sinh tìm được bạn dễ dàng hơn."
          type="info"
          showIcon
          style={{ flex: 1, borderRadius: 12 }}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          disabled={!hasChanges}
          onClick={handleSave}
          style={{ borderRadius: 10, height: 44, paddingInline: 20, background: T.primary }}
        >
          Lưu lịch
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setQuickAddModal(true)}
          style={{ borderRadius: 10, height: 44, paddingInline: 16 }}
        >
          Thêm nhanh
        </Button>
      </div>

      <Card variant="borderless" style={CARD_STYLE}>
        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <Text strong style={{ fontSize: 16 }}>Lịch rảnh hàng tuần</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>
              {availableCount} khung giờ được chọn
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {byDay.map(d => (
              <Tag key={d.day} style={{
                borderRadius: 20,
                background: d.count > 0 ? `${T.primary}15` : '#f5f5f7',
                color: d.count > 0 ? T.primary : T.textSubtle,
                fontWeight: 600, border: 'none',
              }}>
                {d.day}: {d.count}h
              </Tag>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', width: 80 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Giờ</Text>
                </th>
                {DAYS.map((day, index) => (
                  <th key={index} style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 13 }}>{day}</Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour}>
                  <td style={{ padding: '4px 12px' }}>
                    <Text style={{ fontSize: 13, color: T.textMuted }}>{hour}:00</Text>
                  </td>
                  {DAYS.map((_, dayIndex) => (
                    <td key={dayIndex} style={{ padding: 4 }}>
                      <div
                        onClick={() => handleToggleSlot(dayIndex, hour)}
                        style={{
                          width: '100%', height: 40,
                          borderRadius: 8, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s ease',
                          backgroundColor: isSlotAvailable(dayIndex, hour)
                            ? T.primary
                            : 'rgba(148, 151, 169, 0.06)',
                          border: isSlotAvailable(dayIndex, hour)
                            ? `2px solid ${T.primary}`
                            : '2px solid transparent',
                        }}
                        title={`${DAYS[dayIndex]} ${hour}:00`}
                      >
                        {isSlotAvailable(dayIndex, hour) && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 24, display: 'flex', gap: 24, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              backgroundColor: 'rgba(148, 151, 169, 0.06)',
              border: '2px solid transparent',
            }} />
            <Text type="secondary" style={{ fontSize: 13 }}>Không rảnh</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              backgroundColor: T.primary, border: `2px solid ${T.primary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>Có thể dạy</Text>
          </div>
        </div>
      </Card>

      {/* Quick Add Modal */}
      <Modal
        title="Thêm lịch rảnh nhanh"
        open={quickAddModal}
        onCancel={() => { setQuickAddModal(false); setSelectedDay(null); setSelectedHours([]); }}
        onOk={handleQuickAdd}
        okText="Thêm"
        cancelText="Hủy"
        centered
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: T.textMuted, display: 'block', marginBottom: 8 }}>Chọn ngày trong tuần</Text>
          <Select
            placeholder="-- Chọn ngày --"
            style={{ width: '100%' }}
            size="large"
            value={selectedDay}
            onChange={v => setSelectedDay(v)}
          >
            {DAYS.map((day, i) => (
              <Select.Option key={i} value={i}>{day}</Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <Text style={{ fontSize: 13, color: T.textMuted, display: 'block', marginBottom: 8 }}>Chọn khung giờ</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {HOURS.map(h => (
              <Button
                key={h}
                type={selectedHours.includes(h) ? 'primary' : 'default'}
                onClick={() => setSelectedHours(prev =>
                  prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
                )}
                style={{ borderRadius: 8, minWidth: 60 }}
              >
                {h}:00
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Schedule;
