import React from 'react';

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Vertical scroll only (default). 'both' enables horizontal too. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'both';
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className,
  style,
  direction = 'down',
}) => {
  const overflowX = (direction === 'left' || direction === 'right' || direction === 'both') ? 'auto' : 'hidden';
  const overflowY = (direction === 'down' || direction === 'up' || direction === 'both') ? 'auto' : 'hidden';

  return (
    <div
      className={`custom-scrollbar-container ${className ?? ''}`}
      style={{
        overflowX,
        overflowY,
        height: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default CustomScrollbar;
