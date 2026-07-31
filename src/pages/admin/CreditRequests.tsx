import React, { useState, useMemo } from 'react';
import { App, Table, Button, Input, Select, Modal, Avatar, Tag, Tooltip, Badge } from 'antd';
import {
  CheckOutlined, CloseOutlined, SearchOutlined,
  DollarOutlined, FilterOutlined, ReloadOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined,
  WalletOutlined, BankOutlined, CreditCardOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import vi from 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

// ─── Design Tokens ───────────────────────────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  cardHover:     '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',

  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',

  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',
  accentGlow:    'rgba(79,110,247,0.15)',

  blue:          '#3b82f6',
  blueLight:     'rgba(59,130,246,0.08)',
  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  purple:        '#8b5cf6',
  purpleLight:   'rgba(139,92,246,0.08)',
  cyan:          '#06b6d4',
  cyanLight:     'rgba(6,182,212,0.08)',
};

const FONT_HEAD = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────
type CreditStatus = 'Pending' | 'Approved' | 'Rejected';
type PaymentMethod = 'banking' | 'momo' | 'zalopay' | 'vnpay';

interface CreditRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  bonusCredits: number;
  paymentMethod: PaymentMethod;
  transactionCode: string;
  note: string;
  status: CreditStatus;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectReason?: string;
  avatar: string;
  avatarColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CREDIT_REQUESTS: CreditRequest[] = [
  {
    id: 'CR001',
    userId: 'U001',
    userName: 'Nguyễn Minh Tuấn',
    userEmail: 'tuan.nguyen@gmail.com',
    amount: 500000,
    bonusCredits: 50000,
    paymentMethod: 'banking',
    transactionCode: 'MB-1707253847291',
    note: 'Nạp tiền để đặt lịch học với gia sư Toán',
    status: 'Pending',
    createdAt: '2026-07-29T14:32:00',
    avatar: 'N',
    avatarColor: '#4f6ef7',
  },
  {
    id: 'CR002',
    userId: 'U002',
    userName: 'Trần Thị Lan',
    userEmail: 'lan.tran@outlook.com',
    amount: 200000,
    bonusCredits: 20000,
    paymentMethod: 'momo',
    transactionCode: 'MOMO0927123456',
    note: '',
    status: 'Pending',
    createdAt: '2026-07-29T10:15:00',
    avatar: 'T',
    avatarColor: '#10b981',
  },
  {
    id: 'CR003',
    userId: 'U003',
    userName: 'Lê Hoàng Nam',
    userEmail: 'nam.le@vnu.edu.vn',
    amount: 1000000,
    bonusCredits: 150000,
    paymentMethod: 'vnpay',
    transactionCode: 'VNPAY20260729123456',
    note: ' Gói Premium tháng, cần gia hạn sớm',
    status: 'Pending',
    createdAt: '2026-07-28T16:45:00',
    avatar: 'L',
    avatarColor: '#8b5cf6',
  },
  {
    id: 'CR004',
    userId: 'U004',
    userName: 'Phạm Thu Hà',
    userEmail: 'hapham.91@yahoo.com',
    amount: 300000,
    bonusCredits: 30000,
    paymentMethod: 'banking',
    transactionCode: 'ACB-20260729-001234',
    note: 'Thanh toán 5 buổi học Vật lý',
    status: 'Pending',
    createdAt: '2026-07-28T09:22:00',
    avatar: 'P',
    avatarColor: '#f59e0b',
  },
  {
    id: 'CR005',
    userId: 'U005',
    userName: 'Đặng Quang Đức',
    userEmail: 'duc.dang@gmail.com',
    amount: 150000,
    bonusCredits: 15000,
    paymentMethod: 'zalopay',
    transactionCode: 'ZALO1707241234',
    note: '',
    status: 'Pending',
    createdAt: '2026-07-27T20:08:00',
    avatar: 'Đ',
    avatarColor: '#06b6d4',
  },
  {
    id: 'CR006',
    userId: 'U006',
    userName: 'Vũ Thị Mai',
    userEmail: 'mai.vu@fpt.edu.vn',
    amount: 800000,
    bonusCredits: 80000,
    paymentMethod: 'banking',
    transactionCode: 'TPB-202627-567890',
    note: 'Nạp cho con học tiếng Anh giao tiếp',
    status: 'Pending',
    createdAt: '2026-07-27T11:30:00',
    avatar: 'V',
    avatarColor: '#ec4899',
  },
  {
    id: 'CR007',
    userId: 'U007',
    userName: 'Bùi Đình Phong',
    userEmail: 'phong.bui@gmail.com',
    amount: 600000,
    bonusCredits: 60000,
    paymentMethod: 'momo',
    transactionCode: 'MOMO0912345678',
    note: 'Học phí ôn thi lớp 12',
    status: 'Pending',
    createdAt: '2026-07-26T15:55:00',
    avatar: 'B',
    avatarColor: '#84cc16',
  },
  {
    id: 'CR008',
    userId: 'U008',
    userName: 'Hoàng Minh Châu',
    userEmail: 'chau.hoang@hus.edu.vn',
    amount: 400000,
    bonusCredits: 40000,
    paymentMethod: 'vnpay',
    transactionCode: 'VNPAY20260726123456',
    note: '',
    status: 'Pending',
    createdAt: '2026-07-26T08:10:00',
    avatar: 'H',
    avatarColor: '#3b82f6',
  },
  {
    id: 'CR009',
    userId: 'U009',
    userName: 'Trương Thị Hương',
    userEmail: 'huong.truong@ptit.edu.vn',
    amount: 250000,
    bonusCredits: 25000,
    paymentMethod: 'banking',
    transactionCode: 'BIDV-202626-998877',
    note: 'Nạp tiền mua gói học thử',
    status: 'Pending',
    createdAt: '2026-07-25T17:42:00',
    avatar: 'T',
    avatarColor: '#6366f1',
  },
  {
    id: 'CR010',
    userId: 'U010',
    userName: 'Ngô Đức Anh',
    userEmail: 'anh.ngo@fe.edu.vn',
    amount: 1000000,
    bonusCredits: 150000,
    paymentMethod: 'zalopay',
    transactionCode: 'ZALO1707254321',
    note: 'Gói VIP 3 tháng',
    status: 'Pending',
    createdAt: '2026-07-25T13:20:00',
    avatar: 'N',
    avatarColor: '#f97316',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const getPaymentIcon = (method: PaymentMethod) => {
  const icons: Record<PaymentMethod, React.ReactNode> = {
    banking: <BankOutlined style={{ fontSize: 13 }} />,
    momo: <WalletOutlined style={{ fontSize: 13 }} />,
    zalopay: <WalletOutlined style={{ fontSize: 13 }} />,
    vnpay: <CreditCardOutlined style={{ fontSize: 13 }} />,
  };
  return icons[method];
};

const getPaymentLabel = (method: PaymentMethod) => {
  const labels: Record<PaymentMethod, string> = {
    banking: 'Chuyển khoản',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPay',
  };
  return labels[method];
};

const getPaymentColor = (method: PaymentMethod): string => {
  const colors: Record<PaymentMethod, string> = {
    banking: '#4f6ef7',
    momo: '#a855f7',
    zalopay: '#3b82f6',
    vnpay: '#10b981',
  };
  return colors[method];
};

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusChip = ({ status }: { status: CreditStatus }) => {
  const map: Record<CreditStatus, { bg: string; color: string; label: string; dot: string }> = {
    Pending:  { bg: T.orangeLight, color: T.orange, label: 'Chờ duyệt', dot: T.orange },
    Approved: { bg: T.greenLight,  color: T.green,  label: 'Đã duyệt',  dot: T.green },
    Rejected: { bg: T.redLight,    color: T.red,    label: 'Đã từ chối', dot: T.red },
  };
  const s = map[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

// ─── Action Button (approve) ─────────────────────────────────────────────────
const ApproveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 14px', borderRadius: 9999,
      background: T.green, color: '#ffffff',
      border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0d9668'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.green; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
  >
    <CheckOutlined style={{ fontSize: 11 }} />
    Duyệt
  </button>
);

// ─── Action Button (reject) ───────────────────────────────────────────────────
const RejectBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 18px', borderRadius: 9999,
      background: 'transparent', color: T.red,
      border: `1px solid ${T.red}30`, cursor: 'pointer',
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.redLight; (e.currentTarget as HTMLElement).style.borderColor = T.red; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = `${T.red}30`; }}
  >
    <CloseOutlined style={{ fontSize: 11 }} />
    Từ chối
  </button>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, icon, accentColor, sub,
}: {
  label: string; value: string; icon: React.ReactNode; accentColor: string; sub?: string;
}) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: '18px 20px',
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: `${accentColor}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accentColor, fontSize: 18, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, marginTop: 4, fontFamily: FONT_BODY }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CreditRequests: React.FC = () => {
  const { notification } = App.useApp();

  // ── State ──────────────────────────────────────────────────────────────────
  const [requests, setRequests] = useState<CreditRequest[]>(MOCK_CREDIT_REQUESTS);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<CreditStatus | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [adjustedAmount, setAdjustedAmount] = useState<number>(0);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Filtered Data ───────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        r.transactionCode.toLowerCase().includes(searchText.toLowerCase()) ||
        r.id.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesPayment = filterPayment === 'all' || r.paymentMethod === filterPayment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [requests, searchText, filterStatus, filterPayment]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;
  const totalPendingAmount = requests
    .filter((r) => r.status === 'Pending')
    .reduce((sum, r) => sum + r.amount, 0);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRequests([...MOCK_CREDIT_REQUESTS]);
    setLoading(false);
    notification.success({ message: 'Đã làm mới dữ liệu', placement: 'topRight' });
  };

  const openModal = (req: CreditRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(req);
    setModalType(type);
    setAdjustedAmount(req.amount);
    setRejectReason('');
  };

  const handleApprove = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest!.id
          ? { ...r, status: 'Approved', processedAt: new Date().toISOString() }
          : r
      )
    );
    setSubmitting(false);
    notification.success({
      message: 'Duyệt thành công',
      description: (
        <div>
          Yêu cầu <strong>{selectedRequest!.id}</strong> đã được duyệt.{' '}
          {adjustedAmount !== selectedRequest!.amount && (
            <span style={{ color: '#f59e0b' }}>
              Số tiền điều chỉnh: {fmtCurrency(adjustedAmount)}
            </span>
          )}
        </div>
      ),
      placement: 'topRight',
      duration: 4,
    });
    closeModal();
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      notification.warning({ message: 'Vui lòng nhập lý do từ chối', placement: 'topRight' });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest!.id
          ? { ...r, status: 'Rejected', rejectReason, processedAt: new Date().toISOString() }
          : r
      )
    );
    setSubmitting(false);
    notification.error({
      message: 'Đã từ chối yêu cầu',
      description: `Yêu cầu ${selectedRequest!.id} đã bị từ chối. Lý do: ${rejectReason}`,
      placement: 'topRight',
      duration: 4,
    });
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setRejectReason('');
  };

  // ── Table Columns ───────────────────────────────────────────────────────────
  const columns: any[] = [
    {
      title: 'Người dùng',
      key: 'user',
      fixed: 'left',
      width: 220,
      render: (_: any, record: CreditRequest) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${record.avatarColor}14`,
            color: record.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, flexShrink: 0, fontFamily: FONT_HEAD,
          }}>
            {record.avatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY, lineHeight: 1.3 }}>
              {record.userName}
            </div>
            <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
              {record.userEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      key: 'amount',
      width: 150,
      render: (_: any, record: CreditRequest) => (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.green, fontFamily: FONT_HEAD }}>
            {fmtCurrency(record.amount)}
          </div>
          {record.bonusCredits > 0 && (
            <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
              + {fmtCurrency(record.bonusCredits)} bonus
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Mã GD',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      width: 180,
      render: (code: string) => (
        <span style={{ fontSize: 12, color: T.textMuted, fontFamily: FONT_BODY }}>
          {code}
        </span>
      ),
    },
    {
      title: 'Phương thức',
      key: 'paymentMethod',
      width: 130,
      render: (_: any, record: CreditRequest) => {
        const color = getPaymentColor(record.paymentMethod);
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 9999,
            background: `${color}10`, color: color,
            fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
          }}>
            {getPaymentIcon(record.paymentMethod)}
            {getPaymentLabel(record.paymentMethod)}
          </span>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 180,
      render: (note: string) => (
        <Tooltip title={note || 'Không có ghi chú'}>
          <span style={{
            fontSize: 12, color: note ? T.textMuted : T.textSubtle,
            fontStyle: note ? 'normal' : 'italic',
            fontFamily: FONT_BODY,
          }}>
            {note ? (note.length > 30 ? note.substring(0, 30) + '…' : note) : '—'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian',
      key: 'createdAt',
      width: 130,
      render: (_: any, record: CreditRequest) => (
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, fontFamily: FONT_BODY }}>
            {dayjs(record.createdAt).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
            {dayjs(record.createdAt).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: CreditStatus) => <StatusChip status={status} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_: any, record: CreditRequest) =>
        record.status === 'Pending' ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <ApproveBtn onClick={() => openModal(record, 'approve')} />
            <RejectBtn onClick={() => openModal(record, 'reject')} />
          </div>
        ) : (
          <span style={{ fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY }}>
            {record.status === 'Approved' ? 'Đã xử lý' : 'Đã từ chối'}
          </span>
        ),
    },
  ];

  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: T.text, letterSpacing: '-0.3px', fontFamily: FONT_HEAD,
          }}>
            Yêu cầu nạp tiền
          </h1>
          <div style={{ fontSize: 13, color: T.textSubtle, marginTop: 4, fontFamily: FONT_BODY }}>
            Xem xét và duyệt các yêu cầu nạp Credit của người dùng
          </div>
        </div>
        <Button
          icon={<ReloadOutlined spin={loading} />}
          onClick={handleRefresh}
          disabled={loading}
          style={{
            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
            color: loading ? T.accent : T.textMuted,
            border: `1px solid ${T.border}`,
            background: loading ? T.accentLight : T.card,
            height: 38,
          }}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Chờ duyệt"
          value={pendingCount.toString()}
          icon={<ClockCircleOutlined />}
          accentColor={T.orange}
          sub={`Tổng: ${fmtCurrency(totalPendingAmount)}`}
        />
        <StatCard
          label="Đã duyệt"
          value={approvedCount.toString()}
          icon={<CheckOutlined />}
          accentColor={T.green}
          sub="Thành công"
        />
        <StatCard
          label="Đã từ chối"
          value={rejectedCount.toString()}
          icon={<CloseOutlined />}
          accentColor={T.red}
          sub="Từ chối"
        />
        <StatCard
          label="Tổng yêu cầu"
          value={requests.length.toString()}
          icon={<DollarOutlined />}
          accentColor={T.accent}
          sub="Tất cả"
        />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '16px 20px',
          marginBottom: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          {/* Search */}
          <Input
            placeholder="Tìm theo tên, email, mã giao dịch..."
            prefix={<SearchOutlined style={{ color: T.textSubtle, fontSize: 13 }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{
              borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
              flex: '1', minWidth: 240,
              height: 38,
            }}
          />

          {/* Filter Status */}
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ minWidth: 140, fontFamily: FONT_BODY, height: 38 }}
            size="large"
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Pending', label: 'Chờ duyệt' },
              { value: 'Approved', label: 'Đã duyệt' },
              { value: 'Rejected', label: 'Đã từ chối' },
            ]}
          />

          {/* Filter Payment */}
          <Select
            value={filterPayment}
            onChange={setFilterPayment}
            style={{ height: 38 }}
            options={[
              { value: 'all', label: 'Tất cả PT' },
              { value: 'banking', label: 'Chuyển khoản' },
              { value: 'momo', label: 'MoMo' },
              { value: 'zalopay', label: 'ZaloPay' },
              { value: 'vnpay', label: 'VNPay' },
            ]}
          />

          {/* Clear Filters */}
          {(searchText || filterStatus !== 'all' || filterPayment !== 'all') && (
            <Button
              type="text"
              size="middle"
              icon={<CloseOutlined />}
              onClick={() => { setSearchText(''); setFilterStatus('all'); setFilterPayment('all'); }}
              style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_BODY, height: 38 }}
            >
              Xóa lọc
            </Button>
          )}

          {/* Result count */}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY, flexShrink: 0,
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: 9999,
              background: T.accentLight, color: T.accent,
              fontWeight: 600, fontSize: 11,
            }}>
              {filteredData.length}
            </span>
            / {requests.length} yêu cầu
          </div>
        </div>
      </motion.div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY }}>
                Hiển thị {range[0]}–{range[1]} trong {total} yêu cầu
              </span>
            ),
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  <DollarOutlined style={{ color: T.textSubtle, fontSize: 48 }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textMuted, marginBottom: 6, fontFamily: FONT_BODY }}>
                  Không có yêu cầu nào
                </div>
                <div style={{ fontSize: 13, color: T.textSubtle, fontFamily: FONT_BODY }}>
                  Thử thay đổi bộ lọc hoặc tìm kiếm
                </div>
              </div>
            ),
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? '' : `table-row-stripe`
          }
          style={{ fontFamily: FONT_BODY }}
          onRow={(_, record) => ({
            style: { transition: 'background 0.15s' },
          })}
        />
      </div>

      {/* ── Approve Modal ───────────────────────────────────────────────────── */}
      <Modal
        title={null}
        open={modalType === 'approve'}
        onCancel={closeModal}
        footer={null}
        width={480}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: 'hidden', fontFamily: FONT_BODY },
        }}
      >
        {selectedRequest && (
          <div>
            {/* Modal Header */}
            <div style={{
              background: T.greenLight,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: `1px solid ${T.green}18`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${T.green}18`, color: T.green,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                <CheckOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD }}>
                  Duyệt yêu cầu nạp tiền
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: FONT_BODY }}>
                  Xác nhận duyệt yêu cầu #{selectedRequest.id}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* User Info Card */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, borderRadius: 12,
                background: `${T.accent}06`,
                border: `1px solid ${T.accent}12`,
                marginBottom: 18,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${selectedRequest.avatarColor}14`,
                  color: selectedRequest.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15, flexShrink: 0, fontFamily: FONT_HEAD,
                }}>
                  {selectedRequest.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                    {selectedRequest.userName}
                  </div>
                  <div style={{ fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY }}>
                    {selectedRequest.userEmail}
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: T.greenLight, border: `1px solid ${T.green}18`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Số tiền yêu cầu
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.green, fontFamily: FONT_HEAD }}>
                    {fmtCurrency(selectedRequest.amount)}
                  </div>
                </div>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: T.accentLight, border: `1px solid ${T.accent}18`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Bonus
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.accent, fontFamily: FONT_HEAD }}>
                    + {fmtCurrency(selectedRequest.bonusCredits)}
                  </div>
                </div>
              </div>

              {/* Transaction Code */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, fontFamily: FONT_BODY }}>
                  Mã giao dịch
                </div>
                <div style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: `${T.text}04`,
                  fontSize: 13, fontFamily: 'monospace', color: T.textMuted,
                }}>
                  {selectedRequest.transactionCode}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, fontFamily: FONT_BODY }}>
                  Phương thức
                </div>
                {(() => {
                  const color = getPaymentColor(selectedRequest.paymentMethod);
                  return (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 9999,
                      background: `${color}10`, color: color,
                      fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
                    }}>
                      {getPaymentIcon(selectedRequest.paymentMethod)}
                      {getPaymentLabel(selectedRequest.paymentMethod)}
                    </span>
                  );
                })()}
              </div>

              {/* Note */}
              {selectedRequest.note && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, fontFamily: FONT_BODY }}>
                    Ghi chú
                  </div>
                  <div style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: `${T.text}04`,
                    fontSize: 13, color: T.textMuted, fontFamily: FONT_BODY,
                  }}>
                    {selectedRequest.note}
                  </div>
                </div>
              )}

              {/* Confirm */}
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: `${T.green}08`,
                border: `1px solid ${T.green}18`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <CheckOutlined style={{ color: T.green, fontSize: 14 }} />
                <span style={{ fontSize: 13, color: T.textMuted, fontFamily: FONT_BODY }}>
                  Xác nhận rằng đã nhận được thanh toán và duyệt yêu cầu này?
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}>
              <Button
                onClick={closeModal}
                style={{ borderRadius: 10, fontFamily: FONT_BODY, height: 40 }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={submitting}
                onClick={handleApprove}
                style={{
                  borderRadius: 10, height: 40,
                  background: T.green, borderColor: T.green,
                  fontFamily: FONT_BODY, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                Duyệt yêu cầu
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reject Modal ────────────────────────────────────────────────────── */}
      <Modal
        title={null}
        open={modalType === 'reject'}
        onCancel={closeModal}
        footer={null}
        width={480}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: 'hidden', fontFamily: FONT_BODY },
        }}
      >
        {selectedRequest && (
          <div>
            {/* Modal Header */}
            <div style={{
              background: T.redLight,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: `1px solid ${T.red}18`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${T.red}18`, color: T.red,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                <CloseOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD }}>
                  Từ chối yêu cầu nạp tiền
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: FONT_BODY }}>
                  Xác nhận từ chối yêu cầu #{selectedRequest.id}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* Warning */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px 14px', borderRadius: 10,
                background: `${T.red}06`,
                border: `1px solid ${T.red}18`,
                marginBottom: 18,
              }}>
                <WarningOutlined style={{ color: T.red, fontSize: 14, marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: T.textMuted, fontFamily: FONT_BODY, lineHeight: 1.5 }}>
                  Người dùng <strong style={{ color: T.text }}>{selectedRequest.userName}</strong> sẽ không nhận được Credit. Vui lòng nhập lý do từ chối rõ ràng để người dùng có thể nắm được.
                </div>
              </div>

              {/* User + Amount summary */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10,
                background: `${T.text}04`,
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${selectedRequest.avatarColor}14`,
                    color: selectedRequest.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 12, fontFamily: FONT_HEAD,
                  }}>
                    {selectedRequest.avatar}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: FONT_BODY }}>
                    {selectedRequest.userName}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.red, fontFamily: FONT_HEAD }}>
                  {fmtCurrency(selectedRequest.amount)}
                </div>
              </div>

              {/* Reason Input */}
              <div style={{ marginBottom: 8 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY,
                }}>
                  Lý do từ chối <span style={{ color: T.red }}>*</span>
                </label>
                <Input.TextArea
                  rows={3}
                  placeholder="Ví dụ: Giao dịch không hợp lệ, không nhận được thanh toán..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  maxLength={300}
                  showCount
                  style={{
                    borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
                    resize: 'none',
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}>
              <Button
                onClick={closeModal}
                style={{ borderRadius: 10, fontFamily: FONT_BODY, height: 40 }}
              >
                Hủy bỏ
              </Button>
              <Button
                danger
                type="primary"
                icon={<CloseOutlined />}
                loading={submitting}
                onClick={handleReject}
                style={{
                  borderRadius: 10, height: 40,
                  fontFamily: FONT_BODY, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                Từ chối yêu cầu
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Global CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        .ant-table-thead > tr > th {
          background: ${T.bg} !important;
          color: ${T.textMuted} !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid ${T.border} !important;
          padding: 10px 16px !important;
          font-family: ${FONT_BODY};
        }
        .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid ${T.borderLight} !important;
          font-size: 13px;
          transition: background 0.15s;
        }
        .ant-table-tbody > tr:hover > td {
          background: ${T.accentLight} !important;
        }
        .ant-table-tbody > tr.table-row-stripe > td {
          background: ${T.bg} !important;
        }
        .ant-table-tbody > tr.table-row-stripe:hover > td {
          background: ${T.accentLight} !important;
        }
        .ant-table-wrapper .ant-table-pagination {
          padding: 12px 20px;
          border-top: 1px solid ${T.border};
          margin: 0;
        }
        .ant-input, .ant-select-selector, .ant-input-textarea textarea {
          font-family: ${FONT_BODY} !important;
        }
        .ant-select-item {
          font-family: ${FONT_BODY} !important;
          font-size: 13px !important;
        }
        .ant-select-item-option-selected {
          background: ${T.accentLight} !important;
        }
        .ant-select-selection-item {
          font-size: 13px !important;
        }
      `}</style>
    </div>
  );
};

export default CreditRequests;
