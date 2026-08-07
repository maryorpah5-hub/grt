import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

/* ─── Spinner ─────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-6">
      <div className="w-14 h-14 rounded-full border-4 border-[#336699] border-t-transparent animate-spin" />
      <p className="text-[#333333] font-medium text-sm tracking-wide text-center">Locating your shipment…</p>
    </div>
  );
}

/* ─── Sticky TopBar ────────────────────────────────────────────────── */
function TopBar({ input, setInput, handleSearch }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand mark */}
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <img src={logo} alt="Secureline" className="w-10 h-10 object-contain" />
          <span className="font-outfit text-[#336699] font-bold hidden sm:inline text-xl tracking-tight">
            Secureline<span className="text-[#D4AF37]">Delivery</span>
          </span>
        </Link>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm flex items-center gap-2 min-w-0">
          <div className="flex-1 flex items-center bg-gray-100 border border-gray-300 focus-within:border-[#336699] rounded-md px-3 py-2 transition-all min-w-0">
            <svg className="w-4 h-4 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search or enter tracking number"
              className="flex-1 bg-transparent outline-none text-[#333333] placeholder:text-gray-500 text-sm font-medium min-w-0"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 bg-[#336699] hover:bg-[#2b5c92] text-white px-4 py-2 rounded-md font-bold text-sm transition-colors"
          >
            Track
          </button>
        </form>
      </div>
    </header>
  );
}

/* ─── Not Found ────────────────────────────────────────────────────── */
function NotFound({ trackingNumber, onRetry }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-4xl mb-6 text-red-500">!</div>
      <h2 className="font-sans text-2xl font-bold text-[#333333] mb-2">Tracking Number Not Found</h2>
      <p className="text-gray-600 mb-2 max-w-xs text-sm leading-relaxed">
        We couldn't find a shipment for:
      </p>
      <span className="font-mono text-[#336699] font-bold text-base mb-8 break-all px-4 text-center">{trackingNumber}</span>
      <button
        onClick={onRetry}
        className="bg-[#336699] hover:bg-[#2b5c92] text-white px-8 py-3.5 rounded-md font-semibold transition-colors text-sm"
      >
        Try Another Number
      </button>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function TrackingResult() {
  const { number }  = useParams();
  const navigate    = useNavigate();

  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [input,    setInput]    = useState(number ?? '');

  const fetchTracking = async (num) => {
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(num.trim())}`);
      if (res.ok) setResult(await res.json());
      else        setNotFound(true);
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => { if (number) fetchTracking(number); }, [number]);

  const handleSearch = (e) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    navigate(`/track/${encodeURIComponent(t)}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-white font-sans text-[#333333]">
      <TopBar input={input} setInput={setInput} handleSearch={handleSearch} />

      {notFound ? (
        <NotFound trackingNumber={number} onRetry={() => navigate('/')} />
      ) : result ? (
        <ResultBody result={result} />
      ) : null}
    </div>
  );
}

/* ─── Result Body ─────────────────────────────────────────────────── */
function ResultBody({ result }) {
  const [showHistory, setShowHistory] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const latestEvent = result.events?.[0] ?? null;
  const allEvents   = result.events ?? [];
  const visibleEvents = showHistory ? allEvents : allEvents.slice(0, 3);

  // Simulate a realistic tracking timeline steps
  const BASE_STEPS = ['Delivered', 'Out for Delivery', 'Preparing for Delivery'];
  
  // Format date nicely for USPS style
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = d.getDate();
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month} ${day}, ${year} at ${time}`;
  };

  const formatShortDate = (isoString) => {
    const d = new Date(isoString);
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = d.getDate();
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month} ${day}, ${year} ${time}`;
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 pt-8">
      
      {/* Tracking Number Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#336699] tracking-tight mb-6 sm:mb-8 break-all">
        {result.trackingNumber}
      </h1>

      {/* ── Latest Update Banner ── */}
      <div className="mb-8 border-l-[8px] sm:border-l-[12px] border-[#336699] bg-[#e8f4f8]">
        <div className="p-4 sm:p-6">
          <h2 className="text-[#336699] font-bold text-xl sm:text-2xl mb-3 sm:mb-4">Latest Update</h2>
          {latestEvent ? (
            <>
              <p className="text-[#333333] text-[15px] sm:text-[16px] leading-relaxed mb-5 sm:mb-6">
                Your package is moving within the Secureline network and is on track to be delivered to its final destination. As of {formatDate(latestEvent.timestamp)}, it is currently <strong>{latestEvent.status.toLowerCase()}</strong> at <strong>{latestEvent.location}</strong>.
              </p>
              <div className="h-px bg-[#336699] mb-5" />
              <p className="text-[#336699] font-bold text-base mb-1">
                Get More Out of Secureline Tracking:
              </p>
              <div className="flex items-center gap-2 text-[#336699]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-bold cursor-pointer hover:underline">Secureline Tracking Plus®</span>
              </div>
            </>
          ) : (
            <p className="text-[#333333] text-[16px] leading-relaxed">
              Your shipment has been registered in the Secureline network. Tracking events will appear once the package receives its first scan.
              {result.eta && ` Estimated delivery: ${result.eta}.`}
            </p>
          )}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="pl-2 sm:pl-6 max-w-2xl">
        {/* Future steps (gray) */}
        {result.status !== 'Delivered' && (
          <div className="relative border-l-[3px] border-[#d1d5db] ml-3 pb-8 space-y-8">
            {BASE_STEPS.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[5.5px] top-1.5 w-2 h-2 rounded-full bg-[#9ca3af]" />
                <div className="font-bold text-[#9ca3af] text-base">{step}</div>
              </div>
            ))}
          </div>
        )}

        {/* Current & Past Events */}
        {allEvents.length > 0 && (
          <div className="relative border-l-[3px] border-[#336699] ml-3 pb-8">
            <div className="space-y-8">
              {visibleEvents.map((ev, i) => {
                const isLatest = i === 0;
                return (
                  <div key={ev.id} className="relative pl-8">
                    {/* Dot */}
                    {isLatest ? (
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#336699]" />
                    ) : (
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[#336699]" />
                    )}

                    {/* Content */}
                    <div className="pb-1">
                      {isLatest && (
                        <div className="font-bold text-xl text-[#336699] mb-1">On the Way</div>
                      )}
                      
                      <div className={`font-bold ${isLatest ? 'text-[#333333] text-base' : 'text-[#336699] text-base mb-1'}`}>
                        {ev.status}
                      </div>
                      
                      {ev.location && (
                        <p className={`text-[#6b7280] text-sm uppercase ${isLatest ? 'mt-0' : 'mb-0'}`}>
                          {ev.location}
                        </p>
                      )}
                      
                      <p className="text-[#6b7280] text-[15px] mt-0.5">
                        {formatShortDate(ev.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom link inside timeline line */}
            {allEvents.length > 3 && !showHistory && (
              <div className="relative pl-8 pt-8">
                 <div className="absolute -left-[7px] top-10 w-3 h-3 rounded-full bg-[#336699]" />
                 <button 
                   onClick={() => setShowHistory(true)}
                   className="text-[#336699] font-bold text-sm hover:underline mt-2"
                 >
                   See All Tracking History
                 </button>
              </div>
            )}
            {showHistory && (
              <div className="relative pl-8 pt-8">
                 <div className="absolute -left-[7px] top-10 w-3 h-3 rounded-full bg-[#336699]" />
                 <button 
                   onClick={() => setShowHistory(false)}
                   className="text-[#336699] font-bold text-sm hover:underline mt-2"
                 >
                   Hide Tracking History
                 </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-left sm:text-center">
        <button 
          onClick={() => setShowStatuses(!showStatuses)}
          className="text-[#336699] font-bold text-base sm:text-lg hover:underline mb-6 flex items-center justify-between w-full sm:justify-center sm:gap-2"
        >
          <span>What Do Secureline Tracking Statuses Mean?</span>
          <svg className={`w-5 h-5 transition-transform sm:hidden ${showStatuses ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showStatuses && (
          <div className="mb-10 text-left bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-[#333333] mb-3">Common Statuses:</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>Pending:</strong> Your shipment has been created but not yet handed over to us.</li>
              <li><strong>In Transit:</strong> Your package is on the move within our logistics network.</li>
              <li><strong>Out for Delivery:</strong> The package has reached the final local facility and is loaded onto a delivery vehicle.</li>
              <li><strong>Delivered:</strong> The package was successfully handed over to the recipient or left at the destination.</li>
            </ul>
          </div>
        )}
        
        <div 
          onClick={() => setShowUpdates(!showUpdates)}
          className="border-t border-gray-300 flex justify-between items-center py-5 sm:py-6 px-2 sm:px-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <span className="text-[#336699] font-bold text-lg sm:text-xl">Text & Email Updates</span>
          <svg className={`w-6 h-6 text-[#336699] transition-transform ${showUpdates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {showUpdates && (
          <div className="text-left bg-white p-4 sm:p-6 border-b border-x border-gray-300 mb-6">
            {subscribed ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-bold text-lg mb-1">Successfully Subscribed!</h4>
                <p className="text-sm text-green-700">You will now receive automatic updates for this shipment.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">Sign up to receive automatic tracking updates via text or email.</p>
                <form className="space-y-4 max-w-md mx-auto sm:mx-0" onSubmit={e => { e.preventDefault(); setSubscribed(true); }}>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input type="email" placeholder="Enter email" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#336699] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (Optional)</label>
                    <input type="tel" placeholder="(555) 555-5555" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#336699] focus:outline-none" />
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-[#336699]" defaultChecked />
                      <span className="text-sm text-gray-700 font-medium">All Activity Updates</span>
                    </label>
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-[#336699] hover:bg-[#2b5c92] text-white px-6 py-2 rounded font-bold text-sm transition-colors mt-2">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {!showUpdates && <div className="border-t border-gray-300" />}
      </div>

    </main>
  );
}
