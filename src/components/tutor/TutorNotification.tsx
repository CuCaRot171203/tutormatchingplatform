import React from 'react';
import { Badge, List, Typography, Space, Button, Divider, Empty } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  CalendarOutlined,
  StarOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { mockNotifications } from '../../data/tutorMockData';
import type { Notification } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

const T = {
  primary: '#7132f5',
  primaryLight: 'rgba(113,50,245,0.04)',
  text: '#101114',
  textMuted: '#686b82',
  border: '#dedee5',
  green: '#149e61',
  orange: '#d97706',
  yellow: '#f59e0b',
};

const getNotifIcon = (title: string) => {
  if (title.toLowerCase().includes('đổi lịch')) return <CalendarOutlined style={{ color: T.orange }} />;
  if (title.toLowerCase().includes('đánh giá') || title.toLowerCase().includes('sao')) return <StarOutlined style={{ color: T.yellow }} />;
  return <BellOutlined style={{ color: T.primary }} />;
};

interface TutorNotificationProps {
  notifications?: Notification[];
}

const TutorNotification: React.FC<TutorNotificationProps> = ({ notifications = mockNotifications }) => {
  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  const handleMarkAllRead = () => {
    // In real app: call API
  };

  return (
    <div style={{ width: 380, maxHeight: 480, overflow: 'auto', background: '#fff' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky', top: 0, background: '#fff', zIndex: 1,
      }}>
        <Text strong style={{ fontSize: 15 }}>Thông báo</Text>
        {unread.length > 0 && (
          <Button type="link" size="small" icon={<CheckOutlined />} onClick={handleMarkAllRead}
            style={{ fontSize: 12, color: T.primary, padding: 0 }}>
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty description="Không có thông báo nào" style={{ padding: '32px 0' }} />
      ) : (
        <List
          dataSource={notifications}
          locale={{ emptyText: 'Không có thông báo nào' }}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: item.isRead ? 'transparent' : T.primaryLight,
                cursor: 'pointer',
                borderBottom: `1px solid ${T.border}`,
                transition: 'background 0.15s',
              }}
              onClick={() => {}}
              onMouseEnter={e => {
                if (item.isRead) (e.currentTarget as HTMLElement).style.background = '#fafafa';
              }}
              onMouseLeave={e => {
                if (item.isRead) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: item.isRead ? '#f5f5f7' : `${T.primary}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {getNotifIcon(item.title)}
                  </div>
                }
                title={
                  <Text strong={!item.isRead} style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>
                    {item.title}
                  </Text>
                }
                description={
                  <Space direction="vertical" size={2}>
                    <Text style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>
                      {item.message}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9497a9' }}>
                      {dayjs(item.createdAt).fromNow()}
                    </Text>
                  </Space>
                }
              />
              {!item.isRead && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: T.primary, flexShrink: 0,
                }} />
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TutorNotification;
