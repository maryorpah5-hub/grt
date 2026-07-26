import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    trackingNumber: '', status: '', origin: '', destination: '', eta: '', progress: ''
  });
  const [editingId, setEditingId] = useState(null);
  
  const [eventData, setEventData] = useState({ status: '', location: '', timestamp: '' });

  const handleEventInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    await fetch('/api/admin/tracking-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...eventData, trackingRecordId: editingId })
    });
    setEventData({ status: '', location: '', timestamp: '' });
    fetchTracking();
  };

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/admin/tracking-events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTracking();
  };
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchTracking = async () => {
    try {
      const res = await fetch('/api/admin/tracking', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTracking(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!token) return navigate('/secure-admin');
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContacts(), fetchTracking()]);
      setLoading(false);
    };
    loadData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/secure-admin');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      trackingNumber: record.trackingNumber,
      status: record.status,
      origin: record.origin,
      destination: record.destination,
      eta: record.eta,
      progress: record.progress
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ trackingNumber: '', status: '', origin: '', destination: '', eta: '', progress: '' });
  };

  const saveTracking = async (e) => {
    e.preventDefault();
    const data = { ...formData, progress: parseInt(formData.progress || '0', 10) };
    
    if (editingId) {
      await fetch(`/api/admin/tracking/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
    } else {
      await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
    }
    
    cancelEdit();
    fetchTracking();
  };

  const deleteTracking = async (id) => {
    if (!confirm('Are you sure you want to securely delete this record?')) return;
    await fetch(`/api/admin/tracking/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTracking();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#060d1a]">
      <div className="animate-spin h-10 w-10 border-4 border-[#3B4B96] border-t-[#D4AF37] rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060d1a] font-inter text-gray-200 relative overflow-hidden selection:bg-[#D4AF37] selection:text-[#0d1629]">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B4B96]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 md:px-10 h-20 flex items-center justify-between sticky top-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#3B4B96] to-[#4F62B8] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/30 ring-1 ring-white/20">S</div>
          <span className="font-outfit text-white text-xl font-bold tracking-wide hidden sm:inline">
            SecureLine <span className="text-[#D4AF37] font-light">Command Center</span>
          </span>
        </div>
        <button onClick={handleLogout} className="text-red-400 font-semibold hover:text-red-300 hover:bg-red-500/10 px-5 py-2.5 rounded-xl transition-all duration-300 text-sm md:text-base border border-transparent hover:border-red-500/20">
          Sign Out <span className="hidden sm:inline">Access</span>
        </button>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-8 md:py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'messages' ? 'bg-[#3B4B96] text-white shadow-lg shadow-blue-900/30 ring-1 ring-white/20 scale-[1.02]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>
            Communication Intel ({messages.length})
          </button>
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${activeTab === 'tracking' ? 'bg-[#D4AF37] text-[#060d1a] shadow-lg shadow-orange-500/20 ring-1 ring-[#D4AF37]/50 scale-[1.02]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}>
            Active Logistics ({tracking.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-[fadeIn_0.4s_ease-out]">
          {activeTab === 'messages' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02]"><h2 className="font-outfit font-bold text-xl md:text-2xl text-white">Encrypted Inquiries</h2></div>
              <div className="divide-y divide-white/5">
                {messages.length === 0 ? <p className="p-10 text-gray-500 text-center font-medium">No active communications found.</p> : null}
                {messages.map(msg => (
                  <div key={msg.id} className="p-6 md:p-8 hover:bg-white/5 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                      <div>
                        <h3 className="font-bold text-white text-lg md:text-xl tracking-wide">{msg.name}</h3>
                        <div className="text-sm text-gray-400 flex flex-wrap gap-x-5 gap-y-2 mt-2">
                          <span className="flex items-center gap-1.5"><span className="text-[#D4AF37]">📞</span> {msg.phone}</span>
                          {msg.email && <span className="flex items-center gap-1.5"><span className="text-[#3B4B96]">✉️</span> {msg.email}</span>}
                          {msg.service && <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10 text-xs text-[#D4AF37]">{msg.service}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-semibold shrink-0 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-5 text-gray-300 bg-black/30 p-5 rounded-2xl text-sm border border-white/5 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-8 md:space-y-10">
              
              {/* Form Section */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h2 className="font-outfit font-bold text-xl md:text-2xl text-white">
                    {editingId ? 'Modify Secure Record' : 'Initialize Shipment'}
                  </h2>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white text-sm font-bold bg-white/5 px-4 py-2 rounded-xl transition-colors border border-white/10">
                      Abort Modification
                    </button>
                  )}
                </div>
                
                <form onSubmit={saveTracking} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 relative z-10">
                  {[
                    {name: 'trackingNumber', placeholder: 'ID (e.g. SLD-123)'},
                    {name: 'status', placeholder: 'Current Status'},
                    {name: 'origin', placeholder: 'Origin Location'},
                    {name: 'destination', placeholder: 'Destination'},
                    {name: 'eta', placeholder: 'Est. Arrival'},
                  ].map(f => (
                    <input key={f.name} name={f.name} value={formData[f.name]} onChange={handleInputChange} placeholder={f.placeholder} required className="bg-black/30 border border-white/10 focus:border-[#D4AF37] focus:bg-black/50 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-gray-600 text-sm font-medium w-full" />
                  ))}
                  <input name="progress" type="number" min="0" max="100" value={formData.progress} onChange={handleInputChange} placeholder="Completion % (0-100)" required className="bg-black/30 border border-white/10 focus:border-[#D4AF37] focus:bg-black/50 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-gray-600 text-sm font-medium w-full" />
                  
                  <button type="submit" className="sm:col-span-2 bg-gradient-to-r from-[#D4AF37] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#FCD34D] text-[#060d1a] font-bold py-4 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/10 mt-2 text-sm tracking-wide">
                    {editingId ? 'Finalize Modification' : 'Deploy Record'}
                  </button>
                </form>

                {editingId && (
                  <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                    <h3 className="font-outfit font-bold text-lg text-white mb-6">Timeline Events</h3>
                    
                    <form onSubmit={saveEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <input name="status" value={eventData.status} onChange={handleEventInputChange} placeholder="Event Status (e.g. In Transit)" required className="bg-black/30 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white text-sm" />
                      <input name="location" value={eventData.location} onChange={handleEventInputChange} placeholder="Location" required className="bg-black/30 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white text-sm" />
                      <div className="flex gap-2">
                        <input name="timestamp" type="datetime-local" value={eventData.timestamp} onChange={handleEventInputChange} required className="bg-black/30 border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white text-sm w-full [color-scheme:dark]" />
                        <button type="submit" className="bg-[#3B4B96] hover:bg-[#4F62B8] text-white px-4 rounded-xl font-bold transition-colors shadow-lg">Add</button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {tracking.find(t => t.id === editingId)?.events?.map(ev => (
                        <div key={ev.id} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                          <div>
                            <div className="font-bold text-white text-sm">{ev.status}</div>
                            <div className="text-xs text-gray-400">{ev.location} &bull; {new Date(ev.timestamp).toLocaleString()}</div>
                          </div>
                          <button onClick={() => deleteEvent(ev.id)} className="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 bg-red-500/10 rounded-lg">Delete</button>
                        </div>
                      ))}
                      {tracking.find(t => t.id === editingId)?.events?.length === 0 && (
                        <div className="text-gray-500 text-sm text-center">No timeline events yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Layout for Records */}
              <div>
                <div className="flex items-center gap-4 mb-6 px-2">
                  <h2 className="font-outfit font-bold text-xl md:text-2xl text-white">Active Grid</h2>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                
                {tracking.length === 0 ? (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 text-center text-gray-500 font-medium">
                    No authorized shipments in the grid.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {tracking.map(t => (
                      <div key={t.id} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-5 md:p-6 flex flex-col gap-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group shadow-lg">
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <div className="font-bold text-[#D4AF37] text-xl tracking-tight mb-1">{t.trackingNumber}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-[#3B4B96] bg-[#3B4B96]/10 inline-block px-3 py-1 rounded-md border border-[#3B4B96]/20">{t.status}</div>
                          </div>
                          <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => handleEdit(t)} className="text-white hover:text-[#D4AF37] font-semibold text-xs bg-black/40 px-4 py-2 rounded-lg border border-white/10 hover:border-[#D4AF37]/50 transition-colors">Modify</button>
                            <button onClick={() => deleteTracking(t.id)} className="text-red-400 hover:text-red-300 font-semibold text-xs bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-colors">Terminate</button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-400 bg-black/30 rounded-2xl p-4 border border-white/5 mt-1">
                          <div className="flex justify-between items-center mb-2.5">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Vector</span>
                            <span className="font-medium text-white">{t.origin} <span className="text-[#3B4B96] mx-1">→</span> {t.destination}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Projected ETA</span>
                            <span className="font-medium text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">{t.eta}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                          <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3B4B96] to-[#D4AF37] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{width: `${t.progress}%`}}/>
                          </div>
                          <span className="text-xs font-bold text-white w-10 text-right tabular-nums">{t.progress}%</span>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
