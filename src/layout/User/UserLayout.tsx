import React from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import logoUrl from '../../assets/branding/Logo.png';
import {
  HomeOutlined,
  SearchOutlined,
  SolutionOutlined,
  BarChartOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import { useSidebarStore } from '../../stores';

const { Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const studentMenuItems: MenuItem[] = [
  { key: 'dashboard',   icon: <HomeOutlined />,              label: 'Trang chủ',          path: '/student/dashboard' },
  { key: 'search',      icon: <SearchOutlined />,            label: 'Tìm gia sư',         path: '/student/search-tutors' },
  { key: 'sessions',    icon: <SolutionOutlined />,          label: 'Lịch học',            path: '/student/sessions' },
  { key: 'progress',    icon: <BarChartOutlined />,          label: 'Tiến độ học tập',   path: '/student/progress' },
  { key: 'wallet',      icon: <WalletOutlined />,            label: 'Ví Credit',           path: '/student/wallet' },
  { key: 'complaints',  icon: <ExclamationCircleOutlined />, label: 'Khiếu nại',          path: '/student/complaints' },
  { key: 'profile',     icon: <UserOutlined />,              label: 'Hồ sơ',              path: '/student/profile' },
];

const UserLayout: React.FC = () => {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = (): string => {
    const currentPath = location.pathname;
    for (const item of studentMenuItems) {
      if (currentPath.startsWith(item.path)) return item.key;
    }
    return 'dashboard';
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const item = studentMenuItems.find((i) => i.key === key);
    if (item) navigate(item.path);
  };

  const menuItems: MenuProps['items'] = studentMenuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e8eaed',
          overflow: 'auto',
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
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 8,
          }}>
            <img src={logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            {!collapsed && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1d26', fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: '-0.3px', lineHeight: 1.3 }}>TutorMatch</div>
                <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: "'IBM Plex Sans', sans-serif" }}>Học sinh</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
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
          items={menuItems}
        />

        {/* Toggle button at bottom of sidebar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderTop: '1px solid #e8eaed',
          padding: '12px 16px',
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
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
        <UserHeader />
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
