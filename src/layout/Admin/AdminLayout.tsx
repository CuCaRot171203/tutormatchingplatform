import React from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import logoUrl from '../../assets/branding/Logo.png';
import {
  HomeOutlined, UserAddOutlined, BookOutlined,
  DollarCircleOutlined, ExclamationCircleOutlined,
  TeamOutlined, VideoCameraOutlined, UserOutlined,
  LeftOutlined, BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { useSidebarStore } from '../../stores';
import CustomScrollbar from '../../components/CustomScrollbar/CustomScrollbar';

const { Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  children?: MenuItem[];
}

const adminMenuItems: MenuItem[] = [
  { key: 'dashboard',       icon: <HomeOutlined />,             label: 'Tổng quan',            path: '/admin/dashboard' },
  { key: 'tutors',          icon: <UserAddOutlined />,           label: 'Duyệt gia sư',         path: '/admin/tutors/pending' },
  { key: 'subjects',        icon: <BookOutlined />,              label: 'Quản lý môn học',      path: '/admin/subjects' },
  {
    key: 'credits-group',
    icon: <DollarCircleOutlined />,
    label: 'Credits & Khiếu nại',
    path: '/admin/credits/pending',
    children: [
      { key: 'credits',        icon: <DollarCircleOutlined />,      label: 'Yêu cầu nạp tiền',    path: '/admin/credits/pending' },
      { key: 'complaints',     icon: <ExclamationCircleOutlined />, label: 'Khiếu nại',            path: '/admin/credits/complaints' },
    ],
  },
  { key: 'users',           icon: <TeamOutlined />,             label: 'Quản lý người dùng',  path: '/admin/users' },
  { key: 'sessions',        icon: <VideoCameraOutlined />,       label: 'Giám sát phiên',       path: '/admin/sessions' },
  { key: 'notifications',   icon: <BellOutlined />,             label: 'Thông báo',            path: '/admin/notifications' },
  { key: 'profile',        icon: <UserOutlined />,              label: 'Hồ sơ',                path: '/admin/profile' },
];

const AdminLayout: React.FC = () => {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = (): string => {
    const currentPath = location.pathname;
    for (const item of adminMenuItems) {
      if (item.path === currentPath) return item.key;
      if ('children' in item && item.children) {
        for (const child of item.children) {
          if (currentPath.startsWith(child.path)) return child.key;
        }
      }
    }
    return 'dashboard';
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    for (const item of adminMenuItems) {
      if (item.key === key) { navigate(item.path); return; }
      if (item.children) {
        const child = item.children.find((c) => c.key === key);
        if (child) { navigate(child.path); return; }
      }
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'tutors',
      icon: <UserAddOutlined />,
      label: 'Duyệt gia sư',
    },
    {
      key: 'subjects',
      icon: <BookOutlined />,
      label: 'Quản lý môn học',
    },
    {
      key: 'credits-group',
      icon: <DollarCircleOutlined />,
      label: 'Credits & Khiếu nại',
      children: [
        {
          key: 'credits',
          icon: <DollarCircleOutlined />,
          label: 'Yêu cầu nạp tiền',
        },
        {
          key: 'complaints',
          icon: <ExclamationCircleOutlined />,
          label: 'Khiếu nại',
        },
      ],
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: 'sessions',
      icon: <VideoCameraOutlined />,
      label: 'Giám sát phiên',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e8eaed',
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          zIndex: 99,
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        }}
        width={230}
        collapsedWidth={72}
      >
        {/* Logo + Brand */}
        <div style={{
          height: 64,
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 0' : '0 16px',
          borderBottom: '1px solid #e8eaed',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 8,
          }}>
            <img src={logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            {!collapsed && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1d26', fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: '-0.3px', lineHeight: 1.3 }}>TutorMatch</div>
                <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: "'IBM Plex Sans', sans-serif" }}>Admin Panel</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu with Custom Scrollbar */}
        <CustomScrollbar style={{ flex: 1, overflow: 'hidden' }} direction="down">
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={handleMenuClick}
            style={{
              background: 'transparent',
              border: 'none',
              marginTop: 8,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
            items={menuItems as MenuProps['items']}
          />
        </CustomScrollbar>

        {/* Toggle button at bottom of sidebar */}
        <div style={{
          borderTop: '1px solid #e8eaed',
          padding: '12px 16px',
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          flexShrink: 0,
        }}>
          {collapsed ? (
            <Tooltip title="Mở rộng" placement="right">
              <Button
                type="text"
                onClick={useSidebarStore.getState().toggle}
                style={{ color: '#6b7280', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LeftOutlined style={{ fontSize: 12, transform: 'rotate(180deg)', transition: 'transform 0.25s' }} />
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="text"
              icon={<LeftOutlined style={{ fontSize: 12, transition: 'transform 0.25s' }} />}
              onClick={useSidebarStore.getState().toggle}
              style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', height: 'auto', borderRadius: 6 }}
            >
              <span style={{ fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: '#6b7280' }}>Thu gọn</span>
            </Button>
          )}
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 72 : 230,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
          background: '#f0f2f5',
        }}
      >
        <AdminHeader />
        <CustomScrollbar style={{ flex: 1, overflow: 'hidden' }}>
          <Content style={{ padding: 24 }}>
            <Outlet />
          </Content>
        </CustomScrollbar>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
