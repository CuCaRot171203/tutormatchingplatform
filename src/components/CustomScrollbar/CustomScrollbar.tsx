import React, { useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Vertical scroll only (default). 'both' enables horizontal too. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'both';
  /** Suppress the default horizontal/vertical scrollbar for specific axes */
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  /** Smooth rail on hover (default: true) */
  fadeRailOnHover?: boolean;
  /** Click on track to scroll (default: true) */
  clickOnTrack?: boolean;
  /** Wheel event propagation — pass true for nested scroll areas (default: false) */
  wheelPropagation?: boolean;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className,
  style,
  direction = 'down',
  suppressScrollX = direction !== 'both' && direction !== 'left' && direction !== 'right',
  suppressScrollY = direction !== 'down' && direction !== 'up' && direction !== 'both',
  wheelPropagation = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null);

  const isHorizontal = direction === 'left' || direction === 'right' || direction === 'both';

  return (
    <div
      className={`custom-scrollbar-container ${className ?? ''}`}
      style={{
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      <PerfectScrollbar
        ref={containerRef}
        options={{
          suppressScrollX,
          suppressScrollY,
          wheelPropagation,
          minScrollbarLength: 40,
        }}
        className={`custom-scrollbar ${isHorizontal ? 'is-horizontal' : ''}`}
      >
        {children}
      </PerfectScrollbar>
    </div>
  );
};

export default CustomScrollbar;
