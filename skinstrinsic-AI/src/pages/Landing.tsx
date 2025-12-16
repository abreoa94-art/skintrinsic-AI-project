import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import rightArrow from '../assets/arrow-left.svg';
import leftArrow from '../assets/arrow-right.svg';
import rectangleLeft from '../assets/rectangle-left.svg';
import rectangleRight from '../assets/rectangle-right.svg';
import Header from '../components/Header';

function Landing() {
  const [fadeIn, setFadeIn] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [isLeftHovered, setIsLeftHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          @media (max-width: 768px) {
            .landing-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .landing-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .landing-side-button {
              display: none !important;
            }
            .landing-hero {
              min-height: calc(100vh - 120px) !important;
              padding: 20px !important;
            }
            .landing-title {
              font-size: 48px !important;
              line-height: 44px !important;
              margin-bottom: 32px !important;
            }
            .landing-bottom-text {
              position: static !important;
              max-width: 100% !important;
              margin: 0 16px 16px 16px !important;
              font-size: 13px !important;
              line-height: 18px !important;
            }
            .landing-mobile-buttons {
              display: flex !important;
              flex-direction: column !important;
              gap: 16px !important;
              padding: 0 16px !important;
              margin-top: 32px !important;
            }
            .landing-mobile-button {
              width: 100% !important;
              height: 56px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background-color: #000000 !important;
              color: #FFFFFF !important;
              text-decoration: none !important;
              border-radius: 8px !important;
              font-family: 'Roobert TRIAL, sans-serif' !important;
              font-weight: 600 !important;
              font-size: 14px !important;
              text-transform: uppercase !important;
              transition: all 0.3s ease !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="intro"
        className="landing-header-left"
      />

      {/* Right Side Button - Take Test */}
      <div 
        className="landing-side-button fixed z-10"
        style={{ 
          right: '48px',
          top: '50vh', 
          transform: 'translateY(-50%)',
          opacity: isLeftHovered ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out'
        }}
        onMouseEnter={() => setIsRightHovered(true)}
        onMouseLeave={() => setIsRightHovered(false)}
      >
        <Link 
          to="/testing"
          className="flex items-center relative"
          style={{ 
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            outline: 'none',
            gap: '24px',
            padding: '20px',
            textDecoration: 'none'
          }}
        >
          <img 
            src={rectangleRight} 
            alt="Background"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1,
              pointerEvents: 'none'
            }}
          />
          <span style={{
            opacity: 0.7,
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '16px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#000000',
            whiteSpace: 'nowrap'
          }}>Take Test</span>
          <img 
            src={leftArrow} 
            alt="Previous"
            style={{ 
              width: '44px', 
              height: '44px', 
              flexShrink: 0,
              transition: 'transform 0.4s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15) translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateX(0)';
            }}
          />
        </Link>
      </div>

      {/* Left Side Button - Discover A.I */}
      <div 
        className="landing-side-button fixed z-10"
        style={{ 
          left: '48px',
          top: '50vh', 
          transform: 'translateY(-50%)',
          opacity: isRightHovered ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out'
        }}
        onMouseEnter={() => setIsLeftHovered(true)}
        onMouseLeave={() => setIsLeftHovered(false)}
      >
        <div 
          className="flex items-center relative"
          style={{ 
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            outline: 'none',
            gap: '24px',
            padding: '20px'
          }}
        >
          <img 
            src={rectangleLeft} 
            alt="Background"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1,
              pointerEvents: 'none'
            }}
          />
          <img 
            src={rightArrow} 
            alt="Next"
            style={{ 
              width: '44px', 
              height: '44px', 
              flexShrink: 0,
              transition: 'transform 0.4s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15) translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateX(0)';
            }}
          />
          <span style={{
            opacity: 0.7,
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '16px',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#000000',
            whiteSpace: 'nowrap'
          }}>Discover A.I</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="landing-hero flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <h2 
          className="landing-title text-gray-900 mb-6"
          style={{
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 300,
            fontSize: '128px',
            lineHeight: '120px',
            letterSpacing: '-0.07em',
            textAlign: 'center',
            opacity: fadeIn ? 1 : 0,
            transform: isRightHovered 
              ? (fadeIn ? 'translateX(-300px) translateY(0)' : 'translateY(20px)')
              : isLeftHovered
              ? (fadeIn ? 'translateX(300px) translateY(0)' : 'translateY(20px)')
              : (fadeIn ? 'translateY(0)' : 'translateY(20px)'),
            transition: 'opacity 1.5s ease-out, transform 0.8s ease-in-out'
          }}
        >
          <span style={{
            display: 'block',
            transition: 'transform 0.8s ease-in-out'
          }}>
            Sophisticated
          </span>
          <span style={{
            display: 'block',
            transform: isRightHovered ? 'translateX(-120px)' : isLeftHovered ? 'translateX(120px)' : 'translateX(0)',
            transition: 'transform 0.8s ease-in-out'
          }}>
            skincare
          </span>
        </h2>
        
        {/* Mobile Buttons */}
        <div className="landing-mobile-buttons" style={{ display: 'none' }}>
          <Link to="/testing" className="landing-mobile-button">
            Take Test
          </Link>
        </div>
      </div>

      {/* Bottom Left Paragraph */}
      <div 
        className="landing-bottom-text fixed"
        style={{
          left: '32px',
          bottom: '32px',
          maxWidth: '300px'
        }}
      >
        <p style={{
          fontFamily: 'Roobert TRIAL, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '-0.01em',
          color: '#1A1B1C'
        }}>
          Skinstric developed an A.I. that creates a
          highly-personalized routine tailored to
          what your skin needs.
        </p>
      </div>
    </div>
  );
}

export default Landing;
