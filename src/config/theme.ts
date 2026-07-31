import { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#0062FF',
    colorSuccess: '#149e61',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#0062FF',
    borderRadius: 12,
    fontFamily: "'SF Pro Display', 'SF Pro Text', system-ui, -apple-system, sans-serif",
    fontSize: 16,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f7',
    colorBorder: 'rgba(0, 0, 0, 0.10)',
    colorText: '#1d1d1f',
    colorTextSecondary: '#6e6e73',
    colorTextTertiary: '#86868b',
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 44,
      paddingContentHorizontal: 16,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Table: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 12,
    },
    Menu: {
      borderRadius: 12,
    },
    Tag: {
      borderRadius: 6,
    },
    Badge: {
      borderRadius: 6,
    },
    Tabs: {
      borderRadius: 12,
    },
    Notification: {
      fontFamily: "'SF Pro Display', 'SF Pro Text', system-ui, -apple-system, sans-serif",
      fontSize: 14,
    },
  },
};

export const colors = {
  primary: '#0062FF',
  primaryDark: '#0050d6',
  primaryDeep: '#7B61FF',
  primarySubtle: 'rgba(0, 98, 255, 0.08)',
  text: '#1d1d1f',
  gray: '#6e6e73',
  grayLight: '#86868b',
  border: 'rgba(0, 0, 0, 0.10)',
  white: '#ffffff',
  bgGray: 'rgba(0, 0, 0, 0.04)',
  success: '#00C48C',
  successBg: 'rgba(0, 196, 140, 0.08)',
  successText: '#00A06E',
  warning: '#F59E0B',
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.08)',
  neutralBg: 'rgba(0, 0, 0, 0.06)',
  neutralText: '#484b5e',
};
