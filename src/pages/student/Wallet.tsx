import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Typography, Row, Col, Table, InputNumber, Button,
  Modal, App, Segmented, Space, Carousel,
} from 'antd';
import {
  WalletOutlined, LoadingOutlined, HistoryOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
  CheckCircleFilled, CopyOutlined, QrcodeOutlined,
  ReloadOutlined, ClockCircleOutlined,
  LeftOutlined, RightOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import { MOCK_TRANSACTIONS, MOCK_DASHBOARD_STATS } from '../../data/mockData';
import type { CreditTransaction } from '../../types';
import slidePay1 from '../../assets/image/payment/TTP_pay_1.png';
import slidePay2 from '../../assets/image/payment/TTP_pay_2.png';
import slidePay3 from '../../assets/image/payment/TTP_pay_3.png';
import slidePay4 from '../../assets/image/payment/TTP_pay_4.png';

const { Title, Text } = Typography;

// ─── Design Tokens (Apple-inspired) ──────────────────────────────────────────
const T = {
  primary:      '#0066cc',
  primaryFocus: '#0071e3',
  canvas:       '#ffffff',
  parchment:   '#f5f5f7',
  ink:          '#1d1d1f',
  inkMuted48:   '#7a7a7a',
  inkMuted80:   '#333333',
  hairline:     '#e0e0e0',
  dividerSoft:  'rgba(0, 0, 0, 0.04)',
  success:      '#149e61',
  successBg:    'rgba(20, 158, 97, 0.08)',
  error:        '#dc2626',
  errorBg:      'rgba(220, 38, 38, 0.08)',
  onDark:       '#ffffff',
};

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(v);

// ─── Chart Mock Data ─────────────────────────────────────────────────────────
const SPENDING_BY_MONTH = [
  { month: 'T1', amount: 0 },
  { month: 'T2', amount: 0 },
  { month: 'T3', amount: 0 },
  { month: 'T4', amount: 0 },
  { month: 'T5', amount: 0 },
  { month: 'T6', amount: 350000 },
  { month: 'T7', amount: 3090000 },
];

const SPENDING_CATEGORIES = [
  { name: 'Phí buổi học',  value: 2790000, color: '#0066cc' },
  { name: 'Phí hủy muộn',  value:  300000, color: '#dc2626' },
];

const slides = [
  {
    img: slidePay1,
    slogan: 'Thanh toán dễ dàng, bảo mật tuyệt đối',
    sub: 'Hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi',
    cta: 'Nạp ngay',
    ctaAction: 'deposit',
  },
  {
    img: slidePay2,
    slogan: 'Nạp Credit nhanh chóng trong vài giây',
    sub: 'Chuyển khoản qua PayOS — xử lý tức thì, không chờ đợi',
    cta: 'Nạp Credit',
    ctaAction: 'deposit',
  },
  {
    img: slidePay3,
    slogan: 'Quản lý tài chính học tập thông minh',
    sub: 'Theo dõi chi tiêu và lịch sử giao dịch minh bạch',
    cta: 'Xem lịch sử',
    ctaAction: 'history',
  },
  {
    img: slidePay4,
    slogan: 'Đầu tư vào tri thức — Nhận lại tương lai',
    sub: 'Mỗi buổi học là một bước tiến gần hơn tới mục tiêu của bạn',
    cta: 'Bắt đầu ngay',
    ctaAction: 'deposit',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  Deposit:             { color: T.success, bg: T.successBg, label: 'Nạp tiền',     icon: <ArrowUpOutlined /> },
  SessionFee:          { color: T.error,   bg: T.errorBg,   label: 'Phí buổi học', icon: <ArrowDownOutlined /> },
  LateCancellationFee: { color: T.error,   bg: T.errorBg,   label: 'Phí hủy muộn', icon: <ArrowDownOutlined /> },
  Refund:              { color: T.success, bg: T.successBg, label: 'Hoàn tiền',     icon: <ArrowUpOutlined /> },
};

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const SpendingTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: T.ink, color: T.onDark,
        borderRadius: 8, padding: '8px 14px',
        fontSize: 13, fontFamily: 'inherit',
      }}>
        <div style={{ opacity: 0.7, marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{fmtCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

const DonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: T.ink, color: T.onDark,
        borderRadius: 8, padding: '8px 14px',
        fontSize: 13, fontFamily: 'inherit',
      }}>
        <div style={{ marginBottom: 2 }}>{payload[0].name}</div>
        <div style={{ fontWeight: 600 }}>{fmtCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────
const Wallet: React.FC = () => {
  const { notification } = App.useApp();
  const [balance] = useState<number>(MOCK_DASHBOARD_STATS.balance);
  const [transactions] = useState<CreditTransaction[]>(MOCK_TRANSACTIONS);
  const [amount, setAmount] = useState<number>(500000);
  const [timeRange, setTimeRange] = useState<string>('all');

  // ─── PayOS QR State ─────────────────────────────────────────────────────────
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrSuccessVisible, setQrSuccessVisible] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);
  const [qrDescription, setQrDescription] = useState('');
  const [qrOrderCode, setQrOrderCode] = useState('');

  const buildQrData = useCallback(() => {
    setQrDescription(`NAP_TUTORMATCH_${Date.now()}`);
    setQrOrderCode(`TM${Date.now()}`);
    setCountdownSeconds(15 * 60);
  }, []);

  useEffect(() => {
    if (!qrModalVisible) return;
    buildQrData();
  }, [qrModalVisible, buildQrData]);

  useEffect(() => {
    if (!qrModalVisible || countdownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCountdownSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setQrModalVisible(false);
          notification.info({
            message: 'Mã QR đã hết hạn',
            description: 'Vui lòng tạo mã mới để tiếp tục nạp tiền.',
            placement: 'topRight',
            duration: 4,
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrModalVisible, countdownSeconds]);

  const copyToClipboard = (text: string, label = 'Đã sao chép!') => {
    navigator.clipboard.writeText(text).then(() => {
      notification.success({ message: label, duration: 2, placement: 'topRight' });
    });
  };

  const columns: ColumnsType<CreditTransaction> = [
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
      render: (date: string) => (
        <div>
          <Text style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <div style={{ fontSize: 12, color: T.inkMuted48 }}>{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: (type: string) => {
        const cfg = typeConfig[type] || { color: T.inkMuted48, bg: T.dividerSoft, label: type, icon: null };
        return (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 8,
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 500, fontSize: 13,
          }}>
            {cfg.icon}{cfg.label}
          </div>
        );
      },
      filters: Object.entries(typeConfig).map(([value, { label }]) => ({ text: label, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 170,
      align: 'right' as const,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record: CreditTransaction) => {
        const isPositive = record.type === 'Deposit' || record.type === 'Refund';
        return (
          <Text style={{
            color: isPositive ? T.success : T.error,
            fontWeight: 600, fontSize: 14,
          }}>
            {isPositive ? '+' : '-'}{fmtCurrency(Math.abs(amount))}
          </Text>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => (
        <Text style={{ fontSize: 14, color: T.inkMuted80 }}>{desc || '—'}</Text>
      ),
    },
  ];

  const totalSpent = SPENDING_CATEGORIES.reduce((s, c) => s + c.value, 0);

  return (
    <div style={{ padding: '0 0 48px' }}>
      {/* Hero Slideshow 3:1 */}
      <div style={{ position: 'relative', marginBottom: 28, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Carousel
          autoplay
          autoplaySpeed={5000}
          dots
          effect="fade"
          arrows
          prevArrow={<LeftOutlined style={{ color: '#fff', fontSize: 20, zIndex: 2 }} />}
          nextArrow={<RightOutlined style={{ color: '#fff', fontSize: 20, zIndex: 2 }} />}
        >
          {slides.map((slide, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                width: '100%',
                paddingTop: '33.33%',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src={slide.img}
                  alt={slide.slogan}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(0,102,204,0.78) 0%, rgba(20,158,97,0.62) 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '32px 48px',
                }}>
                  <div style={{ maxWidth: 620 }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 20,
                      padding: '4px 16px',
                      marginBottom: 16,
                    }}>
                      <Text style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
                        💳 TutorMatch — Thanh toán & Ví Credit
                      </Text>
                    </div>
                    <Title level={2} style={{ color: '#fff', margin: '0 0 12px', fontWeight: 700, lineHeight: 1.3 }}>
                      {slide.slogan}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, display: 'block', marginBottom: 24 }}>
                      {slide.sub}
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        borderRadius: 10,
                        fontWeight: 600,
                        height: 44,
                        paddingInline: 28,
                        background: '#fff',
                        color: T.primary,
                        border: 'none',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        fontSize: 15,
                      }}
                      onClick={() => {
                        if (slide.ctaAction === 'deposit') {
                          setAmount(500000);
                          setTimeout(() => {
                            const modalEl = document.querySelector('.ant-modal-wrap') as HTMLElement;
                            if (!modalEl) {
                              const btn = document.querySelector('button') as HTMLElement;
                              btn?.click();
                            }
                          }, 100);
                        }
                      }}
                    >
                      {slide.cta} <RightOutlined style={{ fontSize: 12 }} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{
          margin: 0, fontWeight: 600, color: T.ink,
          letterSpacing: '-0.28px',
          fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
        }}>
          Ví Credit
        </Title>
        <Text style={{ fontSize: 14, color: T.inkMuted48 }}>Quản lý số dư và lịch sử giao dịch</Text>
      </div>

      {/* ── Balance + Deposit Row ─────────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Balance Card */}
        <Col xs={24} lg={10}>
          <div style={{
            background: 'linear-gradient(135deg, #0066cc 0%, #0050d6 100%)',
            borderRadius: 18, padding: '28px 32px',
            minHeight: 148,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 400 }}>
                  Số dư hiện tại
                </Text>
                <div style={{
                  fontSize: 36, fontWeight: 600, color: '#fff',
                  lineHeight: 1.2, marginTop: 6,
                  letterSpacing: '-0.5px',
                  fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
                }}>
                  {fmtCurrency(balance)}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[500000, 1000000, 2000000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      style={{
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.15)',
                        color: '#fff', borderRadius: 8,
                        padding: '5px 12px', fontSize: 12,
                        cursor: 'pointer', fontWeight: 500,
                        fontFamily: 'inherit',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      +{v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <WalletOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
            </div>
          </div>
        </Col>

        {/* Deposit CTA */}
        <Col xs={24} lg={14}>
          <div style={{
            background: T.canvas, borderRadius: 18,
            padding: '28px 32px',
            border: `1px solid ${T.hairline}`,
            height: '100%',
            display: 'flex', alignItems: 'center',
            gap: 24,
          }}>
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: '0 0 4px', fontWeight: 600, color: T.ink, letterSpacing: '-0.2px' }}>
                Nạp thêm Credit
              </Title>
              <Text style={{ fontSize: 14, color: T.inkMuted48 }}>
                Thanh toán qua chuyển khoản hoặc ví điện tử. Bắt đầu từ 10,000đ.
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<LoadingOutlined />}
              onClick={() => setQrModalVisible(true)}
              style={{
                borderRadius: 9999, height: 48, paddingLeft: 28, paddingRight: 28,
                fontSize: 15, fontWeight: 500, flexShrink: 0,
                background: T.primary,
              }}
            >
              Nạp ngay
            </Button>
          </div>
        </Col>
      </Row>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Spending Over Time */}
        <Col xs={24} lg={14}>
          <div style={{
            background: T.canvas, borderRadius: 18,
            border: `1px solid ${T.hairline}`,
            padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <Title level={5} style={{ margin: 0, fontWeight: 600, color: T.ink, letterSpacing: '-0.1px' }}>
                  Số tiền đã sử dụng theo tháng
                </Title>
                <Text style={{ fontSize: 12, color: T.inkMuted48 }}>Biểu đồ chi tiêu 6 tháng gần nhất</Text>
              </div>
              <Segmented
                size="small"
                value={timeRange}
                onChange={(val) => setTimeRange(val as string)}
                options={[
                  { label: '3 tháng', value: '3m' },
                  { label: '6 tháng', value: '6m' },
                  { label: 'Tất cả', value: 'all' },
                ]}
              />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={SPENDING_BY_MONTH} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.dividerSoft} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: T.inkMuted48, fontFamily: 'inherit' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: T.inkMuted48, fontFamily: 'inherit' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  width={44}
                />
                <Tooltip content={<SpendingTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={T.primary}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: T.primary, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: T.primary, strokeWidth: 0 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Spending Breakdown */}
        <Col xs={24} lg={10}>
          <div style={{
            background: T.canvas, borderRadius: 18,
            border: `1px solid ${T.hairline}`,
            padding: '24px 28px',
            height: '100%',
          }}>
            <div style={{ marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0, fontWeight: 600, color: T.ink, letterSpacing: '-0.1px' }}>
                Hũ chi tiêu
              </Title>
              <Text style={{ fontSize: 12, color: T.inkMuted48 }}>Tổng đã chi: {fmtCurrency(totalSpent)}</Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Donut */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={SPENDING_CATEGORIES}
                      cx="50%" cy="50%"
                      innerRadius={44}
                      outerRadius={64}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {SPENDING_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 11, color: T.inkMuted48, lineHeight: 1.2 }}>Tổng chi</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>
                    {(totalSpent / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SPENDING_CATEGORIES.map((cat) => {
                  const pct = totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0;
                  return (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                          <Text style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{cat.name}</Text>
                        </div>
                        <Text style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>{fmtCurrency(cat.value)}</Text>
                      </div>
                      <div style={{ height: 4, background: T.parchment, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: cat.color, borderRadius: 2,
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                      <div style={{ textAlign: 'right', marginTop: 2 }}>
                        <Text style={{ fontSize: 11, color: T.inkMuted48 }}>{pct}%</Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Transaction History ─────────────────────────────────────────────── */}
      <div style={{
        background: T.canvas, borderRadius: 18,
        border: `1px solid ${T.hairline}`,
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <HistoryOutlined style={{ color: T.ink }} />
          <Title level={5} style={{ margin: 0, fontWeight: 600, color: T.ink, letterSpacing: '-0.1px' }}>
            Lịch sử giao dịch
          </Title>
        </div>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Tổng ${total} giao dịch` }}
          locale={{ emptyText: 'Chưa có giao dịch nào' }}
          style={{ marginTop: 4 }}
          onChange={() => {}}
        />
      </div>

      {/* ── PayOS QR Modal ─────────────────────────────────────────────────── */}
      <Modal
        title={
          <div style={{ fontWeight: 600, fontSize: 16, color: T.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrcodeOutlined style={{ color: T.primary }} />
            Nạp Credit qua PayOS
          </div>
        }
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={null}
        width={780}
        destroyOnClose
        styles={{ body: { padding: '16px 20px' } }}
      >
        {/* ── Horizontal layout: left = QR, right = info ─────────────────────── */}
        <Row gutter={[28, 0]} align="top">

          {/* ── Left: QR Code ──────────────────────────────────────────────── */}
          <Col xs={24} sm={11}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: 8 }}>

              {/* PayOS brand */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: T.parchment, borderRadius: 9999,
                padding: '5px 14px', marginBottom: 20,
              }}>
                <QrcodeOutlined style={{ color: T.primary, fontSize: 13 }} />
                <Text style={{ fontSize: 12, color: T.inkMuted48, fontWeight: 500 }}>
                  Thanh toán qua PayOS
                </Text>
              </div>

              {/* QR code card */}
              <div style={{
                padding: 20, background: T.canvas,
                borderRadius: 18, border: `1px solid ${T.hairline}`,
                marginBottom: 20,
              }}>
                <QRCodeCanvas
                  value={`https://img.vietqr.io/image/${'TPB'}-${'1234567890'}-${encodeURIComponent('CONG TY TNHH TUTORMATCH')}.png?amount=${amount}&addInfo=${encodeURIComponent(qrDescription)}&accountName=${encodeURIComponent('CONG TY TNHH TUTORMATCH')}`}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1d1d1f"
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Countdown */}
              <div style={{ width: '100%', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  <ClockCircleOutlined style={{ color: countdownSeconds < 120 ? T.error : T.inkMuted48, fontSize: 13 }} />
                  <Text style={{ fontSize: 13, color: countdownSeconds < 120 ? T.error : T.inkMuted48 }}>
                    Mã QR hết hạn sau{' '}
                    <strong style={{ fontFamily: 'monospace' }}>
                      {String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:
                      {String(countdownSeconds % 60).padStart(2, '0')}
                    </strong>
                  </Text>
                </div>
                <div style={{ height: 5, background: T.parchment, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(countdownSeconds / (15 * 60)) * 100}%`,
                    background: countdownSeconds < 120 ? T.error : T.primary,
                    borderRadius: 3,
                    transition: 'width 1s linear, background 0.3s ease',
                  }} />
                </div>
              </div>

              {/* Refresh button */}
              <Button
                icon={<ReloadOutlined />}
                onClick={buildQrData}
                style={{ borderRadius: 9999, fontSize: 13 }}
              >
                Làm mới mã QR
              </Button>
            </div>
          </Col>

          {/* Vertical divider */}
          <Col xs={24} sm={1} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 1, background: T.hairline, alignSelf: 'stretch' }} />
          </Col>

          {/* ── Right: bank info & confirm ────────────────────────────────────── */}
          <Col xs={24} sm={12}>
            <div style={{ paddingLeft: 8 }}>

              {/* Amount selection label */}
              <Text style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 500, color: T.ink }}>
                Chọn hoặc nhập số tiền nạp
              </Text>

              {/* Quick amount chips */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {[100000, 200000, 500000, 1000000, 2000000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    style={{
                      border: amount === v ? `2px solid ${T.primary}` : `1px solid ${T.hairline}`,
                      background: amount === v ? 'rgba(0,102,204,0.06)' : T.canvas,
                      color: amount === v ? T.primary : T.ink,
                      borderRadius: 8, padding: '7px 16px',
                      fontSize: 13, cursor: 'pointer', fontWeight: 600,
                      fontFamily: 'inherit',
                    }}
                  >
                    {fmtCurrency(v)}
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <div style={{ marginBottom: 18 }}>
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  min={10000}
                  step={10000}
                  value={amount}
                  onChange={(value) => setAmount(value || 0)}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/,/g, '') as unknown as number}
                />
              </div>

              {/* Bank info card */}
              <div style={{
                background: T.parchment, borderRadius: 14,
                padding: '16px 18px', marginBottom: 18,
              }}>
                <Text style={{ display: 'block', marginBottom: 12, fontSize: 12, fontWeight: 600, color: T.inkMuted48, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Thông tin chuyển khoản
                </Text>
                {[
                  { label: 'Chủ tài khoản', value: 'CONG TY TNHH TUTORMATCH', copy: true },
                  { label: 'Số tài khoản', value: '1234567890', copy: true },
                  { label: 'Ngân hàng', value: 'TPBank (TPB)', copy: false },
                  { label: 'Nội dung CK', value: qrDescription || '—', copy: true, highlight: true },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${T.hairline}` }}>
                    <Text style={{ fontSize: 13, color: T.inkMuted48 }}>{row.label}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, maxWidth: '60%', justifyContent: 'flex-end' }}>
                      <Text style={{
                        fontSize: 13, fontWeight: row.highlight ? 600 : 400,
                        color: row.highlight ? T.primary : T.ink,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {row.value}
                      </Text>
                      {row.copy && (
                        <CopyOutlined
                          style={{ color: T.inkMuted48, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
                          onClick={() => copyToClipboard(row.value, 'Đã sao chép!')}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Amount total highlight */}
              <div style={{
                background: `linear-gradient(135deg, ${T.primary} 0%, #0050d6 100%)`,
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 18,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  Số tiền thanh toán
                </Text>
                <Text style={{
                  fontSize: 22, fontWeight: 600, color: '#fff',
                  letterSpacing: '-0.3px',
                  fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
                }}>
                  {fmtCurrency(amount)}
                </Text>
              </div>

              {/* Confirm button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={() => {
                  setQrModalVisible(false);
                  setQrSuccessVisible(true);
                }}
                disabled={amount < 10000}
                style={{ borderRadius: 12, height: 50, fontSize: 15, fontWeight: 500, background: T.primary }}
              >
                Xác nhận đã chuyển khoản
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>

      {/* ── QR Payment Success Modal ────────────────────────────────────────── */}
      <Modal
        open={qrSuccessVisible}
        onCancel={() => setQrSuccessVisible(false)}
        footer={null}
        width={400}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: T.successBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircleFilled style={{ fontSize: 40, color: T.success }} />
          </div>

          <Title level={4} style={{ margin: '0 0 8px', fontWeight: 600, color: T.ink }}>
            Xác nhận thanh toán
          </Title>
          <Text style={{ display: 'block', marginBottom: 24, fontSize: 14, color: T.inkMuted48 }}>
            Yêu cầu nạp <strong style={{ color: T.ink }}>{fmtCurrency(amount)}</strong> đã được gửi.
            <br />Credit sẽ được cộng sau khi admin xác nhận.
          </Text>

          <Space style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button
              size="large"
              onClick={() => setQrSuccessVisible(false)}
              style={{ borderRadius: 9999, paddingLeft: 24, paddingRight: 24 }}
            >
              Đóng
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setQrSuccessVisible(false);
                notification.success({
                  message: 'Đã xác nhận!',
                  description: `Yêu cầu nạp ${fmtCurrency(amount)} đang chờ admin duyệt.`,
                  placement: 'topRight',
                  duration: 4,
                });
              }}
              style={{ borderRadius: 9999, paddingLeft: 24, paddingRight: 24, background: T.primary }}
            >
              Theo dõi ví
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
