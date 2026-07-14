import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/shiponseaatnight.jpg';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/secure-admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network connection error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-inter relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#060d1a]/95 via-[#0d1629]/90 to-[#1c2b4a]/85 backdrop-blur-sm" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B4B96]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-[420px] p-8 md:p-10 mx-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl shadow-black/50 z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B4B96] to-[#4F62B8] mx-auto flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-900/30 ring-1 ring-white/20">S</div>
          <h1 className="font-outfit text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Secure Portal</h1>
          <p className="text-white/50 text-sm font-medium">Authorized personnel only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold p-4 rounded-xl mb-6 text-center animate-[fadeIn_0.3s_ease]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest pl-1">Admin ID</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Enter your assigned ID"
              className="w-full bg-black/20 border border-white/10 focus:border-[#D4AF37] focus:bg-black/30 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-white/30 text-sm font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest pl-1">Passphrase</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/10 focus:border-[#D4AF37] focus:bg-black/30 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-white/30 text-sm font-medium tracking-widest"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] disabled:opacity-70 text-[#0d1629] py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 mt-4"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#0d1629]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : 'Authenticate Request'}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </button>
        </form>
      </div>
    </div>
  );
}
