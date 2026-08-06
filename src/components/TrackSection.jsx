import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgImage from '../assets/images/cargos1.jpg'

export default function TrackSection() {
  const [tracking, setTracking] = useState('');
  const navigate = useNavigate();

  const handleTrack = () => {
    const trimmed = tracking.trim();
    if (!trimmed) return;
    navigate(`/track/${encodeURIComponent(trimmed)}`);
  };

  return (
    <section id="track" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#060d1a]/95 via-[#0d1629]/90 to-[#1c2b4a]/80" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#3B4B96]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: feature list */}
          <div className="fade-in">
            <span className="inline-block bg-[#3B4B96]/20 text-[#3B4B96] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Live Tracking
            </span>
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Track Your Shipment<br/>With Ease
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Our intelligent tracking tools give you full control — stay informed every step of the delivery journey.
            </p>
            <ul className="space-y-4">
              {[
                'Track from anywhere, at any time',
                'Follow your package with one tap',
                'Automatic alerts & push notifications',
                'Barcode & QR code scanning',
                'Real-time estimated delivery windows',
              ].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#3B4B96] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</span>
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: tracking form */}
          <div className="fade-in">
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30">
              <h3 className="font-outfit text-2xl font-bold text-[#0d1629] mb-1">Enter Consignment Number</h3>
              <p className="text-[#6b7280] text-sm mb-6">Get real-time updates on your shipment status</p>

              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={tracking}
                  onChange={e => setTracking(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                  placeholder="e.g. SLD-US-7742193"
                  className="flex-1 border-2 border-gray-200 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-[#0d1629] outline-none transition-colors text-sm font-medium"
                />
                <button
                  onClick={handleTrack}
                  className="bg-[#D4AF37] hover:bg-[#FBBF24] text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap"
                >
                  Track Now
                </button>
              </div>
              <p className="text-[#9ca3af] text-xs mb-4">Formats: SLD-US-7742193 · SLUS884219 · SLD-2025-00142</p>

              <div className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-[#3B4B96]/5 border border-[#3B4B96]/10">
                <div className="w-8 h-8 rounded-full bg-[#3B4B96]/10 flex items-center justify-center text-[#3B4B96] text-lg shrink-0">🔍</div>
                <p className="text-[#6b7280] text-xs leading-relaxed">
                  Enter your consignment number above and press <span className="font-semibold text-[#0d1629]">Track Now</span> to get a full real-time status update.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
