import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

/* ─── Status → colour + icon mapping ──────────────────────────────── */
const STATUS_META = {
  'Delivered':        { color: '#22c55e', bg: '#dcfce7', label: 'Delivered',        icon: '✓' },
  'Out for Delivery': { color: '#f97316', bg: '#ffedd5', label: 'Out for Delivery',  icon: '🚚' },
  'In Transit':       { color: '#3B4B96', bg: '#e0e7ff', label: 'In Transit',        icon: '✈' },
  'On Hold':          { color: '#D4AF37', bg: '#fef9c3', label: 'On Hold',           icon: '⏸' },
  'Pending':          { color: '#6b7280', bg: '#f3f4f6', label: 'Pending',           icon: '⏳' },
  'Customs Clearance':{ color: '#8b5cf6', bg: '#ede9fe', label: 'Customs Clearance', icon: '🛃' },
  'Returned':         { color: '#ef4444', bg: '#fee2e2', label: 'Returned',          icon: '↩' },
};
const getStatusMeta = (s) =>
  STATUS_META[s] ?? { color: '#3B4B96', bg: '#e0e7ff', label: s, icon: '📦' };

/* ─── Spinner ──────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full border-4 border-[#3B4B96] border-t-[#D4AF37] animate-spin" />
        <p className="text-white/50 font-medium text-sm tracking-wide">Locating your shipment…</p>
      </div>
    </div>
  );
}

/* ─── Not Found ────────────────────────────────────────────────────── */
function NotFound({ trackingNumber, onRetry }) {
  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl mb-6">🔍</div>
      <h2 className="font-outfit text-2xl font-bold text-white mb-2">No Result Found</h2>
      <p className="text-white/50 mb-2 max-w-sm">
        We couldn't find a shipment for tracking number:
      </p>
      <span className="font-mono text-[#D4AF37] font-bold text-lg mb-8">{trackingNumber}</span>
      <button
        onClick={onRetry}
        className="bg-[#3B4B96] hover:bg-[#4F62B8] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-sm"
      >
        Try Another Number
      </button>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function TrackingResult() {
  const { number } = useParams();
  const navigate = useNavigate();

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [input, setInput]     = useState(number ?? '');

  const fetchTracking = async (num) => {
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(num.trim())}`);
      if (res.ok) {
        setResult(await res.json());
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (number) fetchTracking(number);
  }, [number]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/track/${encodeURIComponent(input.trim())}`);
  };

  /* ── Loading / not-found early exits ── */
  if (loading) return <Spinner />;
  if (notFound) return (
    <>
      <TopBar input={input} setInput={setInput} handleSearch={handleSearch} />
      <NotFound trackingNumber={number} onRetry={() => navigate('/')} />
    </>
  );

  const meta       = getStatusMeta(result.status);
  const latestEvent = result.events?.[0] ?? null;
  const allEvents   = result.events ?? [];

  /* ── Progress visual steps ── */
  const STEPS = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStep = STEPS.includes(result.status) ? STEPS.indexOf(result.status) : 1;

  return (
    <div className="min-h-screen bg-[#060d1a] font-inter text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] bg-[#3B4B96]/8 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />

      {/* ── Sticky Topbar ── */}
      <TopBar input={input} setInput={setInput} handleSearch={handleSearch} />

      {/* ── Page body ── */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-24 pt-8">

        {/* Tracking ID + Status badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Tracking Number</p>
            <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {result.trackingNumber}
            </h1>
          </div>
          <span
            className="self-start sm:self-center text-sm font-bold px-4 py-2 rounded-full border"
            style={{ color: meta.color, backgroundColor: meta.bg + '22', borderColor: meta.color + '55' }}
          >
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* ── Latest Update Banner ── */}
        <div className="rounded-2xl overflow-hidden mb-6 border border-[#3B4B96]/30 bg-gradient-to-br from-[#0d1629] to-[#111d35] shadow-xl">
          <div className="flex items-stretch">
            {/* gold left accent bar */}
            <div className="w-1.5 shrink-0 bg-gradient-to-b from-[#D4AF37] to-[#3B4B96]" />
            <div className="p-5 sm:p-6 flex-1">
              <p className="text-[#D4AF37] font-outfit font-bold text-sm uppercase tracking-widest mb-3">Latest Update</p>
              {latestEvent ? (
                <>
                  <p className="text-white/90 text-[15px] leading-relaxed mb-4">
                    Your shipment is currently <span className="text-white font-semibold">{latestEvent.status}</span>{' '}
                    at <span className="text-white font-semibold">{latestEvent.location}</span>.{' '}
                    {result.status !== 'Delivered'
                      ? `Estimated delivery: ${result.eta}.`
                      : 'Your package has been successfully delivered.'}
                  </p>
                  <div className="h-px bg-white/10 mb-4" />
                  <div className="flex flex-wrap items-center gap-3 text-[13px]">
                    <span className="text-white/40 font-medium">
                      Last scanned:&nbsp;
                      <span className="text-white/70">
                        {new Date(latestEvent.timestamp).toLocaleString(undefined, {
                          month: 'long', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-white/60 text-[15px] leading-relaxed">
                  Your shipment has been registered. Tracking updates will appear once the package is scanned.
                  {result.eta && ` Estimated delivery: ${result.eta}.`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Route & ETA Card ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Origin',      value: result.origin,      icon: '📍' },
            { label: 'Destination', value: result.destination,  icon: '🎯' },
            { label: 'Est. Arrival',value: result.eta,          icon: '📅' },
          ].map(c => (
            <div key={c.label} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">{c.label}</span>
              <span className="text-white font-semibold text-sm">{c.icon} {c.value ?? '—'}</span>
            </div>
          ))}
        </div>

        {/* ── Delivery Progress Bar ── */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white/70 text-sm font-semibold">Delivery Progress</p>
            <span className="font-outfit font-bold text-[#D4AF37] text-lg">{result.progress}%</span>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-0 mb-4">
            {STEPS.map((s, i) => {
              const done    = i <= currentStep;
              const isLast  = i === STEPS.length - 1;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                        done
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#060d1a]'
                          : 'bg-transparent border-white/20 text-white/30'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`text-[9px] font-semibold text-center uppercase tracking-wide w-14 ${done ? 'text-[#D4AF37]' : 'text-white/25'}`}>
                      {s}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < currentStep ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bar */}
          <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#3B4B96] to-[#D4AF37] rounded-full transition-all duration-1000 relative"
              style={{ width: `${result.progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            </div>
          </div>
        </div>

        {/* ── Tracking Timeline ── */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6">
          <h2 className="font-outfit font-bold text-lg text-white mb-6">Tracking History</h2>

          {allEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-white/40 text-sm">No tracking events yet. Check back soon.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#3B4B96]/60 to-white/10" />

              <div className="space-y-6">
                {allEvents.map((ev, i) => {
                  const evMeta = getStatusMeta(ev.status);
                  const isLatest = i === 0;
                  return (
                    <div key={ev.id} className="flex gap-5 relative">
                      {/* Dot */}
                      <div className="shrink-0 flex flex-col items-center" style={{ width: 28 }}>
                        <div
                          className={`w-7 h-7 rounded-full border-4 flex items-center justify-center text-[10px] font-bold transition-all z-10 ${
                            isLatest
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-[#060d1a] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                              : 'border-[#3B4B96] bg-[#0d1629] text-white/50'
                          }`}
                        >
                          {isLatest ? '●' : '○'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-2 ${isLatest ? '' : 'opacity-75'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <span
                            className={`font-bold text-[15px] ${isLatest ? 'text-white' : 'text-white/70'}`}
                          >
                            {ev.status}
                          </span>
                          {isLatest && (
                            <span
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto"
                              style={{ color: evMeta.color, backgroundColor: evMeta.bg + '22' }}
                            >
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-sm font-medium mb-1">{ev.location}</p>
                        <p className="text-white/30 text-[12px] font-semibold uppercase tracking-wide">
                          {new Date(ev.timestamp).toLocaleString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric',
                            year: 'numeric', hour: 'numeric', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-white/20 text-xs mt-8 leading-relaxed">
          SecureLine Delivery — All shipment data is encrypted and secured.<br />
          For support, contact us at{' '}
          <a href="/#contact" className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">our contact page</a>.
        </p>
      </main>
    </div>
  );
}

/* ─── Shared TopBar ────────────────────────────────────────────────── */
function TopBar({ input, setInput, handleSearch }) {
  return (
    <header className="sticky top-0 z-50 bg-[#060d1a]/90 backdrop-blur-xl border-b border-white/8 shadow-2xl">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#3B4B96] to-[#4F62B8] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg ring-1 ring-white/20">
            S
          </div>
          <span className="font-outfit text-white font-bold hidden sm:inline text-sm tracking-wide">
            Secure<span className="text-[#D4AF37] font-light">Line</span>
          </span>
        </Link>

        {/* Re-search bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/[0.06] border border-white/10 focus-within:border-[#D4AF37]/60 rounded-xl px-3 py-2 transition-all">
            <svg className="w-4 h-4 text-white/30 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter tracking number…"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/25 text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-[#D4AF37] hover:bg-[#FBBF24] text-[#060d1a] px-4 py-2 rounded-xl font-bold text-sm transition-colors whitespace-nowrap shadow-lg shadow-orange-500/10"
          >
            Track
          </button>
        </form>
      </div>
    </header>
  );
}
