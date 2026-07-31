import React, { useState } from 'react';
import {
  Card, Typography, Row, Col, Table, InputNumber, Button,
  Modal, App, Segmented, Space,
} from 'antd';
import {
  WalletOutlined, LoadingOutlined, HistoryOutlined,
  ArrowUpOutlined, ArrowDownOutlined, BankOutlined,
} from '@ant-design/icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import { MOCK_TRANSACTIONS, MOCK_DASHBOARD_STATS } from '../../data/mockData';
import type { CreditTransaction } from '../../types';

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
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [amount, setAmount] = useState<number>(500000);
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('all');

  const handleDeposit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setDepositModalVisible(false);
    notification.success({
      message: 'Yêu cầu nạp tiền đã được gửi!',
      description: `Yêu cầu nạp ${fmtCurrency(amount)} đã được gửi đến admin. Credit sẽ được cộng sau khi được duyệt.`,
      placement: 'topRight',
      duration: 4,
    });
    setAmount(500000);
    setNote('');
  };

  const confirmDeposit = () => {
    if (amount < 10000) return;
    Modal.confirm({
      title: 'Xác nhận nạp Credit',
      icon: <BankOutlined style={{ color: T.primary }} />,
      content: (
        <div>
          <p style={{ fontSize: 14, color: T.ink }}>
            Bạn muốn nạp <strong>{fmtCurrency(amount)}</strong> vào ví của mình?
          </p>
          <div style={{
            marginTop: 12, padding: '10px 14px',
            background: T.parchment, borderRadius: 8,
            fontSize: 12, color: T.inkMuted80,
          }}>
            Sau khi gửi yêu cầu, vui lòng chờ admin xác nhận. Credit sẽ được cộng sau khi được duyệt.
          </div>
        </div>
      ),
      okText: 'Xác nhận nạp',
      cancelText: 'Hủy',
      onOk: handleDeposit,
      okButtonProps: { loading: submitting },
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
              onClick={() => setDepositModalVisible(true)}
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

      {/* ── Deposit Modal ──────────────────────────────────────────────────── */}
      <Modal
        title={
          <div style={{ fontWeight: 600, fontSize: 16, color: T.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BankOutlined style={{ color: T.primary }} />
            Nạp Credit
          </div>
        }
        open={depositModalVisible}
        onCancel={() => setDepositModalVisible(false)}
        footer={null}
        width={480}
        destroyOnClose
        styles={{ body: { padding: '8px 0' } }}
      >
        <Text style={{ display: 'block', marginBottom: 20, fontSize: 14, color: T.inkMuted48 }}>
          Nhập số tiền bạn muốn nạp. Yêu cầu sẽ được gửi đến admin để duyệt.
        </Text>

        {/* Quick amount chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[100000, 200000, 500000, 1000000, 2000000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              style={{
                border: amount === v ? `2px solid ${T.primary}` : `1px solid ${T.hairline}`,
                background: amount === v ? 'rgba(0,102,204,0.06)' : T.canvas,
                color: amount === v ? T.primary : T.ink,
                borderRadius: 8, padding: '6px 14px',
                fontSize: 13, cursor: 'pointer', fontWeight: 500,
                fontFamily: 'inherit',
              }}
            >
              {fmtCurrency(v)}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14, color: T.ink }}>
            Số tiền (VNĐ)
          </label>
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

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14, color: T.ink }}>
            Ghi chú (tùy chọn)
          </label>
          <InputNumber
            style={{ width: '100%', fontSize: 14 }}
            size="large"
            placeholder="Nội dung chuyển khoản hoặc ghi chú..."
            value={note || undefined}
            onChange={(value) => setNote(value?.toString() || '')}
            formatter={(value) => value?.toString() || ''}
            parser={(value) => value?.toString() || ''}
          />
        </div>

        <div style={{
          marginBottom: 20, padding: '12px 16px',
          background: T.parchment, borderRadius: 8,
          fontSize: 13, color: T.inkMuted80,
          border: `1px solid ${T.dividerSoft}`,
        }}>
          <strong style={{ color: T.ink }}>Lưu ý:</strong> Sau khi gửi yêu cầu, vui lòng chờ admin xác nhận. Credit sẽ được cộng sau khi được duyệt.
        </div>

        <Space style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => setDepositModalVisible(false)} size="large">Hủy</Button>
          <Button
            type="primary"
            size="large"
            onClick={confirmDeposit}
            loading={submitting}
            disabled={amount < 10000}
            style={{ minWidth: 140, background: T.primary }}
          >
            Nạp tiền
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default Wallet;
