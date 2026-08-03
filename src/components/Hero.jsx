import { useState } from 'react';
import forkliftImage from '../assets/images/forklift_Image.webp';
import flightBg from '../assets/images/flight2.jpg';

export default function Hero() {
  const [tracking, setTracking] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!tracking.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(tracking.trim())}`);
      if (res.ok) {
        setResult(await res.json());
      } else {
        setError('Tracking number not found. Please check and try again.');
      }
    } catch (e) {
      console.error(e);
      setError('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white pt-24 pb-12">
      {/* Subtle World Map Background (using radial gradient as fallback for clean aesthetic if map missing) */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, #3B4B96 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}/>
      
      {/* Flight background image with increased opacity */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-[0.55] z-0"
        style={{ backgroundImage: `url(${flightBg})` }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* LEFT: Forklift Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none z-0"></div>
            <img 
              src={forkliftImage} 
              alt="Forklift with cargo" 
              className="w-full max-w-[600px] object-contain relative z-10 drop-shadow-xl"
            />
          </div>

          {/* RIGHT: Tracking Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-[500px] mx-auto lg:mx-0 z-10">
            <h1 className="font-outfit text-3xl md:text-[2.1rem] font-semibold text-[#1a1f36] mb-6 tracking-tight">
              Enter The Consignment No.
            </h1>
            
            <form 
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row mb-4 shadow-sm border border-gray-200 bg-white">
              <input 
                type="text" 
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                placeholder="Enter Tracking Number"
                className="flex-grow px-5 py-4 focus:outline-none focus:border-[#3B4B96] focus:ring-1 focus:ring-[#3B4B96] text-gray-700 bg-transparent text-[15px]"
              />
              <button type="submit" disabled={loading} className="bg-[#3B4B96] hover:bg-[#2c3977] disabled:opacity-60 text-white px-8 py-4 font-semibold transition-colors duration-200 whitespace-nowrap text-sm tracking-wide">
                {loading ? 'TRACKING...' : 'TRACK RESULT'}
              </button>
            </form>
            
            {!result && !error && (
              <p className="text-[#333333] font-medium text-[17px]">
                Ex: SLD-US-7742193
              </p>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-50/90 border border-red-100 flex items-start gap-3 animate-[fadeIn_0.3s_ease]">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-4 border-2 border-[#3B4B96]/30 bg-white/95 rounded-2xl p-5 shadow-lg animate-[fadeIn_0.4s_ease]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-outfit font-bold text-[#0d1629]">{result.trackingNumber}</div>
                    <div className="text-xs text-[#6b7280]">{result.origin} → {result.destination}</div>
                  </div>
                  <span className="bg-[#3B4B96]/20 text-[#2C3977] text-xs font-semibold px-3 py-1 rounded-full">
                    {result.status}
                  </span>
                </div>
                <div className="text-xs text-[#6b7280] mb-2 flex justify-between mt-4">
                  <span>Delivery Progress</span>
                  <span className="font-semibold text-[#0d1629]">{result.progress}% · ETA {result.eta}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#3B4B96] rounded-full transition-all duration-1000"
                    style={{ width: `${result.progress}%` }}/>
                </div>

                {result.events && result.events.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-outfit font-bold text-[#0d1629] mb-4 text-sm">Tracking History</h4>
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-4">
                      {result.events.slice(0, 3).map((ev, i) => (
                        <div key={ev.id} className="relative pl-6">
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${i === 0 ? 'bg-[#D4AF37]' : 'bg-[#3B4B96]'}`} />
                          <div className={`font-bold text-sm ${i === 0 ? 'text-[#D4AF37]' : 'text-[#3B4B96]'}`}>
                            {ev.status}
                          </div>
                          <div className="text-[#6b7280] text-xs mt-0.5">{ev.location}</div>
                          <div className="text-[#9ca3af] text-[10px] uppercase tracking-wider font-semibold mt-1">
                            {new Date(ev.timestamp).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {result.events.length > 3 && (
                       <button onClick={() => {
                         const trackEl = document.getElementById('track');
                         if(trackEl) {
                           // Set the tracking value in the bottom section by simulating an event if we could, but here we just scroll
                           trackEl.scrollIntoView({ behavior: 'smooth' });
                         }
                       }} className="mt-4 text-xs font-bold text-[#3B4B96] hover:underline w-full text-center">
                         View Full History Below
                       </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
