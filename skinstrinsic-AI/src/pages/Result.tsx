import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      await submitImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const submitImage = async (dataUrl: string) => {
    try {
      setIsUploading(true);
      setShowAnalyzing(true);
      const base64String = dataUrl.split(',')[1];
      const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64String })
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      setTimeout(() => {
        navigate('/analysis', { state: { apiResponse: data } });
      }, 800);
    } catch (e) {
      console.error('Upload error:', e);
      setError('Failed to upload image. Please try again.');
      setShowAnalyzing(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      
      <Header 
        pageTitle="intro" 
        subtitle="To Start Analysis"
        className="result-header-left"
      />

      {/* Main Content */}
      <div className="result-main flex items-center justify-center">
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
          <div className="result-icon-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '600px', height: '600px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  width: '550px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                  animation: 'rotateFast 20s linear infinite'
                }}
                className="result-rectangle result-rectangle-big"
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  width: '450px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.4))',
                  animation: 'rotateMedium 30s linear infinite'
                }}
                className="result-rectangle result-rectangle-medium"
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  width: '350px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
                  animation: 'rotateSlow 40s linear infinite'
                }}
                className="result-rectangle result-rectangle-small"
              />
            </div>
            <div className="result-callout result-callout-camera" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4 }}>
              <img 
                src={cameraIcon}
                alt="Camera"
                className="result-icon"
                style={{
                  width: '120px',
                  height: '120px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'transform 0.3s ease',
                  zIndex: 4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              />
              <img 
                src={vector1}
                alt="Line"
                className="result-vector result-vector-camera"
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
                className="result-ellipse result-ellipse-camera"
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
                className="result-label result-label-camera"
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
        </div>

        {/* Gallery Icon - Open file chooser */}
        <div 
          onClick={handleGalleryClick}
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <div className="result-icon-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '600px', height: '600px' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  width: '550px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                  animation: 'rotateFast 20s linear infinite'
                }}
                className="result-rectangle result-rectangle-big"
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  width: '450px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.4))',
                  animation: 'rotateMedium 30s linear infinite'
                }}
                className="result-rectangle result-rectangle-medium"
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  width: '350px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
                  animation: 'rotateSlow 40s linear infinite'
                }}
                className="result-rectangle result-rectangle-small"
              />
            </div>
            <div className="result-callout result-callout-gallery" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4 }}>
              <img 
                src={galleryIcon}
                alt="Gallery"
                className="result-icon"
                style={{
                  width: '120px',
                  height: '120px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'transform 0.3s ease',
                  zIndex: 4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              />
              <img 
                src={vector1}
                alt="Line"
                className="result-vector result-vector-gallery"
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
                className="result-ellipse result-ellipse-gallery"
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
                className="result-label result-label-gallery"
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
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
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

      {/* Upload/analyzing overlay for gallery flow */}
      {showAnalyzing && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            minWidth: '400px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', minWidth: '200px', marginBottom: '24px' }}>
              <img src={rectangleBig} alt="Big rectangle" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1, width: '180px', height: 'auto', filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.5))', opacity: 0.9, transform: 'translate(-50%, -50%)', animation: 'rotateFast 20s linear infinite' }} />
              <img src={rectangleMedium} alt="Medium rectangle" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 2, width: '140px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.6))', opacity: 0.95, transform: 'translate(-50%, -50%)', animation: 'rotateMedium 30s linear infinite' }} />
              <img src={rectangleSmall} alt="Small rectangle" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 3, width: '100px', height: 'auto', filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.7))', opacity: 1, transform: 'translate(-50%, -50%)', animation: 'rotateSlow 40s linear infinite' }} />
              <img src={cameraIcon} alt="Camera" style={{ width: '60px', height: '60px', position: 'relative', zIndex: 4, animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
            <p style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '24px', letterSpacing: '-0.02em', color: '#1A1B1C', textTransform: 'uppercase', margin: 0 }}>
              {isUploading ? 'Uploading...' : 'Analyzing Photo...'}
            </p>
            {error && <p style={{ marginTop: '12px', color: '#B91C1C', fontFamily: 'Roobert TRIAL, sans-serif' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Result;
 
