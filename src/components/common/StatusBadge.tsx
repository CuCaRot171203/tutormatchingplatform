import React from 'react';
import { SessionStatus } from '../../types';

interface StatusBadgeProps {
  status: SessionStatus | string;
  size?: 'small' | 'default';
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  // Session Status
  Pending: { bg: 'rgba(255, 149, 0, 0.12)', color: '#b45309', label: 'Đang chờ' },
  pending: { bg: 'rgba(255, 149, 0, 0.12)', color: '#b45309', label: 'Đang chờ' },
  Confirmed: { bg: 'rgba(0, 98, 255, 0.12)', color: '#0062FF', label: 'Đã xác nhận' },
  confirmed: { bg: 'rgba(0, 98, 255, 0.12)', color: '#0062FF', label: 'Đã xác nhận' },
  Completed: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Hoàn thành' },
  completed: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Hoàn thành' },
  Cancelled: { bg: 'rgba(255, 59, 48, 0.12)', color: '#d92b20', label: 'Đã hủy' },
  cancelled: { bg: 'rgba(255, 59, 48, 0.12)', color: '#d92b20', label: 'Đã hủy' },
  PendingChangeConfirmation: { bg: 'rgba(113, 50, 245, 0.12)', color: '#5b1ecf', label: 'Chờ đổi lịch' },

  // Profile Status
  Approved: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Đã duyệt' },
  Rejected: { bg: 'rgba(255, 59, 48, 0.12)', color: '#d92b20', label: 'Từ chối' },

  // Credit Request Status
  Deposit: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Nạp tiền' },
  SessionFee: { bg: 'rgba(113, 50, 245, 0.12)', color: '#5b1ecf', label: 'Phí buổi học' },
  LateCancellationFee: { bg: 'rgba(255, 59, 48, 0.12)', color: '#d92b20', label: 'Phí hủy muộn' },
  Refund: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Hoàn tiền' },

  // Change Request Status
  Accepted: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Đại chấp nhận' },

  // Milestone Status
  NotStarted: { bg: 'rgba(104, 107, 130, 0.12)', color: '#484b5e', label: 'Chưa bắt đầu' },
  InProgress: { bg: 'rgba(113, 50, 245, 0.12)', color: '#5b1ecf', label: 'Đang tiến hành' },

  // Complaint Status
  Resolved: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Đã xử lý' },
  Dismissed: { bg: 'rgba(104, 107, 130, 0.12)', color: '#484b5e', label: 'Bỏ qua' },

  // User Status
  Active: { bg: 'rgba(52, 199, 89, 0.12)', color: '#1a9e55', label: 'Hoạt động' },
  Suspended: { bg: 'rgba(255, 59, 48, 0.12)', color: '#d92b20', label: 'Bị khóa' },

  // Default
  default: { bg: 'rgba(104, 107, 130, 0.12)', color: '#484b5e', label: 'Không xác định' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'default' }) => {
  const config = statusConfig[status] || statusConfig.default;
  
  return (
    <span style={{
      display: 'inline-block',
      padding: size === 'small' ? '3px 8px' : '4px 10px',
      borderRadius: 9999,
      backgroundColor: config.bg,
      color: config.color,
      fontSize: size === 'small' ? 11 : 13,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      letterSpacing: '0.1px',
    }}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
