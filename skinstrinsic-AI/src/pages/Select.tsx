import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowLeft from '../assets/arrow-left.svg';
import cameraIcon from '../assets/camera-icon.svg';
import rectangleSmall from '../assets/rectangle-small.svg';
import rectangleMedium from '../assets/rectangle-medium.svg';
import rectangleBig from '../assets/rectangle-big.svg';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';

function Select() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setShowAnalyzing(true);
    setError(null);

    try {
      const base64String = selectedImage.split(',')[1];

      const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64String
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      // Navigate to Analysis page with API data
      setTimeout(() => {
        navigate('/analysis', { 
          state: { apiResponse: data }
        });
      }, 1000);
      
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
      setShowAnalyzing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/result');
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
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @media (max-width: 768px) {
            .select-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .select-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .select-main {
              padding: 20px 16px !important;
            }
            .select-preview {
              max-width: 90% !important;
              max-height: 400px !important;
            }
            .select-upload-button {
              width: 100% !important;
              max-width: 300px !important;
              padding: 16px 24px !important;
            }
            .select-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .select-submit-button {
              bottom: 16px !important;
              right: 16px !important;
            }
            .select-arrow {
              width: 36px !important;
              height: 36px !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="Gallery"
        className="select-header-left"
      />

      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          {error && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '14px', color: '#991B1B' }}>
              {error}
            </div>
          )}

          {!selectedImage ? (
            <div onClick={() => fileInputRef.current?.click()} style={{ width: '100%', aspectRatio: '16/9', border: '3px dashed #D1D5DB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#F9FAFB' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={{ marginTop: '16px', fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
                Click to select an image
              </p>
              <p style={{ marginTop: '8px', fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '14px', color: '#9CA3AF' }}>
                JPG, PNG (Max 10MB)
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
              <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />

          {selectedImage && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
              <button onClick={handleRemoveImage} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', padding: '16px 32px', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000000', borderRadius: '8px', cursor: 'pointer' }}>
                Change Image
              </button>
              <button onClick={handleSubmit} disabled={isLoading} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', padding: '16px 48px', backgroundColor: isLoading ? '#9CA3AF' : '#000000', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? 'Uploading...' : 'Submit Image'}
              </button>
            </div>
          )}
        </div>
      </div>

      <NavigationButton 
        onClick={handleBack} 
        direction="left" 
        label="BACK" 
        icon={arrowLeft}
        className="select-back-button"
        position={{ bottom: '32px', left: '32px' }}
      />

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
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1,
                  width: '180px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.5))',
                  opacity: 0.9,
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
                  width: '140px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.6))',
                  opacity: 0.95,
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
                  width: '100px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.7))',
                  opacity: 1,
                  animation: 'rotateSlow 40s linear infinite'
                }}
              />
              <img 
                src={cameraIcon}
                alt="Camera"
                style={{
                  width: '60px',
                  height: '60px',
                  position: 'relative',
                  zIndex: 4,
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              />
            </div>
            <p style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 600,
              fontSize: '24px',
              letterSpacing: '-0.02em',
              color: '#1A1B1C',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Analyzing Photo...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Select;
