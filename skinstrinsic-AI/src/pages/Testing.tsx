import { Link } from 'react-router-dom';
import { useState } from 'react';
import rectangleSmall from '../assets/rectangle-small.svg';
import rectangleMedium from '../assets/rectangle-medium.svg';
import rectangleBig from '../assets/rectangle-big.svg';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';

function Testing() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function to check if string contains only letters and spaces
  const isValidString = (value: string): boolean => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(value);
  };

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedName = name.trim();
      
      if (!trimmedName) {
        setError('Name is required');
        return;
      }
      
      if (!isValidString(trimmedName)) {
        setError('Name must contain only letters and spaces');
        return;
      }
      
      setError('');
      setStep(2);
    }
  };

  const handleCitySubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedCity = city.trim();
      
      if (!trimmedCity) {
        setError('City is required');
        return;
      }
      
      if (!isValidString(trimmedCity)) {
        setError('City must contain only letters and spaces');
        return;
      }
      
      setError('');
      setIsSubmitting(true);
      
      try {
        // Store in localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userCity', city);
        
        // Send to API
        const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            location: city
          })
        });
        
        if (response.ok) {
          // Add delay to show loading state longer
          setTimeout(() => {
            setSuccessMessage(`added ${name} from ${city}`);
            setIsSubmitting(false);
          }, 2000);
        } else {
          setError('Failed to submit data. Please try again.');
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        setError('Network error. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    window.history.back();
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
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @media (max-width: 768px) {
            .testing-header-left {
              left: 16px !important;
              top: 20px !important;
              font-size: 12px !important;
            }
            .testing-subtitle {
              left: 16px !important;
              top: 48px !important;
              font-size: 14px !important;
            }
            .testing-header-button {
              right: 16px !important;
              top: 20px !important;
              font-size: 9px !important;
              height: 28px !important;
              padding: 0 12px !important;
            }
            .testing-main {
              padding: 0 16px !important;
            }
            .testing-rectangles-container {
              min-height: 400px !important;
              min-width: 100% !important;
            }
            .testing-rectangle-big {
              width: 300px !important;
            }
            .testing-rectangle-medium {
              width: 240px !important;
            }
            .testing-rectangle-small {
              width: 180px !important;
            }
            .testing-placeholder-text {
              font-size: 10px !important;
            }
            .testing-input {
              font-size: 24px !important;
              line-height: 32px !important;
              width: 90% !important;
            }
            .testing-placeholder {
              font-size: 10px !important;
            }
            .testing-error {
              font-size: 12px !important;
            }
            .testing-back-button {
              bottom: 16px !important;
              left: 16px !important;
            }
            .testing-continue-button {
              bottom: 16px !important;
              right: 16px !important;
            }
            .testing-arrow {
              width: 36px !important;
              height: 36px !important;
            }
          }
        `}
      </style>
      
      <Header 
        pageTitle="intro" 
        subtitle="To Start Analysis"
        className="testing-header-left"
      />

      {/* Main Content */}
      <div className="testing-main flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '0 32px' }}>
        {step === 1 && (
          <div 
            style={{
              opacity: 1,
              transition: 'opacity 0.6s ease-in-out',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div className="testing-rectangles-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px', minWidth: '800px' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                className="testing-rectangle-big"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1,
                  width: '600px',
                  height: 'auto',
                  animation: 'rotateFast 20s linear infinite'
                }}
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                className="testing-rectangle-medium"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  width: '500px',
                  height: 'auto',
                  animation: 'rotateMedium 30s linear infinite'
                }}
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                className="testing-rectangle-small"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 3,
                  width: '400px',
                  height: 'auto',
                  animation: 'rotateSlow 40s linear infinite'
                }}
              />
              <p 
                className="testing-placeholder"
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '-0.01em',
                  color: '#999999',
                  textTransform: 'uppercase',
                  margin: 0,
                  zIndex: 4
                }}
              >
                click to type
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameSubmit}
                placeholder="Introduce Yourself"
                autoFocus
                className="testing-input"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 300,
                  fontSize: '32px',
                  lineHeight: '40px',
                  letterSpacing: '-0.03em',
                  color: '#1A1B1C',
                  textAlign: 'center',
                  border: 'none',
                  borderBottom: '1px solid #000000',
                  outline: 'none',
                  background: 'transparent',
                  width: '300px',
                  padding: '10px',
                  zIndex: 4
                }}
              />
            </div>
            {error && step === 1 && (
              <p className="testing-error" style={{
                marginTop: '20px',
                color: '#EF4444',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontSize: '14px'
              }}>
                {error}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div 
            style={{
              opacity: 1,
              transition: 'opacity 0.6s ease-in-out',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div className="testing-rectangles-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px', minWidth: '800px' }}>
              <img 
                src={rectangleBig} 
                alt="Big rectangle"
                className="testing-rectangle-big"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 1,
                  width: '600px',
                  height: 'auto',
                  animation: 'rotateFast 20s linear infinite'
                }}
              />
              <img 
                src={rectangleMedium} 
                alt="Medium rectangle"
                className="testing-rectangle-medium"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  width: '500px',
                  height: 'auto',
                  animation: 'rotateMedium 30s linear infinite'
                }}
              />
              <img 
                src={rectangleSmall} 
                alt="Small rectangle"
                className="testing-rectangle-small"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 3,
                  width: '400px',
                  height: 'auto',
                  animation: 'rotateSlow 40s linear infinite'
                }}
              />
              <p 
                className="testing-placeholder"
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '-0.01em',
                  color: '#999999',
                  textTransform: 'uppercase',
                  margin: 0,
                  zIndex: 4,
                  opacity: (successMessage || isSubmitting) ? 0 : 1,
                  transition: 'opacity 0.5s ease'
                }}
              >
                click to type
              </p>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleCitySubmit}
                placeholder="Your City Name"
                autoFocus
                disabled={isSubmitting || !!successMessage}
                className="testing-input"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontWeight: 300,
                  fontSize: '32px',
                  lineHeight: '40px',
                  letterSpacing: '-0.03em',
                  color: '#1A1B1C',
                  textAlign: 'center',
                  border: 'none',
                  borderBottom: '1px solid #000000',
                  outline: 'none',
                  background: 'transparent',
                  width: '300px',
                  padding: '10px',
                  zIndex: 4,
                  opacity: (successMessage || isSubmitting) ? 0 : 1,
                  transition: 'opacity 0.5s ease'
                }}
              />
            </div>
            {error && step === 2 && (
              <p className="testing-error" style={{
                marginTop: '20px',
                color: '#EF4444',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontSize: '14px'
              }}>
                {error}
              </p>
            )}
            {isSubmitting && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
                opacity: 1,
                transition: 'opacity 0.5s ease'
              }}>
                <p style={{
                  color: '#1A1B1C',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  margin: 0
                }}>
                  Processing submission...
                </p>
              </div>
            )}
            {successMessage && !isSubmitting && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                zIndex: 5,
                opacity: 1,
                transition: 'opacity 0.5s ease',
                animation: 'fadeIn 0.5s ease'
              }}>
                <h3 style={{
                  color: '#1A1B1C',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  margin: 0
                }}>
                  Thank You!
                </h3>
                <p style={{
                  color: '#666666',
                  fontFamily: 'Roobert TRIAL, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  margin: 0
                }}>
                  Proceed to the next step
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proceed Button - Shows after successful submission on step 2 */}
      {step === 2 && successMessage && !isSubmitting && (
        <Link
          to="/result"
          className="testing-continue-button"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          <span
            style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '16px',
              letterSpacing: '-0.02em',
              color: '#1A1B1C',
              textTransform: 'uppercase'
            }}
          >
            PROCEED
          </span>
          <img 
            src={arrowRight} 
            alt="Proceed"
            className="testing-arrow"
            style={{
              width: '44px',
              height: '44px',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          />
        </Link>
      )}

      <NavigationButton 
        onClick={handleBack} 
        direction="left" 
        label="BACK" 
        icon={arrowLeft}
        className="testing-back-button"
        position={{ bottom: '32px', left: '32px' }}
      />
    </div>
  );
}

export default Testing;
