import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowLeft from '../assets/arrow-left.svg';
import cameraIcon from '../assets/camera-icon.svg';
import rectangleSmall from '../assets/rectangle-small.svg';
import rectangleMedium from '../assets/rectangle-medium.svg';
import rectangleBig from '../assets/rectangle-big.svg';
import Header from '../components/Header';

function Capture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    setIsCameraLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      
      // Add minimum display time for loading screen
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
        setIsCameraLoading(false);
      }, 2000);
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      console.error('Camera error:', err);
      setTimeout(() => {
        setIsCameraLoading(false);
      }, 1000);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
  };

  const submitPhoto = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setShowAnalyzing(true);
    setError(null);

    try {
      const base64String = capturedImage.split(',')[1];

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
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
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
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          
          @media (max-width: 768px) {
            .capture-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .capture-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .capture-main {
              padding: 0 16px !important;
            }
            .capture-video-container {
              width: 90% !important;
              max-width: 400px !important;
              height: auto !important;
            }
            .capture-video {
              border-radius: 12px !important;
            }
            .capture-button {
              width: 60px !important;
              height: 60px !important;
              margin-top: 20px !important;
            }
            .capture-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .capture-submit-button {
              bottom: 16px !important;
              right: 16px !important;
            }
            .capture-arrow {
              width: 36px !important;
              height: 36px !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="Capture"
        className="capture-header-left"
      />

      {isCameraLoading ? (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', minWidth: '300px' }}>
            <img 
              src={rectangleBig} 
              alt="Big rectangle"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 1,
                width: '280px',
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
                width: '230px',
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
                width: '180px',
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
                width: '80px',
                height: '80px',
                position: 'relative',
                zIndex: 4,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>
          <p style={{
            fontFamily: 'Roobert TRIAL, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            letterSpacing: '-0.02em',
            color: '#1A1B1C',
            textTransform: 'uppercase',
            marginTop: '32px',
            marginBottom: '16px'
          }}>
            Setting Up Camera
          </p>
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#E5E7EB',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#000000',
              borderRadius: '2px',
              animation: 'progressBar 2s ease-out forwards'
            }}></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          {capturedImage && (
            <h2 style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              color: '#1A1B1C',
              textAlign: 'center',
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
              Great Shot!
            </h2>
          )}

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '14px', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
            {!capturedImage ? (
              <>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '12px 20px',
                  maxWidth: '90%'
                }}>
                  <p style={{
                    fontFamily: 'Roobert TRIAL, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '8px',
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    opacity: 0.6
                  }}>
                    To Get Better Results Make Sure To Have
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#FFFFFF', fontSize: '8px', opacity: 0.6 }}>●</span>
                      <span style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '10px', color: '#FFFFFF', letterSpacing: '-0.01em', opacity: 0.6 }}>Neutral Expression</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#FFFFFF', fontSize: '8px', opacity: 0.6 }}>●</span>
                      <span style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '10px', color: '#FFFFFF', letterSpacing: '-0.01em', opacity: 0.6 }}>Frontal Pose</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#FFFFFF', fontSize: '8px', opacity: 0.6 }}>●</span>
                      <span style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '10px', color: '#FFFFFF', letterSpacing: '-0.01em', opacity: 0.6 }}>Adequate Lighting</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <img src={capturedImage || ''} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {capturedImage && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '-0.02em',
                color: '#6B7280',
                textTransform: 'uppercase'
              }}>
                Preview
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {!capturedImage ? (
              <button onClick={capturePhoto} disabled={!!error} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', padding: '16px 48px', backgroundColor: error ? '#9CA3AF' : '#000000', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: error ? 'not-allowed' : 'pointer' }}>
                Capture Photo
              </button>
            ) : (
              <>
                <button onClick={retakePhoto} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', padding: '16px 32px', backgroundColor: '#FFFFFF', color: '#000000', border: '2px solid #000000', borderRadius: '8px', cursor: 'pointer' }}>
                  Retake
                </button>
                <button onClick={submitPhoto} disabled={isLoading} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', padding: '16px 48px', backgroundColor: isLoading ? '#9CA3AF' : '#000000', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Uploading...' : 'Use This Photo'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      <button onClick={handleBack} style={{ position: 'fixed', bottom: '32px', left: '32px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src={arrowLeft} 
          alt="Back" 
          style={{ width: '44px', height: '44px', transition: 'transform 0.3s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        />
        <span style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', letterSpacing: '-0.02em', color: '#1A1B1C', textTransform: 'uppercase' }}>BACK</span>
      </button>

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

export default Capture;
