import React, { useState, useMemo, useCallback } from 'react';
import { Table, Button, Space, Input, Tag, Select, Modal, Form, Popconfirm, App } from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  CheckOutlined, CloseOutlined, FilterOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

// ─── Design Tokens (Modern Blue) ─────────────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',

  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',

  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',

  blue:          '#3b82f6',
  blueLight:     'rgba(59,130,246,0.08)',
  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  purple:        '#8b5cf6',
  purpleLight:   'rgba(139,92,246,0.08)',
};

const FONT_HEAD = "'SF Pro Display', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'SF Pro Text', system-ui, -apple-system, sans-serif";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subject {
  id: number;
  name: string;
  description: string;
  tutorCount: number;
  isActive: boolean;
  createdAt: string;
  accentColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SUBJECTS: Subject[] = [
  { id: 1,  name: 'Toán học',        description: 'Toán học từ cơ bản đến nâng cao, ôn thi THPT và Đại học',  tutorCount: 85,  isActive: true,  createdAt: '2026-01-10', accentColor: '#4f6ef7' },
  { id: 2,  name: 'Ngữ văn',         description: 'Ngữ văn THPT, kỹ năng viết và phân tích văn học',         tutorCount: 42,  isActive: true,  createdAt: '2026-01-12', accentColor: '#8b5cf6' },
  { id: 3,  name: 'Tiếng Anh',        description: 'Tiếng Anh giao tiếp, ngữ pháp, luyện thi các cấp',       tutorCount: 120, isActive: true,  createdAt: '2026-01-15', accentColor: '#10b981' },
  { id: 4,  name: 'Vật lý',          description: 'Vật lý THPT và luyện thi Đại học, chuyên đề nâng cao',     tutorCount: 58,  isActive: true,  createdAt: '2026-01-18', accentColor: '#f59e0b' },
  { id: 5,  name: 'Hóa học',         description: 'Hóa học cơ bản và nâng cao, thí nghiệm và ứng dụng',       tutorCount: 36,  isActive: true,  createdAt: '2026-02-01', accentColor: '#ef4444' },
  { id: 6,  name: 'Sinh học',         description: 'Sinh học THPT, di truyền học và sinh thái học',          tutorCount: 27,  isActive: true,  createdAt: '2026-02-05', accentColor: '#06b6d4' },
  { id: 7,  name: 'Lịch sử',          description: 'Lịch sử Việt Nam và thế giới, ôn thi THPTQG',              tutorCount: 19,  isActive: true,  createdAt: '2026-02-10', accentColor: '#ec4899' },
  { id: 8,  name: 'Địa lý',          description: 'Địa lý tự nhiên và kinh tế-xã hội, bản đồ học',         tutorCount: 15,  isActive: true,  createdAt: '2026-02-15', accentColor: '#84cc16' },
  { id: 9,  name: 'GDCD',             description: 'Giáo dục công dân, pháp luật và đạo đức',               tutorCount: 11,  isActive: false, createdAt: '2026-03-01', accentColor: '#f97316' },
  { id: 10, name: 'Tin học',           description: 'Lập trình cơ bản, Python, C++, tin học văn phòng',        tutorCount: 63,  isActive: true,  createdAt: '2026-03-10', accentColor: '#6366f1' },
  { id: 11, name: 'IELTS',            description: 'Luyện thi IELTS tổng hợp, các kỹ năng và chiến lược',   tutorCount: 74,  isActive: true,  createdAt: '2026-04-01', accentColor: '#10b981' },
  { id: 12, name: 'SAT / ACT',         description: 'Luyện thi SAT, ACT cho du học sinh quốc tế',             tutorCount: 22,  isActive: false, createdAt: '2026-05-01', accentColor: '#8b5cf6' },
];

// ─── Subject Color Dot ─────────────────────────────────────────────────────────
const SubjectDot = ({ color }: { color: string }) => (
  <span style={{
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    marginRight: 8,
    flexShrink: 0,
  }} />
);

// ─── Status Tag ───────────────────────────────────────────────────────────────
const StatusTag = ({ isActive }: { isActive: boolean }) => (
  <Tag
    color={isActive ? 'green' : 'red'}
    style={{ borderRadius: 9999, fontWeight: 600, fontSize: 12, border: 'none' }}
  >
    {isActive ? 'Hoạt động' : 'Tạm khóa'}
  </Tag>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Subjects: React.FC = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  // ── State ─────────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Filtered Data ─────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return subjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && subject.isActive) ||
        (filterStatus === 'inactive' && !subject.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [subjects, searchText, filterStatus]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAdd = useCallback(() => {
    setEditingSubject(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalOpen(true);
  }, [form]);

  const handleEdit = useCallback((subject: Subject) => {
    setEditingSubject(subject);
    form.setFieldsValue({
      name: subject.name,
      description: subject.description,
      isActive: subject.isActive,
    });
    setIsModalOpen(true);
  }, [form]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingSubject(null);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API

      if (editingSubject) {
        // Edit mode
        setSubjects(prev =>
          prev.map(s => s.id === editingSubject.id ? { ...s, ...values } : s)
        );
        notification.success({
          message: 'Cập nhật thành công',
          description: `Môn học "${values.name}" đã được cập nhật.`,
          placement: 'topRight',
          duration: 3,
        });
      } else {
        // Add mode
        const isDuplicate = subjects.some(
          s => s.name.toLowerCase().trim() === values.name.toLowerCase().trim()
        );
        if (isDuplicate) {
          form.setFields([
            { name: 'name', errors: ['Tên môn học đã tồn tại trong hệ thống.'] },
          ]);
          setSubmitting(false);
          return;
        }
        const newSubject: Subject = {
          id: Math.max(...subjects.map(s => s.id)) + 1,
          name: values.name.trim(),
          description: values.description?.trim() ?? '',
          tutorCount: 0,
          isActive: values.isActive ?? true,
          createdAt: dayjs().format('YYYY-MM-DD'),
          accentColor: '#4f6ef7',
        };
        setSubjects(prev => [newSubject, ...prev]);
        notification.success({
          message: 'Thêm môn học thành công',
          description: `Môn học "${values.name}" đã được thêm vào hệ thống.`,
          placement: 'topRight',
          duration: 3,
        });
      }

      handleModalClose();
    } catch {
      // Validation error — antd handles display
    } finally {
      setSubmitting(false);
    }
  }, [form, editingSubject, subjects, handleModalClose, notification]);

  const handleDelete = useCallback((subject: Subject) => {
    setSubjects(prev => prev.filter(s => s.id !== subject.id));
    notification.success({
      message: 'Đã xóa môn học',
      description: `Môn học "${subject.name}" đã được xóa khỏi hệ thống.`,
      placement: 'topRight',
      duration: 3,
    });
  }, [notification]);

  const handleToggleStatus = useCallback((subject: Subject) => {
    setSubjects(prev =>
      prev.map(s =>
        s.id === subject.id ? { ...s, isActive: !s.isActive } : s
      )
    );
    notification.info({
      message: subject.isActive ? 'Đã tạm khóa môn học' : 'Đã kích hoạt môn học',
      description: `Môn học "${subject.name}" đã được ${subject.isActive ? 'tạm khóa' : 'kích hoạt'}.`,
      placement: 'topRight',
      duration: 3,
    });
  }, [notification]);

  // ── Table Columns ─────────────────────────────────────────────────────────
  const columns: React.ComponentProps<typeof Table<Subject>>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 64,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      render: (id: number) => (
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, color: T.textSubtle, fontSize: 12 }}>
          {id.toString().padStart(3, '0')}
        </span>
      ),
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      filters: subjects.map(s => ({ text: s.name, value: s.name })),
      onFilter: (value, record) => record.name === value,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Subject) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SubjectDot color={record.accentColor} />
          <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: T.text }}>
            {name}
          </span>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>
          {description || '—'}
        </span>
      ),
    },
    {
      title: 'Số gia sư',
      dataIndex: 'tutorCount',
      key: 'tutorCount',
      width: 110,
      align: 'center',
      sorter: (a, b) => a.tutorCount - b.tutorCount,
      render: (count: number) => (
        <span style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          fontWeight: 700,
          color: count > 0 ? T.accent : T.textSubtle,
        }}>
          {count}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, minWidth: 160 }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 8 }}>
            Lọc theo trạng thái
          </div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              size="small"
              icon={<CheckOutlined />}
              type={selectedKeys.includes('active') ? 'primary' : 'default'}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
              onClick={() => {
                setSelectedKeys(selectedKeys.includes('active') ? [] : ['active']);
                confirm();
              }}
            >
              Hoạt động
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              type={selectedKeys.includes('inactive') ? 'primary' : 'default'}
              danger={selectedKeys.includes('inactive')}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
              onClick={() => {
                setSelectedKeys(selectedKeys.includes('inactive') ? [] : ['inactive']);
                confirm();
              }}
            >
              Tạm khóa
            </Button>
            <Button size="small" block onClick={() => { clearFilters?.(); confirm(); }} style={{ borderRadius: 8 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <FilterOutlined style={{ color: T.accent }} />,
      onFilter: (value, record) => {
        if (value === 'active') return record.isActive;
        if (value === 'inactive') return !record.isActive;
        return true;
      },
      render: (isActive: boolean) => <StatusTag isActive={isActive} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center',
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_: unknown, record: Subject) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: T.accent, fontSize: 13 }} />}
            onClick={() => handleEdit(record)}
            style={{ borderRadius: 8 }}
          />
          <Button
            type="text"
            icon={record.isActive
              ? <CloseOutlined style={{ color: T.orange, fontSize: 13 }} />
              : <CheckOutlined style={{ color: T.green, fontSize: 13 }} />
            }
            onClick={() => handleToggleStatus(record)}
            title={record.isActive ? 'Tạm khóa' : 'Kích hoạt'}
            style={{ borderRadius: 8 }}
          />
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc muốn xóa môn học "${record.name}"?`}
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: T.red, fontSize: 13 }} />}
              style={{ borderRadius: 8 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isEditMode = !!editingSubject;

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: FONT_HEAD,
          fontSize: 18,
          fontWeight: 700,
          color: T.text,
          margin: '0 0 2px',
          letterSpacing: '-0.3px',
        }}>
          Quản lý môn học
        </h1>
        <p style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: T.textMuted,
          margin: 0,
        }}>
          Thêm, chỉnh sửa và quản lý danh sách môn học trên nền tảng.
        </p>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 16,
      }}>
        {[
          { label: 'Tổng môn học', value: subjects.length, color: T.accent },
          { label: 'Đang hoạt động', value: subjects.filter(s => s.isActive).length, color: T.green },
          { label: 'Tạm khóa', value: subjects.filter(s => !s.isActive).length, color: T.red },
        ].map(stat => (
          <div key={stat.label} style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${stat.color}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontFamily: FONT_HEAD, fontSize: 14, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
        flexWrap: 'wrap',
      }}>
        <Space size={6}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 180, borderRadius: 8, fontFamily: FONT_BODY, fontSize: 12 }}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 120, borderRadius: 8, fontFamily: FONT_BODY, fontSize: 9 }}
            options={[
              { value: 'all',     label: 'Tất cả' },
              { value: 'active',  label: 'Hoạt động' },
              { value: 'inactive', label: 'Tạm khóa' },
            ]}
          />
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{
            borderRadius: 8,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            height: 30,
            paddingInline: 12,
            background: T.accent,
            border: 'none',
            fontSize: 12,
          }}
        >
          Thêm môn học
        </Button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Table<Subject>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textMuted }}>
                Tổng <strong style={{ color: T.text }}>{total}</strong> môn học
              </span>
            ),
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          style={{
            background: T.card,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${T.border}`,
          }}
          size="small"
          rowHoverable
          onChange={() => {}}
          components={{
            header: {
              cell: ({ children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                <th
                  {...rest}
                  style={{
                    ...(rest as React.TdHTMLAttributes<HTMLTableCellElement>).style,
                    fontFamily: FONT_HEAD,
                    fontWeight: 700,
                    fontSize: 11,
                    color: T.textMuted,
                    background: '#f8f9fb',
                    padding: '7px 12px',
                  }}
                >
                  {children}
                </th>
              ),
            },
          }}
        />
      </motion.div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalClose}
        title={
          <div style={{
            fontFamily: FONT_HEAD,
            fontSize: 15,
            fontWeight: 700,
            color: T.text,
            letterSpacing: '-0.2px',
            paddingRight: 24,
          }}>
            {isEditMode ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
          </div>
        }
        okText={isEditMode ? 'Lưu thay đổi' : 'Thêm môn học'}
        cancelText="Hủy bỏ"
        okButtonProps={{
          style: {
            borderRadius: 8,
            background: T.accent,
            border: 'none',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 13,
          },
          loading: submitting,
        }}
        cancelButtonProps={{
          style: { borderRadius: 8, fontFamily: FONT_BODY, fontSize: 13 },
        }}
        onOk={handleSave}
        destroyOnClose
        width={440}
        centered
        styles={{
          body: { padding: '16px 20px 4px' },
          footer: { padding: '12px 20px 16px', borderTop: `1px solid ${T.borderLight}` },
          header: { borderBottom: `1px solid ${T.borderLight}`, padding: '14px 20px 12px', marginBottom: 0 },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ marginTop: 4 }}
        >
          <Form.Item
            name="name"
            label={<span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text }}>Tên môn học</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập tên môn học' },
              { min: 2, message: 'Tên môn học phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên môn học không được vượt quá 100 ký tự' },
            ]}
          >
            <Input
              placeholder="VD: Toán học, Tiếng Anh, Vật lý..."
              style={{ borderRadius: 8, fontFamily: FONT_BODY }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text }}>Mô tả</span>}
            rules={[
              { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' },
            ]}
          >
            <Input.TextArea
              placeholder="Mô tả ngắn gọn về môn học, nội dung giảng dạy..."
              rows={2}
              showCount
              maxLength={500}
              style={{ borderRadius: 8, fontFamily: FONT_BODY, resize: 'none' }}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label={<span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text }}>Trạng thái</span>}
            initialValue={true}
          >
            <Select
              style={{ borderRadius: 8, fontFamily: FONT_BODY }}
              options={[
                { value: true,  label: 'Hoạt động',  style: { color: T.green } },
                { value: false, label: 'Tạm khóa',   style: { color: T.red   } },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Subjects;
