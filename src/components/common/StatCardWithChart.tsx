import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

interface StatCardWithChartProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  accentColor: string;
  sparkData?: { value: number }[];
  sparkKey?: string;
}

const StatCardWithChart: React.FC<StatCardWithChartProps> = ({
  icon,
  label,
  value,
  sub,
  trend,
  trendValue,
  accentColor,
  sparkData,
  sparkKey = 'value',
}) => {
  const sparkGradientId = `sparkGrad_${label.replace(/\s+/g, '_')}`;
  const trendColor = trend === 'up' ? '#34c759' : '#ff3b30';

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(0, 0, 0, 0.07)',
      borderRadius: 18,
      padding: '22px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      transition: 'box-shadow 0.2s ease',
      cursor: 'default',
    }}>
      {/* Icon row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${accentColor}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor, fontSize: 20,
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 600,
            color: trendColor,
          }}>
            {trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
            {trendValue || (trend === 'up' ? '+12%' : '-5%')}
          </div>
        )}
      </div>

      {/* Value + label */}
      <div>
        <div style={{
          fontFamily: "'SF Pro Display', 'SF Pro Text', system-ui, -apple-system, sans-serif",
          fontSize: 28, fontWeight: 500,
          color: '#1d1d1f', letterSpacing: '-0.5px', lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: "'SF Pro Display', 'SF Pro Text', system-ui, -apple-system, sans-serif",
          fontSize: 13, color: '#6e6e73', marginTop: 5, fontWeight: 500,
        }}>
          {label}
        </div>
        {sub && (
          <div style={{
            fontFamily: "'SF Pro Display', 'SF Pro Text', system-ui, -apple-system, sans-serif",
            fontSize: 12, color: '#86868b', marginTop: 2,
          }}>
            {sub}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparkData && sparkData.length > 0 && (
        <div style={{ marginTop: 4, height: 56 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={sparkGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={accentColor} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={sparkKey}
                stroke={accentColor}
                strokeWidth={2}
                fill={`url(#${sparkGradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatCardWithChart;
