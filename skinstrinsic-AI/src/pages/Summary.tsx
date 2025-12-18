import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import NavigationButton from '../components/NavigationButton';
import arrowLeft from '../assets/arrow-left.svg';

type AcceptedDemographics = { race: string; age: string; gender: string } | undefined;
interface SummaryState {
  acceptedDemographics?: { race: string; age: string; gender: string };
  apiResponse?: unknown;
}

function Summary() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SummaryState | null;
  const accepted: AcceptedDemographics = state?.acceptedDemographics;
  const apiResponse = state?.apiResponse;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const ensureScript = (src: string) => new Promise<void>((resolve, reject) => {
        const existing = Array.from(document.getElementsByTagName('script')).find(s => s.src === src);
        if (existing) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });

      if (!window.html2canvas) {
        await ensureScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      }
      if (!(window.jspdf?.jsPDF || window.jsPDF)) {
        await ensureScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      }

      type Html2CanvasFn = (node: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
      type JsPDFCtor = new (orientation?: string, unit?: string, format?: string) => {
        internal: { pageSize: { getWidth(): number; getHeight(): number } };
        addImage: (...args: unknown[]) => void;
        addPage: (...args: unknown[]) => void;
        save: (filename: string) => void;
      };

      const html2canvas = window.html2canvas as Html2CanvasFn;
      const JsPDFCtorRef = (window.jspdf?.jsPDF || window.jsPDF) as JsPDFCtor;

      const node = document.getElementById('summary-report');
      if (!node) { setIsDownloading(false); return; }

      const excludes = Array.from(node.querySelectorAll('[data-pdf-exclude="true"]')) as HTMLElement[];
      excludes.forEach(el => { el.style.visibility = 'hidden'; });

      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPDFCtorRef('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const y = 10;
      if (imgHeight <= pageHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        let remainingHeight = imgHeight;
        let position = 10;
        const pageCanvas = document.createElement('canvas');
        const ctx = pageCanvas.getContext('2d');
        const ratio = imgWidth / canvas.width;
        const pagePixelHeight = (pageHeight - 20) / ratio;
        let rendered = 0;
        while (remainingHeight > 0 && ctx) {
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pagePixelHeight, canvas.height - rendered);
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, rendered, canvas.width, pageCanvas.height, 0, 0, pageCanvas.width, pageCanvas.height);
          const pageImg = pageCanvas.toDataURL('image/png');
          if (position !== 10) pdf.addPage();
          pdf.addImage(pageImg, 'PNG', 10, 10, imgWidth, (pageCanvas.height * imgWidth) / pageCanvas.width, undefined, 'FAST');
          rendered += pageCanvas.height;
          remainingHeight -= pageHeight - 20;
          position = 0;
        }
      }
      pdf.save('skinstric-summary.pdf');
      excludes.forEach(el => { el.style.visibility = ''; });
    } catch (e) {
      console.error('Failed to generate PDF', e);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="summary-root min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <style>
        {`
          html, body { overflow-x: hidden; }
          .summary-root { overflow-x: hidden; }

          .summary-main { min-height: calc(100vh - 64px); padding: 40px 32px; }

          .summary-card { border-radius: 16px; }
          .summary-label { 
            font-family: 'Roobert TRIAL, sans-serif';
            text-transform: uppercase; 
            letter-spacing: -0.01em;
            font-size: 11px; 
            color: #6B7280;
          }
          .summary-value {
            font-family: 'Roobert TRIAL, sans-serif';
            font-weight: 700; 
            letter-spacing: -0.01em;
            color: #111827;
            font-size: 16px;
          }
          .summary-section { margin-bottom: 32px; }
          .summary-divider { height: 1px; background: #E5E7EB; margin: 24px 0; }

          @media (max-width: 768px) {
            /* Extra breathing room below header */
            .summary-main { padding: 40px 16px !important; }
            .summary-title {
              font-size: 24px !important;
              margin-bottom: 16px !important;
            }
            .summary-section-title {
              font-size: 18px !important;
            }
            .summary-card {
              padding: 16px !important;
            }
            .summary-buttons {
              flex-direction: column !important;
              gap: 12px !important;
            }
            /* Mobile back button tweaks */
            .summary-back-button { bottom: calc(16px + env(safe-area-inset-bottom)) !important; left: 16px !important; }
            .summary-back-button span { display: none !important; }
            .summary-back-button img { width: 36px !important; height: 36px !important; }
            /* Align header offsets with mobile spacing */
            .summary-header-left { left: 16px !important; top: 20px !important; }
          }
        `}
      </style>
      <Header pageTitle="Summary" className="summary-header-left" />

      <div className="summary-main">
        <div id="summary-report" className="summary-container max-w-4xl mx-auto bg-white">
          <h1 className="summary-title text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>
            Detailed Summary
          </h1>
          <div className="summary-card bg-white rounded-lg shadow-md p-8 mb-6">
          {accepted && (
            <section className="summary-section">
              <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>
                Accepted Demographics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="summary-label mb-1">Age</div>
                  <div className="summary-value">{accepted.age}</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="summary-label mb-1">Gender</div>
                  <div className="summary-value">{accepted.gender}</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="summary-label mb-1">Race</div>
                  <div className="summary-value">{accepted.race}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600" style={{ fontFamily: 'Roobert TRIAL, sans-serif' }}>
                If any of these are incorrect, you can{' '}
                <Link 
                  to="/demographics"
                  className="no-underline"
                  style={{ color: '#1A1B1C', textDecoration: 'none', fontWeight: 600, letterSpacing: '-0.01em' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
                >
                  go back
                </Link>{' '}
                to adjust and accept again.
              </div>
            </section>
          )}
          <div className="summary-divider" />

          <section className="summary-section">
            <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>Overall Assessment</h2>
            <p className="text-gray-600 leading-relaxed">
              Your comprehensive skin analysis results and recommendations will be displayed here.
            </p>
          </section>
          
          <section className="summary-section">
            <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>Detailed Findings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>Skin Health Score</h3>
                <p className="text-gray-600">Detailed metrics will appear here</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>Problem Areas</h3>
                <p className="text-gray-600">Identified concerns will appear here</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roobert TRIAL, sans-serif', letterSpacing: '-0.01em' }}>Treatment Plan</h3>
                <p className="text-gray-600">Personalized recommendations will appear here</p>
              </div>
            </div>
          </section>
          </div>

          <div className="summary-buttons flex items-center justify-between max-w-4xl mx-auto w-full" data-pdf-exclude="true">
            <Link 
              to="/testing"
              aria-label="New Analysis"
              data-pdf-exclude="true"
              className="uppercase no-underline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.backgroundColor = '#FFFFFF';
                a.style.color = '#000000';
                a.style.transform = 'scale(1.05)';
                a.style.border = '1px solid #000000';
                a.style.textDecoration = 'none';
              }}
              onMouseLeave={(e) => {
                const a = e.currentTarget as HTMLAnchorElement;
                a.style.backgroundColor = '#000000';
                a.style.color = '#FFFFFF';
                a.style.transform = 'scale(1)';
                a.style.border = 'none';
                a.style.textDecoration = 'none';
              }}
            >
              New Analysis
            </Link>
            <button
              aria-label="Download Report"
              data-pdf-exclude="true"
              className="uppercase"
              style={{
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
                transition: 'all 0.3s ease',
                opacity: isDownloading ? 0.7 : 1
              }}
              onClick={handleDownloadReport}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = '#FFFFFF';
                btn.style.color = '#000000';
                btn.style.transform = 'scale(1.05)';
                btn.style.border = '1px solid #000000';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = '#000000';
                btn.style.color = '#FFFFFF';
                btn.style.transform = 'scale(1)';
                btn.style.border = 'none';
              }}
              disabled={isDownloading}
            >
              {isDownloading ? 'Preparing…' : 'Download Report'}
            </button>
          </div>
        </div>
        {/* Bottom Back Button */}
        <NavigationButton
          onClick={() => navigate('/demographics', { state: { apiResponse } })}
          direction="left"
          label="BACK"
          icon={arrowLeft}
          className="summary-back-button"
          position={{ bottom: '32px', left: '32px' }}
        />
      </div>
    </div>
  );
}

export default Summary;
