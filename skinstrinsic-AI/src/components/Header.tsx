import { Link } from 'react-router-dom';

interface HeaderProps {
  pageTitle: string;
  subtitle?: string;
  onLogoClick?: () => void;
  className?: string;
}

const buttonHoverStyles = {
  enter: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#FFFFFF';
    e.currentTarget.style.color = '#000000';
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.border = '1px solid #000000';
  },
  leave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#000000';
    e.currentTarget.style.color = '#FFFFFF';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.border = 'none';
  }
};

const textStyles = {
  fontFamily: 'Roobert TRIAL, sans-serif',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '16px',
  letterSpacing: '-0.02em',
  margin: 0,
  padding: 0,
  display: 'inline-block'
};

function Header({ pageTitle, subtitle, onLogoClick, className = '' }: HeaderProps) {
  return (
    <header className="w-full h-16 bg-white shadow-sm">
      <div className="max-w-[1920px] h-full mx-auto flex items-center justify-between relative">
        <div className={`absolute flex items-baseline ${className}`} style={{ left: '32px', top: '24px', gap: '16px' }}>
          {onLogoClick ? (
            <h1 
              onClick={onLogoClick}
              className="uppercase text-[#1A1B1C] cursor-pointer"
              style={{ ...textStyles, transition: 'opacity 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Skinstric
            </h1>
          ) : (
            <Link to="/">
              <h1 className="uppercase text-[#1A1B1C]" style={textStyles}>
                Skinstric
              </h1>
            </Link>
          )}
          <span className="text-gray-600 uppercase" style={{ ...textStyles, color: '#1A1B1C' }}>
            [ {pageTitle} ]
          </span>
        </div>
        
        {subtitle && (
          <div className="absolute" style={{ left: '32px', top: '56px' }}>
            <p style={{ ...textStyles, fontSize: '16px', lineHeight: '20px' }}>
              {subtitle}
            </p>
          </div>
        )}

        <button 
          className="uppercase absolute group"
          style={{
            right: '32px',
            top: '24px',
            height: '32px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '10px',
            lineHeight: '16px',
            letterSpacing: '-0.02em',
            border: 'none',
            cursor: 'pointer',
            padding: '0 16px',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={buttonHoverStyles.enter}
          onMouseLeave={buttonHoverStyles.leave}
        >
          Enter Code
        </button>
      </div>
    </header>
  );
}

export default Header;
