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
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPlayInteraction, setNeedsPlayInteraction] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const [triedAlternateFacing, setTriedAlternateFacing] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [lastError, setLastError] = useState<{name?: string; message?: string}>({});
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    // If camera takes too long, show a manual start button for user gesture
    const t = setTimeout(() => {
      if (isCameraLoading) setShowStartPrompt(true);
    }, 1500);
    // Video element event listeners for diagnostics
    const v = videoRef.current;
    const addLog = (msg: string) => setDebugLog(prev => [...prev.slice(-100), `${new Date().toLocaleTimeString()} ${msg}`]);
    const handlers: Array<[keyof HTMLVideoElementEventMap, (e: Event) => void]> = [
      ['loadedmetadata', () => addLog('video loadedmetadata')],
      ['canplay', () => addLog('video canplay')],
      ['playing', () => addLog('video playing')],
      ['pause', () => addLog('video pause')],
      ['stalled', () => addLog('video stalled')],
      ['suspend', () => addLog('video suspend')],
      ['waiting', () => addLog('video waiting')],
      ['error', () => addLog('video error')]
    ];
    if (v) handlers.forEach(([evt, h]) => v.addEventListener(evt, h));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (v) handlers.forEach(([evt, h]) => v.removeEventListener(evt, h));
      clearTimeout(t);
    };
  }, []);

  

  const startCamera = async () => {
    setIsCameraLoading(true);
    setNeedsPlayInteraction(false);
    setShowStartPrompt(false);

    // Stop any existing stream first to avoid NotReadableError on some devices
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) { console.warn(e); }
      streamRef.current = null;
    }

    const baseConstraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: 'user' as const },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(baseConstraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try { videoRef.current.setAttribute('playsinline', 'true'); } catch {}
        try {
          await videoRef.current.play();
          setNeedsPlayInteraction(false);
        } catch (e) {
          // Some browsers require a user gesture to play
          setNeedsPlayInteraction(true);
          console.warn(e);
          setLastError({ name: (e as any)?.name, message: (e as any)?.message });
        }
      }
      setError(null);
      setIsCameraLoading(false);
      // Verify frames actually advance; if not, try alternate camera
      setTimeout(async () => {
        const v = videoRef.current;
        if (!v) return;
        const frozen = v.currentTime === 0;
        if (frozen && !triedAlternateFacing) {
          try {
            await switchFacingMode();
          } catch (e) { console.warn('switchFacingMode failed', e); }
        }
      }, 1200);
    } catch (err: unknown) {
      // Fallback with very loose constraints
      console.error(err);
      setLastError({ name: (err as any)?.name, message: (err as any)?.message });
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          try { videoRef.current.setAttribute('playsinline', 'true'); } catch {}
          try {
            await videoRef.current.play();
            setNeedsPlayInteraction(false);
          } catch (e) {
            setNeedsPlayInteraction(true);
            console.warn(e);
            setLastError({ name: (e as any)?.name, message: (e as any)?.message });
          }
        }
        setError(null);
      } catch (innerErr: unknown) {
        const name = (innerErr as DOMException)?.name || '';
        let friendly = 'Unable to access camera. Please check permissions and try again.';
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          friendly = 'Camera permission was denied. Enable permissions in your browser settings.';
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          friendly = 'No camera device found. Please connect a camera and try again.';
        } else if (name === 'NotReadableError') {
          friendly = 'Camera is in use by another app. Close other apps and retry.';
        } else if (name === 'OverconstrainedError') {
          friendly = 'Requested resolution not supported. Try again with default settings.';
        }
        setError(friendly);
        setLastError({ name: (innerErr as any)?.name, message: (innerErr as any)?.message });
      } finally {
        setIsCameraLoading(false);
      }
    }
  };

  const switchFacingMode = async () => {
    // Try to switch to an alternate video input to recover from black preview
    setTriedAlternateFacing(true);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const currentTrack = streamRef.current?.getVideoTracks()[0] || null;
      const currentId = currentTrack?.getSettings()?.deviceId;
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      const alternate = videoInputs.find(d => d.deviceId && d.deviceId !== currentId) || videoInputs[0];

      // Stop current stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      let constraints: MediaStreamConstraints = { video: true, audio: false };
      if (alternate?.deviceId) {
        constraints = { video: { deviceId: { exact: alternate.deviceId }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false };
      } else {
        // Fall back to ideal facingMode instead of exact to avoid OverconstrainedError
        constraints = { video: { facingMode: { ideal: 'environment' } as any, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false };
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e: any) {
        // If still overconstrained, last fallback
        if (e?.name === 'OverconstrainedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw e;
        }
      }
      streamRef.current = stream!;
      if (videoRef.current) {
        videoRef.current.srcObject = stream!;
        try { videoRef.current.setAttribute('playsinline', 'true'); } catch {}
        await videoRef.current.play();
      }
      setError(null);
    } catch (e) {
      console.warn('Alternate facing failed', e);
      setLastError({ name: (e as any)?.name, message: (e as any)?.message });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    // Ensure the camera is actually ready with correct dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera not ready yet. Please wait a moment.');
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      setError(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
  };

  const waitForMetadata = (video: HTMLVideoElement, timeoutMs = 800): Promise<void> => {
    return new Promise((resolve) => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        resolve();
        return;
      }
      let settled = false;
      const onReady = () => {
        if (settled) return;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          settled = true;
          cleanup();
          resolve();
        }
      };
      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('canplay', onReady);
      };
      video.addEventListener('loadedmetadata', onReady);
      video.addEventListener('canplay', onReady);
      setTimeout(() => {
        if (!settled) {
          settled = true;
          cleanup();
          resolve();
        }
      }, timeoutMs);
    });
  };

  const handleCaptureClick = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (needsPlayInteraction) {
        try {
          await video.play();
          setNeedsPlayInteraction(false);
        } catch (e) { console.warn(e); }
      }
      await waitForMetadata(video);
      capturePhoto();
    } catch {
      setError('Camera not ready yet. Please try again.');
    }
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    navigate('/result');
  };

  return (
    <div className="capture-root min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          /* Defaults for shutter/text visibility */
          .capture-button-shutter { display: none; }
          .capture-button-text { display: inline; }

          /* Prevent sideways scroll */
          html, body { overflow-x: hidden; }
          .capture-root { overflow-x: hidden; }

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
          @keyframes fadeInUp {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          
          @media (max-width: 768px) {
            .capture-heading {
              font-size: 20px !important;
              margin-top: 24px !important;
              margin-bottom: 16px !important;
            }
            .capture-root { 
              /* tunable areas for header/controls */
              --headerArea: 64px; 
              --controlsArea: 120px; 
            }
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
            .capture-card {
              width: 100% !important;
              max-width: none !important;
              background: transparent !important;
              box-shadow: none !important;
              padding: 0 !important;
              border-radius: 0 !important;
            }
            .capture-video-container {
              position: relative !important;
              width: 100% !important;
              max-width: none !important;
              height: calc(100dvh - var(--headerArea) - var(--controlsArea)) !important;
              aspect-ratio: auto !important;
              margin: 0 !important;
              border-radius: 0 !important;
            }
            .capture-video {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              border-radius: 0 !important;
            }
            .capture-guidance {
              bottom: calc(var(--controlsArea) + 24px) !important;
            }
            .capture-badge {
              font-size: 16px !important;
              padding: 8px 12px !important;
            }
            .capture-preview-label { 
              display: none !important; 
            }
            .capture-controls {
              position: fixed !important;
              left: 12px !important;
              right: 12px !important;
              bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
              display: flex !important;
              justify-content: center !important;
              gap: 12px !important;
              padding: 12px 16px !important;
              box-sizing: border-box !important;
              background: rgba(255,255,255,0.92) !important;
              -webkit-backdrop-filter: blur(8px) !important;
              backdrop-filter: blur(8px) !important;
              border-top: 1px solid #e5e7eb !important;
              border-radius: 12px !important;
              z-index: 20 !important;
            }
            .capture-button { 
              width: 84px !important; 
              height: 84px !important; 
              margin-top: 0 !important; 
              border-radius: 9999px !important; 
              background: transparent !important; 
              border: none !important;
              padding: 0 !important;
            }
            .capture-button-shutter { 
              display: block; 
              width: 72px; 
              height: 72px; 
              border-radius: 9999px; 
              background: #FFFFFF; 
              border: 4px solid #000000; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.25);
            }
            .capture-button-text { display: none !important; }
            .capture-controls button { padding: 12px 20px !important; }
            .capture-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .capture-back-text {
              display: none !important;
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
          {showStartPrompt && (
            <button
              onClick={startCamera}
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Start Camera
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="capture-main flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px' }}>
        <div className="capture-card" style={{ width: '100%', maxWidth: '800px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          {/* Title moved into camera container as overlay badge */}

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontFamily: 'Roobert TRIAL, sans-serif', fontSize: '14px', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <div className="capture-video-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
            {!capturedImage ? (
              <>
                <video ref={videoRef} autoPlay muted playsInline className="capture-video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {needsPlayInteraction && (
                  <button
                    onClick={async () => {
                      try {
                        await videoRef.current?.play();
                        setNeedsPlayInteraction(false);
                      } catch (e) { console.warn(e); }
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      padding: '12px 16px',
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: 'Roobert TRIAL, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Tap to start camera
                  </button>
                )}
                <div className="capture-guidance" style={{
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
              <>
                <img src={capturedImage || ''} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div 
                  className="capture-badge"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 5,
                    fontFamily: 'Roobert TRIAL, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(2px)',
                    animation: 'fadeInUp 300ms ease-out'
                  }}
                >
                  Great Shot!
                </div>
              </>
            )}
          </div>

          {/* Debug panel */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <button onClick={() => setDebugOpen(v => !v)} style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', padding: '6px 10px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Toggle Debug</button>
          </div>
          {debugOpen && (
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', color: '#111827', marginBottom: '16px', maxHeight: '220px', overflow: 'auto' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Video:</strong>{' '}
                {(() => {
                  const v = videoRef.current;
                  if (!v) return 'ref: null';
                  return `w=${v.videoWidth} h=${v.videoHeight} ready=${v.readyState} time=${v.currentTime.toFixed(2)} paused=${v.paused}`;
                })()}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Track:</strong>{' '}
                {(() => {
                  const t = streamRef.current?.getVideoTracks()[0];
                  if (!t) return 'none';
                  const s = t.getSettings();
                  return `ready=${t.readyState} muted=${(videoRef.current as any)?.muted ?? false} label="${t.label}" dev=${s.deviceId || ''} facing=${(s as any).facingMode || ''} ${s.width || ''}x${s.height || ''} fps=${s.frameRate || ''}`;
                })()}
              </div>
              {lastError?.name && (
                <div style={{ marginBottom: '8px', color: '#B91C1C' }}>
                  <strong>LastError:</strong> {lastError.name}: {lastError.message}
                </div>
              )}
              <div>
                <strong>Events:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{debugLog.slice(-12).join('\n')}</pre>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {capturedImage && (
            <div className="capture-preview-label" style={{
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

          <div className="capture-controls" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {!capturedImage ? (
              <button 
                className="capture-button" 
                onClick={handleCaptureClick} 
                disabled={false}
                aria-label="Capture photo"
                style={{ 
                  fontFamily: 'Roobert TRIAL, sans-serif', 
                  fontWeight: 600, 
                  fontSize: '14px', 
                  textTransform: 'uppercase', 
                  padding: '16px 48px', 
                  backgroundColor: '#000000', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer' 
                }}
              >
                <span className="capture-button-shutter" />
                <span className="capture-button-text">Capture Photo</span>
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

      <button className="capture-back-button" onClick={handleBack} style={{ position: 'fixed', bottom: '32px', left: '32px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        <span className="capture-back-text" style={{ fontFamily: 'Roobert TRIAL, sans-serif', fontWeight: 600, fontSize: '14px', letterSpacing: '-0.02em', color: '#1A1B1C', textTransform: 'uppercase' }}>BACK</span>
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
