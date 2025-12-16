import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import cameraIcon from '../assets/camera-icon.svg';
import galleryIcon from '../assets/gallery-icon.svg';
import rectangleSmall from '../assets/rectangle-small.svg';
import rectangleMedium from '../assets/rectangle-medium.svg';
import rectangleBig from '../assets/rectangle-big.svg';
import arrowLeft from '../assets/arrow-left.svg';
import vector1 from '../assets/Vector 1.svg';
import ellipse from '../assets/Ellipse 126.svg';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';

function Result() {
  const navigate = useNavigate();
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCameraModal(true);
  };

  const handleAllowCamera = () => {
    setShowCameraModal(false);
    navigate('/capture');
  };

  const handleDenyCamera = () => {
    setShowCameraModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          @keyframes rotateSlow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes rotateMedium {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes rotateFast {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .result-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .result-subtitle {
              left: 16px !important;
              top: 48px !important;
              font-size: 14px !important;
            }
            .result-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .result-main {
              flex-direction: column !important;
              gap: 32px !important;
              padding: 0 16px !important;
            }
            .result-icon-container {
              width: 200px !important;
              height: 200px !important;
            }
            .result-rectangle-big {
              width: 250px !important;
            }
            .result-rectangle-medium {
              width: 200px !important;
            }
            .result-rectangle-small {
              width: 150px !important;
            }
            .result-icon {
              width: 48px !important;
              height: 48px !important;
            }
            .result-label {
              font-size: 12px !important;
            }
            .result-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .result-arrow {
              width: 36px !important;
              height: 36px !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="intro" 
        subtitle="To Start Analysis"
        className="result-header-left"
      />

      {/* Main Content */}
      <div className="result-main flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '0 32px', gap: '450px' }}>
        {/* Camera Icon - Capture */}
        <div
          onClick={handleCameraClick}
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px', minWidth: '600px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1,
                  width: '550px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                  animation: 'rotateFast 20s linear infinite'
                }}
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  width: '450px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.4))',
                  animation: 'rotateMedium 30s linear infinite'
                }}
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 3,
                  width: '350px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
                  animation: 'rotateSlow 40s linear infinite'
                }}
              />
              <img 
                src={cameraIcon}
                alt="Camera"
                className="result-icon"
                style={{
                  width: '120px',
                  height: '120px',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  zIndex: 4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>
            <img 
              src={vector1}
              alt="Line"
              style={{
                position: 'absolute',
                top: '33%',
                left: '53.5%',
                width: '72px',
                height: 'auto',
                transform: 'rotate(-15deg)',
                transformOrigin: 'left center',
                zIndex: 5
              }}
            />
            <img 
              src={ellipse}
              alt="Dot at end of vector"
              style={{
                position: 'absolute',
                top: '29.5%',
                left: '63.5%',
                width: '5px',
                height: '5px',
                zIndex: 5
              }}
            />
            <p
              className="result-label"
              style={{
                position: 'absolute',
                top: '26%',
                left: '66%',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '22px',
                letterSpacing: '-0.02em',
                color: '#1A1B1C',
                textTransform: 'uppercase',
                textAlign: 'left',
                whiteSpace: 'nowrap'
              }}
            >
              Allow A.I.<br />To Scan Your Face
            </p>
          </div>
        </div>

        {/* Gallery Icon - Select */}
        <Link 
          to="/select"
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px', minWidth: '600px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1,
                  width: '550px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                  animation: 'rotateFast 20s linear infinite'
                }}
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  width: '450px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.4))',
                  animation: 'rotateMedium 30s linear infinite'
                }}
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 3,
                  width: '350px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
                  animation: 'rotateSlow 40s linear infinite'
                }}
              />
              <img 
                src={galleryIcon}
                alt="Gallery"
                className="result-icon"
                style={{
                  width: '120px',
                  height: '120px',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  zIndex: 4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>
            <img 
              src={vector1}
              alt="Line"
              style={{
                position: 'absolute',
                top: '57%',
                left: '46%',
                width: '72px',
                height: 'auto',
                transform: 'rotate(165deg)',
                transformOrigin: 'left center',
                zIndex: 5
              }}
            />
            <img 
              src={ellipse}
              alt="Dot at end of vector"
              style={{
                position: 'absolute',
                top: '70.5%',
                left: '35.2%',
                width: '5px',
                height: '5px',
                zIndex: 5
              }}
            />
            <p
              style={{
                position: 'absolute',
                top: '67.5%',
                left: '14.5%',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '22px',
                letterSpacing: '-0.02em',
                color: '#1A1B1C',
                textTransform: 'uppercase',
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }}
            >
              Allow A.I.<br />Access Gallery
            </p>
          </div>
        </Link>
      </div>

      {/* Camera Permission Modal */}
      {showCameraModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleDenyCamera}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '32px',
                letterSpacing: '-0.02em',
                color: '#1A1B1C',
                margin: 0,
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              Allow A.I. to Access Your Camera
            </h2>
            <p
              style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#6B7280',
                margin: 0,
                marginBottom: '32px',
                textAlign: 'center'
              }}
            >
              We need access to your camera to capture your photo for skin analysis.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={handleDenyCamera}
                style={{
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  padding: '16px 32px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Deny
              </button>
              <button
                onClick={handleAllowCamera}
                style={{
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  padding: '16px 48px',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      <NavigationButton 
        onClick={handleBack} 
        direction="left" 
        label="BACK" 
        icon={arrowLeft}
        className="result-back-button"
        position={{ bottom: '32px', left: '32px' }}
      />
    </div>
  );
}

export default Result;
