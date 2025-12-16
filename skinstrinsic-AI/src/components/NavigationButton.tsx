interface NavigationButtonProps {
  onClick: () => void;
  direction: 'left' | 'right';
  label: string;
  icon: string;
  className?: string;
  position?: { bottom?: string; left?: string; right?: string };
}

const arrowHoverStyles = {
  left: {
    enter: (e: React.MouseEvent<HTMLImageElement>) => {
      e.currentTarget.style.transform = 'translateX(-5px)';
    },
    leave: (e: React.MouseEvent<HTMLImageElement>) => {
      e.currentTarget.style.transform = 'translateX(0)';
    }
  },
  right: {
    enter: (e: React.MouseEvent<HTMLImageElement>) => {
      e.currentTarget.style.transform = 'translateX(5px)';
    },
    leave: (e: React.MouseEvent<HTMLImageElement>) => {
      e.currentTarget.style.transform = 'translateX(0)';
    }
  }
};

function NavigationButton({ 
  onClick, 
  direction, 
  label, 
  icon, 
  className = '',
  position = { bottom: '32px' }
}: NavigationButtonProps) {
  const positionStyle = {
    bottom: position.bottom,
    left: direction === 'left' ? (position.left || '32px') : undefined,
    right: direction === 'right' ? (position.right || '32px') : undefined
  };

  return (
    <button 
      onClick={onClick}
      className={className}
      style={{
        position: 'fixed',
        ...positionStyle,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {direction === 'left' && (
        <>
          <img 
            src={icon} 
            alt={label}
            style={{
              width: '44px',
              height: '44px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={arrowHoverStyles.left.enter}
            onMouseLeave={arrowHoverStyles.left.leave}
          />
          <span style={{
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#1A1B1C'
          }}>
            {label}
          </span>
        </>
      )}
      {direction === 'right' && (
        <>
          <span style={{
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#1A1B1C'
          }}>
            {label}
          </span>
          <img 
            src={icon} 
            alt={label}
            style={{
              width: '44px',
              height: '44px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={arrowHoverStyles.right.enter}
            onMouseLeave={arrowHoverStyles.right.leave}
          />
        </>
      )}
    </button>
  );
}

export default NavigationButton;
