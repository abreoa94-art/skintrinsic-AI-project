import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import arrowLeft from '../assets/arrow-left.svg';
import rectangleFull from '../assets/Rectangle full.svg';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';

function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  
  // Get API response from location state
  const apiResponse = location.state?.apiResponse;

  const handleNavigateToDemographics = () => {
    navigate('/demographics', { 
      state: { apiResponse }
    });
  };

  const handleBack = () => {
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          @media (max-width: 768px) {
            .analysis-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .analysis-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .analysis-main {
              padding: 20px 16px !important;
            }
            .analysis-diamond-container {
              width: 100% !important;
              height: auto !important;
              position: relative !important;
            }
            .analysis-rectangle {
              position: relative !important;
              width: 90% !important;
              max-width: 320px !important;
              margin: 12px auto !important;
              transform: none !important;
            }
            .analysis-rectangle-image {
              width: 100% !important;
              height: auto !important;
            }
            .analysis-label {
              font-size: 14px !important;
            }
            .analysis-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .analysis-arrow {
              width: 36px !important;
              height: 36px !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="Analysis"
        className="analysis-header-left"
      />

      {/* Main Content */}
      <div className="analysis-main flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px' }}>
        <p style={{
          position: 'absolute',
          top: '80px',
          left: '32px',
          fontFamily: 'Roobert TRIAL, sans-serif',
          fontWeight: 600,
          fontSize: '11px',
          letterSpacing: '-0.01em',
          color: '#1A1B1C',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: '16px',
          maxWidth: '300px'
        }}>
          A.I Has Estimated The Following. Fix Estimated Information If Needed.
        </p>
        
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative',
            width: '500px',
            height: '500px',
            margin: '0 auto'
          }}>
            {/* Outline for top rectangle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '420px',
              height: '420px',
              border: '2px dotted #D1D5DB',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: hoveredRect === 'top' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none'
            }} />
            
            {/* Outline for right rectangle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '460px',
              height: '460px',
              border: '2px dotted #D1D5DB',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: hoveredRect === 'right' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none'
            }} />
            
            {/* Outline for bottom rectangle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '380px',
              height: '380px',
              border: '2px dotted #D1D5DB',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: hoveredRect === 'bottom' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none'
            }} />
            
            {/* Outline for left rectangle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '500px',
              height: '500px',
              border: '2px dotted #D1D5DB',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              opacity: hoveredRect === 'left' ? 1 : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none'
            }} />
            
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}>
            {/* Top - Demographics */}
            <img 
              src={rectangleFull} 
              alt="Demographics"
              onClick={handleNavigateToDemographics}
              style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(0deg)',
                width: '250px',
                height: 'auto',
                filter: 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)',
                transition: 'filter 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(300%) hue-rotate(182deg) brightness(92%) contrast(88%)';
                setHoveredRect('top');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)';
                setHoveredRect(null);
              }}
            />
            <span style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '250px',
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
              color: '#1A1B1C',
              textTransform: 'uppercase',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              Demographics
            </span>
            {/* Right - Cosmetic Concerns */}
            <img 
              src={rectangleFull} 
              alt="Cosmetic Concerns"
              style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%) rotate(90deg)',
                width: '250px',
                height: 'auto',
                filter: 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)',
                transition: 'filter 0.3s ease',
                cursor: 'not-allowed'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(300%) hue-rotate(182deg) brightness(92%) contrast(88%)';
                setHoveredRect('right');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)';
                setHoveredRect(null);
              }}
            />
            <span style={{
              position: 'absolute',
              right: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '250px',
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
              color: '#1A1B1C',
              textTransform: 'uppercase',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              Skin Type Details
            </span>
            {/* Bottom - Weather */}
            <img 
              src={rectangleFull} 
              alt="Weather"
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(180deg)',
                width: '250px',
                height: 'auto',
                filter: 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)',
                transition: 'filter 0.3s ease',
                cursor: 'not-allowed'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(300%) hue-rotate(182deg) brightness(92%) contrast(88%)';
                setHoveredRect('bottom');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)';
                setHoveredRect(null);
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '250px',
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
              color: '#1A1B1C',
              textTransform: 'uppercase',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              Weather
            </span>
            {/* Left - Skin Type Details */}
            <img 
              src={rectangleFull} 
              alt="Skin Type Details"
              style={{
                position: 'absolute',
                left: '-5px',
                top: '50%',
                transform: 'translateY(-50%) rotate(270deg)',
                width: '250px',
                height: 'auto',
                filter: 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)',
                transition: 'filter 0.3s ease',
                cursor: 'not-allowed'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(300%) hue-rotate(182deg) brightness(92%) contrast(88%)';
                setHoveredRect('left');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(91%) sepia(3%) saturate(317%) hue-rotate(182deg) brightness(98%) contrast(92%)';
                setHoveredRect(null);
              }}
            />
            <span style={{
              position: 'absolute',
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '250px',
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '-0.01em',
              color: '#1A1B1C',
              textTransform: 'uppercase',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 1
            }}>
              Cosmetic Concerns
            </span>
            </div>
          </div>
        </div>
      </div>

      <NavigationButton 
        onClick={handleBack} 
        direction="left" 
        label="BACK" 
        icon={arrowLeft}
        className="analysis-back-button"
        position={{ bottom: '32px', left: '32px' }}
      />

      <NavigationButton 
        onClick={handleNavigateToDemographics} 
        direction="right" 
        label="GET SUMMARY" 
        icon={arrowLeft}
        className="analysis-summary-button"
        position={{ bottom: '32px', right: '32px' }}
      />
    </div>
  );
}

export default Analysis;
