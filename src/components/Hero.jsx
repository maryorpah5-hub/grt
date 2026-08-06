import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forkliftImage from '../assets/images/forklift_Image.webp';
import flightBg from '../assets/images/flight2.jpg';

export default function Hero() {
  const [tracking, setTracking] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e?.preventDefault();
    const trimmed = tracking.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        navigate(`/track/${encodeURIComponent(trimmed)}`);
      } else {
        setError('Tracking number not found. Please check and try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-white pt-24 pb-12">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, #3B4B96 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}
      />

      {/* Flight image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-[0.55] z-0"
        style={{ backgroundImage: `url(${flightBg})` }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* LEFT: Forklift image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none z-0" />
            <img
              src={forkliftImage}
              alt="Forklift with cargo"
              className="w-full max-w-[600px] object-contain relative z-10 drop-shadow-xl"
            />
          </div>

          {/* RIGHT: Tracking form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-[500px] mx-auto lg:mx-0 z-10">
            <h1 className="font-outfit text-3xl md:text-[2.1rem] font-semibold text-[#1a1f36] mb-6 tracking-tight">
              Enter The Consignment No.
            </h1>

            <form
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row mb-4 shadow-sm border border-gray-200 bg-white"
            >
              <input
                type="text"
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                placeholder="Enter Tracking Number"
                className="flex-grow px-5 py-4 focus:outline-none focus:border-[#3B4B96] focus:ring-1 focus:ring-[#3B4B96] text-gray-700 bg-transparent text-[15px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3B4B96] hover:bg-[#2c3977] disabled:opacity-60 text-white px-8 py-4 font-semibold transition-colors duration-200 whitespace-nowrap text-sm tracking-wide"
              >
                {loading ? 'CHECKING...' : 'TRACK RESULT'}
              </button>
            </form>

            {!error && (
              <p className="text-[#333333] font-medium text-[15px]">
                Ex: SLD-US-7742193
              </p>
            )}

            {error && (
              <div className="mt-2 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-[fadeIn_0.3s_ease]">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
