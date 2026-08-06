import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

/* ─── Status meta ─────────────────────────────────────────────────── */
const STATUS_META = {
  'Delivered':         { color: '#22c55e', bg: '#052e16', label: 'Delivered',         icon: '✓' },
  'Out for Delivery':  { color: '#f97316', bg: '#431407', label: 'Out for Delivery',   icon: '🚚' },
  'In Transit':        { color: '#93c5fd', bg: '#1e3a5f', label: 'In Transit',         icon: '✈' },
  'On Hold':           { color: '#D4AF37', bg: '#3a2f0b', label: 'On Hold',            icon: '⏸' },
  'Pending':           { color: '#9ca3af', bg: '#1f2937', label: 'Pending',            icon: '⏳' },
  'Customs Clearance': { color: '#c4b5fd', bg: '#2e1065', label: 'Customs Clearance',  icon: '🛃' },
  'Returned':          { color: '#fca5a5', bg: '#450a0a', label: 'Returned',           icon: '↩' },
};
const getStatusMeta = (s) =>
  STATUS_META[s] ?? { color: '#93c5fd', bg: '#1e3a5f', label: s, icon: '📦' };

/* ─── Spinner ─────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center gap-5 px-6">
      <div className="w-14 h-14 rounded-full border-4 border-[#3B4B96] border-t-[#D4AF37] animate-spin" />
      <p className="text-white/50 font-medium text-sm tracking-wide text-center">Locating your shipment…</p>
    </div>
  );
}

/* ─── Sticky TopBar ────────────────────────────────────────────────── */
function TopBar({ input, setInput, handleSearch }) {
  return (
    <header className="sticky top-0 z-50 bg-[#060d1a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Brand mark */}
        <Link to="/" className="shrink-0">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#3B4B96] to-[#4F62B8] rounded-lg flex items-center justify-center text-white font-bold text-sm ring-1 ring-white/20">
            S
          </div>
        </Link>

        {/* Search form — fills remaining space */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex-1 flex items-center bg-white/[0.07] border border-white/10 focus-within:border-[#D4AF37]/60 rounded-xl px-3 py-2 transition-all min-w-0">
            <svg className="w-4 h-4 text-white/30 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter tracking number…"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/25 text-sm font-medium min-w-0"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 bg-[#D4AF37] hover:bg-[#FBBF24] text-[#060d1a] px-3.5 py-2 rounded-xl font-bold text-sm transition-colors"
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
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl mb-6">🔍</div>
      <h2 className="font-outfit text-2xl font-bold text-white mb-2">No Result Found</h2>
      <p className="text-white/50 mb-2 max-w-xs text-sm leading-relaxed">
        We couldn't find a shipment for:
      </p>
      <span className="font-mono text-[#D4AF37] font-bold text-base mb-8 break-all px-4 text-center">{trackingNumber}</span>
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

  if (loading) return <div className="min-h-screen bg-[#060d1a]"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-[#060d1a] font-inter text-white">
      {/* Ambient glows — hidden on mobile for performance */}
      <div className="pointer-events-none hidden sm:block fixed top-0 right-0 w-[500px] h-[500px] bg-[#3B4B96]/8 rounded-full blur-[140px]" />
      <div className="pointer-events-none hidden sm:block fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />

      <TopBar input={input} setInput={setInput} handleSearch={handleSearch} />

      {notFound ? (
        <NotFound trackingNumber={number} onRetry={() => navigate('/')} />
      ) : result ? (
        <ResultBody result={result} />
      ) : null}
    </div>
  );
}

/* ─── Result Body (extracted for clarity) ─────────────────────────── */
function ResultBody({ result }) {
  const meta        = getStatusMeta(result.status);
  const latestEvent = result.events?.[0] ?? null;
  const allEvents   = result.events ?? [];

  /* Simple 4-step pipeline */
  const STEPS = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered'];
  const stepIdx = Math.max(0, STEPS.findIndex(s => s === result.status));

  return (
    <main className="relative z-10 max-w-2xl mx-auto px-4 pb-20 pt-6">

      {/* ── Tracking number + status ── */}
      <div className="mb-5">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-1.5">Tracking Number</p>
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="font-outfit text-xl sm:text-2xl font-bold text-white tracking-tight break-all flex-1 min-w-0">
            {result.trackingNumber}
          </h1>
          <span
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border"
            style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.color + '55' }}
          >
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>

      {/* ── Latest Update Banner ── */}
      <div className="rounded-2xl overflow-hidden mb-4 border border-[#3B4B96]/30 bg-[#0d1629] shadow-xl">
        <div className="flex items-stretch">
          <div className="w-1 shrink-0 bg-gradient-to-b from-[#D4AF37] to-[#3B4B96]" />
          <div className="p-4 sm:p-5 flex-1 min-w-0">
            <p className="text-[#D4AF37] font-outfit font-bold text-xs uppercase tracking-widest mb-2.5">Latest Update</p>
            {latestEvent ? (
              <>
                <p className="text-white/85 text-[14px] leading-relaxed mb-3">
                  Your shipment is <span className="text-white font-semibold">{latestEvent.status}</span> at{' '}
                  <span className="text-white font-semibold">{latestEvent.location}</span>.{' '}
                  {result.status !== 'Delivered'
                    ? `Estimated delivery: ${result.eta}.`
                    : 'Your package has been successfully delivered.'}
                </p>
                <div className="h-px bg-white/10 mb-3" />
                <p className="text-white/35 text-[12px]">
                  Last scanned:&nbsp;
                  <span className="text-white/60">
                    {new Date(latestEvent.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-white/60 text-[14px] leading-relaxed">
                Shipment registered. Tracking events will appear once the package is scanned.
                {result.eta && ` Estimated delivery: ${result.eta}.`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Origin / Destination / ETA ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Origin',       value: result.origin,      icon: '📍' },
          { label: 'Destination',  value: result.destination,  icon: '🎯' },
          { label: 'Est. Arrival', value: result.eta,          icon: '📅' },
        ].map(c => (
          <div key={c.label} className="bg-white/[0.04] border border-white/10 rounded-xl p-3 flex flex-col gap-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-white/35 font-semibold">{c.label}</span>
            <span className="text-white font-semibold text-[11px] sm:text-xs leading-tight break-words">{c.icon} {c.value ?? '—'}</span>
          </div>
        ))}
      </div>

      {/* ── Progress ── */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 mb-4">
        {/* Label + percentage */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/60 text-sm font-semibold">Delivery Progress</p>
          <span className="font-outfit font-bold text-[#D4AF37] text-base">{result.progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-4 relative">
          <div
            className="h-full bg-gradient-to-r from-[#3B4B96] to-[#D4AF37] rounded-full transition-all duration-1000 relative"
            style={{ width: `${result.progress}%` }}
          >
            {result.progress > 5 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
            )}
          </div>
        </div>

        {/* Step pills — mobile-friendly horizontal scroll if needed */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {STEPS.map((s, i) => {
            const done = i <= stepIdx;
            return (
              <div key={s} className="flex items-center gap-1 shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                      done
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#060d1a]'
                        : 'bg-transparent border-white/15 text-white/25'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-[9px] font-semibold text-center max-w-[52px] leading-tight ${done ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 sm:w-10 h-px mb-4 ${i < stepIdx ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5">
        <h2 className="font-outfit font-bold text-base sm:text-lg text-white mb-5">Tracking History</h2>

        {allEvents.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-white/40 text-sm">No tracking events yet. Check back soon.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#3B4B96]/50 to-white/5" />

            <div className="space-y-5">
              {allEvents.map((ev, i) => {
                const isLatest = i === 0;
                return (
                  <div key={ev.id} className="flex gap-4 relative">
                    {/* Dot */}
                    <div className="shrink-0 mt-0.5" style={{ width: 24 }}>
                      <div
                        className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center text-[9px] font-bold z-10 relative ${
                          isLatest
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-[#060d1a] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                            : 'border-[#3B4B96] bg-[#0d1629] text-white/40'
                        }`}
                      >
                        {isLatest ? '●' : '○'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 min-w-0 pb-1 ${isLatest ? '' : 'opacity-70'}`}>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className={`font-bold text-sm ${isLatest ? 'text-white' : 'text-white/70'}`}>
                          {ev.status}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-white/55 text-[13px] font-medium mb-1 truncate">{ev.location}</p>
                      <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wide">
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
      <p className="text-center text-white/20 text-[11px] mt-8 leading-relaxed px-2">
        SecureLine Delivery — All shipment data is encrypted and secured.{' '}
        <a href="/#contact" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors">
          Contact support
        </a>
      </p>
    </main>
  );
}
