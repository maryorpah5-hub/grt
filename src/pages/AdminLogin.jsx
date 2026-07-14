import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1629] font-inter px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#3B4B96] mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">S</div>
          <h1 className="font-outfit text-2xl font-bold text-[#0d1629]">Admin Secure Login</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#6b7280] text-xs font-semibold uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full border-2 border-gray-200 focus:border-[#3B4B96] rounded-xl px-4 py-3 text-[#0d1629] outline-none transition-colors font-medium"
            />
          </div>
          <div>
            <label className="block text-[#6b7280] text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border-2 border-gray-200 focus:border-[#3B4B96] rounded-xl px-4 py-3 text-[#0d1629] outline-none transition-colors font-medium"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3B4B96] hover:bg-[#2C3977] disabled:opacity-70 text-white py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-xl shadow-blue-900/20"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
