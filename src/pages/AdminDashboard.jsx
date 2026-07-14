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
    if (!token) return navigate('/admin');
    
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContacts(), fetchTracking()]);
      setLoading(false);
    };
    loadData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
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
    if (!confirm('Are you sure you want to delete this record?')) return;
    await fetch(`/api/admin/tracking/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTracking();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-inter">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-4 md:px-8 h-20 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3B4B96] rounded-xl flex items-center justify-center text-white font-bold shadow-md">S</div>
          <span className="font-outfit text-[#3B4B96] text-xl font-bold hidden sm:inline">Admin <span className="text-[#D4AF37]">Portal</span></span>
        </div>
        <button onClick={handleLogout} className="text-red-500 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm md:text-base">
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'messages' ? 'bg-[#3B4B96] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>
            Messages ({messages.length})
          </button>
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'tracking' ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>
            Tracking ({tracking.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100"><h2 className="font-outfit font-bold text-lg md:text-xl text-[#0d1629]">Recent Inquiries</h2></div>
            <div className="divide-y divide-gray-100">
              {messages.length === 0 ? <p className="p-6 text-gray-500 text-center">No messages yet.</p> : null}
              {messages.map(msg => (
                <div key={msg.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <div>
                      <h3 className="font-bold text-[#0d1629] text-base md:text-lg">{msg.name}</h3>
                      <div className="text-xs md:text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>📞 {msg.phone}</span>
                        {msg.email && <span>✉️ {msg.email}</span>}
                        {msg.service && <span>🏷️ {msg.service}</span>}
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-semibold shrink-0">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 md:mt-4 text-gray-700 bg-gray-50 p-3 md:p-4 rounded-xl text-sm border border-gray-100">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-6 md:space-y-8">
            {/* Create/Edit form */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="font-outfit font-bold text-lg md:text-xl text-[#0d1629]">
                  {editingId ? 'Edit Tracking Record' : 'Create Tracking Record'}
                </h2>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 text-sm font-semibold">
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={saveTracking} className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <input name="trackingNumber" value={formData.trackingNumber} onChange={handleInputChange} placeholder="Tracking Number (e.g. SLD-123)" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <input name="status" value={formData.status} onChange={handleInputChange} placeholder="Status (e.g. In Transit)" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <input name="origin" value={formData.origin} onChange={handleInputChange} placeholder="Origin" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <input name="destination" value={formData.destination} onChange={handleInputChange} placeholder="Destination" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <input name="eta" value={formData.eta} onChange={handleInputChange} placeholder="ETA (e.g. Oct 24, 2024)" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <input name="progress" type="number" min="0" max="100" value={formData.progress} onChange={handleInputChange} placeholder="Progress % (0-100)" required className="border-2 border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3 outline-none focus:border-[#D4AF37] text-sm md:text-base w-full" />
                <button type="submit" className="sm:col-span-2 bg-[#D4AF37] hover:bg-[#FBBF24] text-white font-bold py-3 md:py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 mt-2 text-sm md:text-base w-full">
                  {editingId ? 'Update Record' : 'Add Record'}
                </button>
              </form>
            </div>

            {/* List - Card layout for mobile first */}
            <div>
              <h2 className="font-outfit font-bold text-lg md:text-xl text-[#0d1629] mb-4 px-2">Active Shipments</h2>
              {tracking.length === 0 ? (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
                  No active shipments.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tracking.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 flex flex-col gap-3 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-[#3B4B96] text-lg">{t.trackingNumber}</div>
                          <div className="text-sm text-gray-700 font-semibold">{t.status}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(t)} className="text-[#D4AF37] hover:text-[#B8860B] font-semibold text-sm bg-orange-50 px-3 py-1.5 rounded-lg">Edit</button>
                          <button onClick={() => deleteTracking(t.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm bg-red-50 px-3 py-1.5 rounded-lg">Delete</button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700">Route:</span>
                          <span>{t.origin} → {t.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">ETA:</span>
                          <span>{t.eta}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4AF37]" style={{width: `${t.progress}%`}}/>
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8">{t.progress}%</span>
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
  );
}
