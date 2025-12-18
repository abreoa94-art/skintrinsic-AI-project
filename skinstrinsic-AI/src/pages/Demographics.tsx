import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';
import radioButton from '../assets/radio-button.svg';

interface ApiResponse {
  message: string;
  data: {
    race: {
      [key: string]: number;
    };
    age: {
      [key: string]: number;
    };
    gender: {
      male: number;
      female: number;
    };
  };
}

interface RaceItem {
  name: string;
  confidence: number;
}

interface AgeItem {
  range: string;
  confidence: number;
}

interface GenderItem {
  type: string;
  confidence: number;
}

function Demographics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBox, setSelectedBox] = useState<string | null>('race');
  
  // Processed data
  const [topRace, setTopRace] = useState<RaceItem>({ name: 'South asian', confidence: 40 });
  const [selectedRace, setSelectedRace] = useState<RaceItem>({ name: 'South asian', confidence: 40 });
  const [topAge, setTopAge] = useState<string>('60-69');
  const [selectedAge, setSelectedAge] = useState<AgeItem>({ range: '60-69', confidence: 0 });
  const [topGender, setTopGender] = useState<string>('MALE');
  const [selectedGender, setSelectedGender] = useState<GenderItem>({ type: 'MALE', confidence: 0 });
  const [raceList, setRaceList] = useState<RaceItem[]>([]);
  const [ageList, setAgeList] = useState<AgeItem[]>([]);
  const [genderList, setGenderList] = useState<GenderItem[]>([]);

  useEffect(() => {
    // Check if data was passed via navigation state
    if (location.state && location.state.apiResponse) {
      const response: ApiResponse = location.state.apiResponse;
      
      // Process race data
      const raceEntries = Object.entries(response.data.race).map(([name, confidence]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        confidence: Math.round(confidence * 100) // Convert to percentage
      }));
      
      // Sort by confidence descending
      raceEntries.sort((a, b) => b.confidence - a.confidence);
      setRaceList(raceEntries);
      setTopRace(raceEntries[0]);
      setSelectedRace(raceEntries[0]); // Set initial selected race

      // Process age data
      const ageEntries = Object.entries(response.data.age).map(([range, confidence]) => ({
        range: range,
        confidence: Math.round(confidence * 100)
      }));
      ageEntries.sort((a, b) => b.confidence - a.confidence);
      setAgeList(ageEntries);
      const topAgeEntry = ageEntries[0];
      setTopAge(topAgeEntry.range);
      setSelectedAge(topAgeEntry);

      // Process gender data
      const genderEntries = Object.entries(response.data.gender).map(([type, confidence]) => ({
        type: type.toUpperCase(),
        confidence: Math.round(confidence * 100)
      }));
      genderEntries.sort((a, b) => b.confidence - a.confidence);
      setGenderList(genderEntries);
      const topGenderEntry = genderEntries[0];
      setTopGender(topGenderEntry.type);
      setSelectedGender(topGenderEntry);
    }
  }, [location]);

  const handleRaceClick = (race: RaceItem) => {
    setSelectedRace(race);
  };

  const handleAgeClick = (age: AgeItem) => {
    setSelectedAge(age);
  };

  const handleGenderClick = (gender: GenderItem) => {
    setSelectedGender(gender);
  };

  const handleBoxClick = (box: string) => {
    setSelectedBox(selectedBox === box ? null : box);
  };

  const handleBack = () => {
    navigate('/analysis');
  };

  const handleAccept = () => {
    const accepted = {
      race: selectedRace.name,
      age: selectedAge.range,
      gender: selectedGender.type,
    };
    const apiResponse = location.state?.apiResponse;
    // Summary page temporarily removed; route back to Analysis for now
    navigate('/analysis', { state: { apiResponse, acceptedDemographics: accepted } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          /* Tablet-ish layout: tighten and scale for ≤1010px */
          @media (max-width: 1010px) and (min-width: 769px) {
            .demographics-title {
              width: auto !important;
              left: 20px !important;
              top: 96px !important;
              font-size: 56px !important;
              line-height: 56px !important;
            }
            .demographics-subtitle {
              left: 20px !important;
              top: 150px !important;
              font-size: 12px !important;
            }
            .demographics-content {
              top: 210px !important;
              left: 20px !important;
              right: 20px !important;
              gap: 20px !important;
            }
            .demographics-left-column { width: 140px !important; }
            .demographics-left-box { min-height: 100px !important; padding: 12px !important; }
            .demographics-center {
              padding: 24px !important;
              min-height: 360px !important;
              min-width: 0 !important;
            }
            .demographics-center-title {
              top: 24px !important;
              left: 24px !important;
              font-size: 36px !important;
              line-height: 36px !important;
            }
            .demographics-circle { width: 240px !important; height: 240px !important; right: 24px !important; bottom: 24px !important; }
            .demographics-circle svg { width: 240px !important; height: 240px !important; }
            .demographics-instruction { bottom: 12px !important; font-size: 11px !important; }
            .demographics-right-column { width: 260px !important; padding: 16px !important; box-sizing: border-box !important; }
            .demographics-back-button { left: 20px !important; bottom: calc(20px + env(safe-area-inset-bottom)) !important; }
            .demographics-home-button { right: 20px !important; bottom: calc(20px + env(safe-area-inset-bottom)) !important; }
            .demographics-right-column button { width: 100% !important; }
          }

          @media (max-width: 768px) {
            .demographics-header-left {
              left: 16px !important;
              top: 20px !important;
              gap: 8px !important;
            }
            .demographics-header-left h1,
            .demographics-header-left span {
              font-size: 12px !important;
            }
            .demographics-header-button {
              right: 16px !important;
              top: 20px !important;
              height: 28px !important;
              font-size: 9px !important;
              padding: 0 12px !important;
            }
            .demographics-title {
              font-size: 36px !important;
              top: 80px !important;
              left: 16px !important;
              right: 16px !important;
              width: auto !important;
              max-width: calc(100% - 32px) !important;
            }
            .demographics-subtitle {
              font-size: 12px !important;
              top: 125px !important;
              left: 16px !important;
              right: 16px !important;
              width: auto !important;
              max-width: calc(100% - 32px) !important;
            }
            .demographics-content {
              flex-direction: column !important;
              top: 160px !important;
              left: 16px !important;
              right: 16px !important;
              gap: 16px !important;
              box-sizing: border-box !important;
            }
            .demographics-left-column {
              width: 100% !important;
              flex-direction: row !important;
              gap: 8px !important;
            }
            .demographics-left-box {
              flex: 1 !important;
              min-height: 80px !important;
            }
            .demographics-center {
              width: 100% !important;
              min-height: 300px !important;
              padding: 20px !important;
              box-sizing: border-box !important;
            }
            .demographics-center-title {
              font-size: 28px !important;
              top: 20px !important;
              left: 20px !important;
            }
            .demographics-circle {
              width: 200px !important;
              height: 200px !important;
              bottom: 50px !important;
              right: 50% !important;
              transform: translateX(50%) !important;
            }
            .demographics-circle svg {
              width: 200px !important;
              height: 200px !important;
            }
            .demographics-instruction {
              bottom: 10px !important;
              font-size: 10px !important;
            }
            .demographics-right-column {
              width: 100% !important;
              padding: 16px !important;
              box-sizing: border-box !important;
            }
            .demographics-back-button,
            .demographics-home-button {
              bottom: calc(16px + env(safe-area-inset-bottom)) !important;
            }
            .demographics-back-button {
              left: 16px !important;
            }
            .demographics-home-button {
              right: 16px !important;
            }
            .demographics-back-button img,
            .demographics-home-button img {
              width: 36px !important;
              height: 36px !important;
            }
            .demographics-back-button span,
            .demographics-home-button span {
              font-size: 12px !important;
            }
          }

          /* Static footer at the bottom of page content */
          .demographics-footer {
            position: relative;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px 12px;
            padding-inline-end: calc(64px + env(safe-area-inset-right));
            padding-inline-start: calc(16px + env(safe-area-inset-left));
            margin-top: 24px;
            background: #fff;
            border-top: 1px solid #E5E7EB;
          }
          @media (max-width: 1010px) {
            .demographics-footer { 
              padding: 10px 12px; 
              padding-inline-end: calc(48px + env(safe-area-inset-right));
              padding-inline-start: calc(12px + env(safe-area-inset-left));
            }
          }
          .demographics-footer .footer-right { margin-right: 24px; }
          @media (max-width: 1010px) { .demographics-footer .footer-right { margin-right: 16px; } }
        `}
      </style>
      {/* Header - Nav Bar */}
      <Header 
        pageTitle="Demographics" 
        onLogoClick={() => navigate('/')}
        className="demographics-header-left"
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px' }}>
        <h1 className="demographics-title" style={{
          position: 'absolute',
          width: '505px',
          height: '64px',
          top: '115px',
          left: '29px',
          fontFamily: 'Roobert TRIAL, sans-serif',
          fontWeight: 400,
          fontSize: '72px',
          lineHeight: '64px',
          letterSpacing: '-0.06em',
          textTransform: 'uppercase',
          color: '#1A1B1C',
          margin: 0
        }}>
          Demographics
        </h1>

        <p className="demographics-subtitle" style={{
          position: 'absolute',
          width: '227px',
          height: '24px',
          top: '190px',
          left: '32px',
          fontFamily: 'Roobert TRIAL, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0',
          textTransform: 'uppercase',
          color: '#1A1B1C',
          margin: 0
        }}>
          Predicted Race & Age
        </p>

        {/* Main Content Area */}
        <div className="demographics-content" style={{ 
          position: 'absolute',
          top: '268px',
          left: '25px',
          right: '25px',
          display: 'flex',
          gap: '32px'
        }}>
          {/* Left Column - Info Boxes */}
          <div className="demographics-left-column" style={{
            width: '170px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}>
            {/* Race Box */}
            <div 
            className="demographics-left-box"
            onClick={() => handleBoxClick('race')}
            style={{
              height: '33.33%',
              minHeight: '120px',
              backgroundColor: selectedBox === 'race' ? '#1A1B1C' : '#E5E7EB',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderTop: '1px solid #1A1B1C',
              borderBottom: '1px solid #1A1B1C'
            }}
            onMouseEnter={(e) => {
              if (selectedBox !== 'race') {
                e.currentTarget.style.backgroundColor = '#D1D5DB';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedBox !== 'race') {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }
            }}>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: selectedBox === 'race' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                marginBottom: '4px'
              }}>{topRace.name}</p>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                color: selectedBox === 'race' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>RACE</p>
            </div>

            {/* Age Box */}
            <div 
            className="demographics-left-box"
            onClick={() => handleBoxClick('age')}
            style={{
              height: '33.33%',
              minHeight: '120px',
              backgroundColor: selectedBox === 'age' ? '#1A1B1C' : '#E5E7EB',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderTop: '1px solid #1A1B1C',
              borderBottom: '1px solid #1A1B1C'
            }}
            onMouseEnter={(e) => {
              if (selectedBox !== 'age') {
                e.currentTarget.style.backgroundColor = '#D1D5DB';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedBox !== 'age') {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }
            }}>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: selectedBox === 'age' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                marginBottom: '4px'
              }}>{topAge}</p>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                color: selectedBox === 'age' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>AGE</p>
            </div>

            {/* Sex Box */}
            <div 
            className="demographics-left-box"
            onClick={() => handleBoxClick('sex')}
            style={{
              height: '33.33%',
              minHeight: '120px',
              backgroundColor: selectedBox === 'sex' ? '#1A1B1C' : '#E5E7EB',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              borderTop: '1px solid #1A1B1C',
              borderBottom: '1px solid #1A1B1C'
            }}
            onMouseEnter={(e) => {
              if (selectedBox !== 'sex') {
                e.currentTarget.style.backgroundColor = '#D1D5DB';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedBox !== 'sex') {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }
            }}>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: selectedBox === 'sex' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                marginBottom: '4px'
              }}>{topGender}</p>
              <p style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                color: selectedBox === 'sex' ? '#FFFFFF' : '#1A1B1C',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>SEX</p>
            </div>
          </div>

          {/* Center - Chart Area */}
          <div className="demographics-center" style={{
            flex: 1,
            backgroundColor: '#E5E7EB',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            borderTop: '1px solid #1A1B1C'
          }}>
            {/* Title - Top Left */}
            <h2 className="demographics-center-title" style={{
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: '48px',
              letterSpacing: '-0.02em',
              color: '#1A1B1C',
              margin: 0,
              position: 'absolute',
              top: '40px',
              left: '40px'
            }}>
              {selectedBox === 'race' && selectedRace.name}
              {selectedBox === 'age' && selectedAge.range}
              {selectedBox === 'sex' && selectedGender.type}
            </h2>

            {/* Circular Progress Chart - Bottom Right */}
            <div className="demographics-circle" style={{ 
              position: 'absolute', 
              bottom: '40px',
              right: '40px',
              width: '280px', 
              height: '280px' 
            }}>
              <style>
                {`
                  @keyframes smoothStroke {
                    from {
                      stroke-dasharray: 0 ${2 * Math.PI * 135};
                    }
                  }
                  .progress-circle {
                    transition: stroke-dasharray 0.6s ease-in-out;
                  }
                `}
              </style>
              <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
                {/* Progress circle - Black (confidence percentage) */}
                <circle
                  className="progress-circle"
                  cx="140"
                  cy="140"
                  r="135"
                  fill="none"
                  stroke="#1A1B1C"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 135 * (
                    selectedBox === 'race' ? selectedRace.confidence :
                    selectedBox === 'age' ? selectedAge.confidence :
                    selectedBox === 'sex' ? selectedGender.confidence : 0
                  ) / 100} ${2 * Math.PI * 135}`}
                  strokeLinecap="round"
                />
                {/* Remaining circle - Grey (remaining percentage) */}
                <circle
                  className="progress-circle"
                  cx="140"
                  cy="140"
                  r="135"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 135 * (
                    selectedBox === 'race' ? (100 - selectedRace.confidence) :
                    selectedBox === 'age' ? (100 - selectedAge.confidence) :
                    selectedBox === 'sex' ? (100 - selectedGender.confidence) : 100
                  ) / 100} ${2 * Math.PI * 135}`}
                  strokeDashoffset={`-${2 * Math.PI * 135 * (
                    selectedBox === 'race' ? selectedRace.confidence :
                    selectedBox === 'age' ? selectedAge.confidence :
                    selectedBox === 'sex' ? selectedGender.confidence : 0
                  ) / 100}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.6s ease-in-out, stroke-dashoffset 0.6s ease-in-out' }}
                />
              </svg>
              {/* Center text - Confidence only */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 700,
                fontSize: '36px',
                color: '#1A1B1C',
                transition: 'opacity 0.3s ease'
              }}>
                {selectedBox === 'race' && `${selectedRace.confidence}%`}
                {selectedBox === 'age' && `${selectedAge.confidence}%`}
                {selectedBox === 'sex' && `${selectedGender.confidence}%`}
              </div>
            </div>

            {/* Instruction Text - Bottom Center */}
            <p className="demographics-instruction" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'Roobert TRIAL, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: '#9CA3AF',
              margin: 0,
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              If A.I. estimate is wrong, select the correct one
            </p>
          </div>

          {/* Right Column - Race List */}
          <div className="demographics-right-column" style={{
            width: '310px',
            backgroundColor: '#E5E7EB',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid #1A1B1C'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <span style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#1A1B1C'
              }}>
                {selectedBox === 'race' && 'RACE'}
                {selectedBox === 'age' && 'AGE'}
                {selectedBox === 'sex' && 'GENDER'}
              </span>
              <span style={{
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '10px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#1A1B1C'
              }}>A.I. CONFIDENCE</span>
            </div>

            {/* Race List Items */}
            {selectedBox === 'race' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {raceList.map((race) => (
                <div 
                  key={race.name} 
                  onClick={() => handleRaceClick(race)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: race.name === selectedRace.name ? '#1A1B1C' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (race.name !== selectedRace.name) {
                      e.currentTarget.style.backgroundColor = '#D1D5DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (race.name !== selectedRace.name) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={radioButton} 
                      alt={race.name === selectedRace.name ? "selected" : ""} 
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        opacity: race.name === selectedRace.name ? 1 : 0.3,
                        filter: race.name === selectedRace.name ? 'invert(1)' : 'none',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <span style={{
                      fontFamily: 'Roobert TRIAL, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: race.name === selectedRace.name ? '#FFFFFF' : '#1A1B1C',
                      transition: 'color 0.3s ease'
                    }}>{race.name}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Roobert TRIAL, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: race.name === selectedRace.name ? '#FFFFFF' : '#1A1B1C',
                    transition: 'color 0.3s ease'
                  }}>{race.confidence}%</span>
                </div>
              ))}
            </div>
            )}

            {/* Age List Items */}
            {selectedBox === 'age' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ageList.map((age) => (
                <div 
                  key={age.range} 
                  onClick={() => handleAgeClick(age)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: age.range === selectedAge.range ? '#1A1B1C' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (age.range !== selectedAge.range) {
                      e.currentTarget.style.backgroundColor = '#D1D5DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (age.range !== selectedAge.range) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={radioButton} 
                      alt={age.range === selectedAge.range ? "selected" : ""} 
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        opacity: age.range === selectedAge.range ? 1 : 0.3,
                        filter: age.range === selectedAge.range ? 'invert(1)' : 'none',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <span style={{
                      fontFamily: 'Roobert TRIAL, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: age.range === selectedAge.range ? '#FFFFFF' : '#1A1B1C',
                      transition: 'color 0.3s ease'
                    }}>{age.range}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Roobert TRIAL, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: age.range === selectedAge.range ? '#FFFFFF' : '#1A1B1C',
                    transition: 'color 0.3s ease'
                  }}>{age.confidence}%</span>
                </div>
              ))}
            </div>
            )}

            {/* Gender List Items */}
            {selectedBox === 'sex' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {genderList.map((gender) => (
                <div 
                  key={gender.type} 
                  onClick={() => handleGenderClick(gender)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: gender.type === selectedGender.type ? '#1A1B1C' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (gender.type !== selectedGender.type) {
                      e.currentTarget.style.backgroundColor = '#D1D5DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gender.type !== selectedGender.type) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={radioButton} 
                      alt={gender.type === selectedGender.type ? "selected" : ""} 
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        opacity: gender.type === selectedGender.type ? 1 : 0.3,
                        filter: gender.type === selectedGender.type ? 'invert(1)' : 'none',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                    <span style={{
                      fontFamily: 'Roobert TRIAL, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: gender.type === selectedGender.type ? '#FFFFFF' : '#1A1B1C',
                      transition: 'color 0.3s ease'
                    }}>{gender.type}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Roobert TRIAL, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: gender.type === selectedGender.type ? '#FFFFFF' : '#1A1B1C',
                    transition: 'color 0.3s ease'
                  }}>{gender.confidence}%</span>
                </div>
              ))}
            </div>
            )}
            {/* Accept Selection Button */}
            <button
              onClick={handleAccept}
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                backgroundColor: '#1A1B1C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Roobert TRIAL, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Accept Selection
            </button>
          </div>
        </div>
      </div>

      {/* Footer actions (non-fixed) */}
      <div className="demographics-footer">
        <NavigationButton 
          onClick={handleBack}
          direction="left"
          label="BACK"
          icon={arrowLeft}
          isFixed={false}
        />
        <div className="footer-right">
          <NavigationButton 
            onClick={() => navigate('/')}
            direction="right"
            label="HOME"
            icon={arrowRight}
            mirrorRightIcon={false}
            isFixed={false}
          />
        </div>
      </div>
    </div>
  );
}

export default Demographics;
