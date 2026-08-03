import React, { useState, useRef } from 'react';
import {
  Card, Table, Tag, Button, Input, Select, Row, Col,
  Typography, Avatar, Statistic, message, Modal, Carousel,
} from 'antd';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  WalletOutlined, ArrowUpOutlined, ArrowDownOutlined,
  SearchOutlined, FilterOutlined, HistoryOutlined,
  CreditCardOutlined, GiftOutlined, ExclamationCircleOutlined,
  LeftOutlined, RightOutlined,
} from '@ant-design/icons';
import tutorImg1 from '../../assets/image/tutor/TTP_TUTOR_1.png';
import tutorImg2 from '../../assets/image/tutor/TTP_TUTOR_2.png';
import tutorImg3 from '../../assets/image/tutor/TTP_TUTOR_3.png';
import { mockTransactions, monthlyTrendData } from '../../data/tutorMockData';
import type { CreditTransaction, CreditTransactionType } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  red: '#dc2626', redLight: 'rgba(220,38,38,0.08)',
  yellow: '#f59e0b', blue: '#3b82f6', blueLight: 'rgba(59,130,246,0.08)',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 });

const typeConfig: Record<CreditTransactionType, { color: string; label: string; bg: string }> = {
  Deposit: { color: T.green, label: 'Nạp tiền', bg: T.greenLight },
  SessionFee: { color: T.primary, label: 'Phí buổi học', bg: T.primaryLight },
  LateCancellationFee: { color: T.red, label: 'Phí hủy muộn', bg: T.redLight },
  Refund: { color: T.blue, label: 'Hoàn tiền', bg: T.blueLight },
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 500, color: p.color }}>
          {p.name}: {fmtVnd(p.value)}
        </div>
      ))}
    </div>
  );
};

const TutorWallet: React.FC = () => {
  const carouselRef = useRef<any>(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<CreditTransaction | null>(null);

  const filtered = mockTransactions.filter(t => {
    const matchSearch = !searchText ||
      (t.description || '').toLowerCase().includes(searchText.toLowerCase());
    const matchType = !typeFilter || t.type === typeFilter;
    return matchSearch && matchType;
  });

  // Stats
  const balance = 2500000;
  const deposits = mockTransactions.filter(t => t.type === 'Deposit').reduce((sum, t) => sum + t.amount, 0);
  const sessionFees = mockTransactions.filter(t => t.type === 'SessionFee').reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = mockTransactions.length;

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <Text style={{ fontSize: 13 }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <div><Text type="secondary" style={{ fontSize: 11 }}>{dayjs(date).format('HH:mm')}</Text></div>
        </div>
      ),
      sorter: (a: CreditTransaction, b: CreditTransaction) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Nạp tiền', value: 'Deposit' },
        { text: 'Phí buổi học', value: 'SessionFee' },
        { text: 'Phí hủy muộn', value: 'LateCancellationFee' },
        { text: 'Hoàn tiền', value: 'Refund' },
      ],
      onFilter: (value: any, record: CreditTransaction) => record.type === value,
      render: (type: CreditTransactionType) => {
        const cfg = typeConfig[type];
        return (
          <Tag style={{
            borderRadius: 20, fontWeight: 600, border: 'none',
            background: cfg.bg, color: cfg.color, fontSize: 12,
          }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <Text style={{ fontSize: 13 }} ellipsis={{ tooltip: desc }}>{desc || '—'}</Text>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: CreditTransaction) => {
        const isPositive = record.type === 'Deposit' || record.type === 'Refund';
        return (
          <Text style={{
            color: isPositive ? T.green : T.red,
            fontWeight: 500, fontSize: 14,
          }}>
            {isPositive ? '+' : '-'}{fmtVnd(amount)}
          </Text>
        );
      },
      sorter: (a: CreditTransaction, b: CreditTransaction) => a.amount - b.amount,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: CreditTransaction) => (
        <Button size="small" onClick={() => setDetailModal(record)} style={{ borderRadius: 8 }}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const tutorImages = [
    { src: tutorImg1, slogan: 'Quản lý tài chính thông minh', sub: 'Theo dõi thu nhập dễ dàng' },
    { src: tutorImg2, slogan: 'Rút tiền nhanh chóng, an toàn', sub: 'Hệ thống bảo mật hàng đầu' },
    { src: tutorImg3, slogan: 'Minh bạch mọi giao dịch', sub: 'Lịch sử rõ ràng, chi tiết' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: T.text, letterSpacing: '-0.3px' }}>Ví Credit</h1>
        <Text type="secondary">Theo dõi thu nhập và lịch sử giao dịch</Text>
      </div>

      {/* Banner Slider */}
      <div style={{ position: 'relative', marginBottom: 20, borderRadius: 14, overflow: 'hidden' }}>
        <Carousel ref={carouselRef} autoplay autoplaySpeed={4000} dotPosition="bottom" dots draggable>
          {tutorImages.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img src={item.src} alt={`Wallet banner ${index + 1}`} style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 2 }}>
                <div style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '12px 18px', display: 'inline-block', maxWidth: 420 }}>
                  <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{item.slogan}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 400, marginTop: 3 }}>{item.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <Button icon={<LeftOutlined />} onClick={() => carouselRef.current?.prev()} style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', borderRadius: '50%', width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.85)', color: T.text, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} />
        <Button icon={<RightOutlined />} onClick={() => carouselRef.current?.next()} style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', borderRadius: '50%', width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.85)', color: T.text, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} />
      </div>

      {/* Balance + Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={8}>
          <div style={{
            ...CARD_STYLE,
            background: 'linear-gradient(135deg, #7132f5 0%, #5741d8 100%)',
            minHeight: 130,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24,
              }}>
                <WalletOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Số dư hiện tại</div>
                <div style={{ fontSize: 30, fontWeight: 500, color: '#fff', letterSpacing: '-0.5px' }}>
                  {fmtVnd(balance)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Tag style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 20 }}>
                <WalletOutlined style={{ marginRight: 4 }} />Sẵn sàng rút
              </Tag>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={5}>
          <div style={{ ...CARD_STYLE, minHeight: 130 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontSize: 16 }}>
                <ArrowUpOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Đã nạp</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: T.green }}>{fmtVnd(deposits)}</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={5}>
          <div style={{ ...CARD_STYLE, minHeight: 130 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary, fontSize: 16 }}>
                <CreditCardOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Phí buổi dạy</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: T.primary }}>{fmtVnd(sessionFees)}</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6}>
          <div style={{ ...CARD_STYLE, minHeight: 130 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.blue, fontSize: 16 }}>
                <HistoryOutlined />
              </div>
              <div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Tổng giao dịch</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: T.text }}>{totalTransactions}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Doanh thu theo tháng</div>
          <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>6 tháng gần nhất</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyTrendData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.primary} stopOpacity={0.12} />
                <stop offset="95%" stopColor={T.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke={T.primary} strokeWidth={2.5}
              fill="url(#gradRevenue)" dot={{ r: 3, fill: T.primary, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Lịch sử giao dịch</div>
            <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{filtered.length} giao dịch</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
              value={searchText} onChange={e => setSearchText(e.target.value)} style={{ borderRadius: 10, width: 200 }} allowClear />
            <Select placeholder="Loại giao dịch" allowClear style={{ width: 160 }} onChange={v => setTypeFilter(v)}>
              <Option value="Deposit">Nạp tiền</Option>
              <Option value="SessionFee">Phí buổi học</Option>
              <Option value="LateCancellationFee">Phí hủy muộn</Option>
              <Option value="Refund">Hoàn tiền</Option>
            </Select>
          </div>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} giao dịch` }}
          size="middle"
          locale={{ emptyText: 'Chưa có giao dịch nào' }}
          style={{ borderRadius: 8 }}
          scroll={{ x: 700 }}
        />
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        title="Chi tiết giao dịch"
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={null}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {detailModal && (
          <div>
            <div style={{
              textAlign: 'center', padding: '16px 0', marginBottom: 16,
              background: typeConfig[detailModal.type].bg, borderRadius: 12,
            }}>
              <div style={{ fontSize: 13, color: T.textMuted }}>{typeConfig[detailModal.type].label}</div>
              <div style={{
                fontSize: 28, fontWeight: 500, marginTop: 4,
                color: (detailModal.type === 'Deposit' || detailModal.type === 'Refund') ? T.green : T.primary,
              }}>
                {(detailModal.type === 'Deposit' || detailModal.type === 'Refund') ? '+' : '-'}{fmtVnd(detailModal.amount)}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Ngày', value: dayjs(detailModal.createdAt).format('DD/MM/YYYY HH:mm') },
                { label: 'Loại', value: typeConfig[detailModal.type].label },
                { label: 'Mô tả', value: detailModal.description || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  <Text strong style={{ fontSize: 14, maxWidth: '60%', textAlign: 'right' }}>{item.value}</Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorWallet;
