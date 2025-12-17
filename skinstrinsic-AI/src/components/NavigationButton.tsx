interface NavigationButtonProps {
  onClick: () => void;
  direction: 'left' | 'right';
  label: string;
  icon: string;
  className?: string;
  position?: { bottom?: string; left?: string; right?: string };
  mirrorRightIcon?: boolean; // when direction is right, mirror a left-arrow asset
  isFixed?: boolean; // render as fixed overlay (default) or inline inside a container
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
      e.currentTarget.style.transform = 'scaleX(-1) translateX(3px)';
    },
    leave: (e: React.MouseEvent<HTMLImageElement>) => {
      e.currentTarget.style.transform = 'scaleX(-1) translateX(0)';
    }
  }
};

function NavigationButton({ 
  onClick, 
  direction, 
  label, 
  icon, 
  className = '',
  position = { bottom: '32px' },
  mirrorRightIcon = true,
  isFixed = true
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
        position: isFixed ? 'fixed' : 'relative',
        ...(isFixed ? positionStyle : {}),
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        zIndex: isFixed ? 9999 : undefined,
        pointerEvents: 'auto',
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
              transition: 'transform 0.3s ease',
              transform: mirrorRightIcon ? 'scaleX(-1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (mirrorRightIcon) {
                arrowHoverStyles.right.enter(e);
              } else {
                // nudge right without flipping
                (e.currentTarget as HTMLImageElement).style.transform = 'translateX(3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (mirrorRightIcon) {
                arrowHoverStyles.right.leave(e);
              } else {
                (e.currentTarget as HTMLImageElement).style.transform = 'translateX(0)';
              }
            }}
          />
        </>
      )}
    </button>
  );
}

export default NavigationButton;
