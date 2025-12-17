import { Link, useLocation } from 'react-router-dom';

type AcceptedDemographics = { race: string; age: string; gender: string } | undefined;

function Summary() {
  const location = useLocation();
  const state = location.state as { acceptedDemographics?: { race: string; age: string; gender: string } } | null;
  const accepted: AcceptedDemographics = state?.acceptedDemographics;
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <style>
        {`
          @media (max-width: 768px) {
            .summary-container {
              padding: 16px !important;
            }
            .summary-title {
              font-size: 28px !important;
              margin-bottom: 20px !important;
            }
            .summary-section-title {
              font-size: 20px !important;
            }
            .summary-card {
              padding: 20px !important;
            }
            .summary-buttons {
              flex-direction: column !important;
            }
          }
        `}
      </style>
      <div className="summary-container max-w-4xl mx-auto">
        <h1 className="summary-title text-4xl font-bold text-gray-900 mb-6">
          Detailed Summary
        </h1>
        <div className="summary-card bg-white rounded-lg shadow-md p-8 mb-6">
          {accepted && (
            <section className="mb-8">
              <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4">Accepted Demographics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Age</div>
                  <div className="text-gray-900 font-semibold">{accepted.age}</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Gender</div>
                  <div className="text-gray-900 font-semibold">{accepted.gender}</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Race</div>
                  <div className="text-gray-900 font-semibold">{accepted.race}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                If any of these are incorrect, you can
                <Link to="/demographics" className="ml-1 text-blue-600 hover:underline">go back</Link>
                
                to adjust and accept again.
              </div>
            </section>
          )}
          <section className="mb-8">
            <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4">Overall Assessment</h2>
            <p className="text-gray-600 leading-relaxed">
              Your comprehensive skin analysis results and recommendations will be displayed here.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="summary-section-title text-2xl font-semibold text-gray-900 mb-4">Detailed Findings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Skin Health Score</h3>
                <p className="text-gray-600">Detailed metrics will appear here</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Problem Areas</h3>
                <p className="text-gray-600">Identified concerns will appear here</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
                <p className="text-gray-600">Personalized recommendations will appear here</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="summary-buttons flex gap-4">
          <Link 
            to="/testing"
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-gray-700 transition-colors"
          >
            New Analysis
          </Link>
          <button
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;
