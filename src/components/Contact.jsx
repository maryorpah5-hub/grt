import { useState } from 'react'
import bgImage from '../assets/images/cargos4.jpg'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setSent(true)
      setTimeout(() => setSent(false), 5000)
      setForm({ name: '', phone: '', email: '', service: '', message: '' })
    } catch (error) {
      console.error('Failed to send message', error)
    }
  }

  const inputCls = 'w-full border-2 border-gray-200 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-[#0d1629] outline-none transition-colors text-sm bg-white'

  return (
    <section id="contact" className="relative py-24 bg-[#0d1629] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#0d1629]/90"/>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* Form */}
          <div className="lg:col-span-3 fade-in">
            <span className="inline-block bg-[#D4AF37]/20 text-[#FBBF24] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Get In Touch
            </span>
            <h2 className="font-outfit text-4xl font-bold text-white mb-8">Request A Callback</h2>

            {sent && (
              <div className="bg-[#3B4B96]/20 border border-[#3B4B96]/40 text-[#3B4B96] rounded-xl px-5 py-4 mb-6 font-medium">
                ✅ Thank you! We'll reach out to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    placeholder="e.g. John Doe" className={inputCls} />
                </div>
                <div>
                  <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="+1 300 400 5000" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="john@company.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Service Needed</label>
                <select name="service" value={form.service} onChange={handleChange} className={inputCls}>
                  <option value="">Select a service...</option>
                  {['Ocean Freight','Air Freight','Road & Last-Mile','Parcel & Document','Warehousing','Customs Clearance'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  placeholder="Tell us about your logistics needs..." className={inputCls}/>
              </div>
              <button type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#FBBF24] text-white py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5">
                Send Request
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 fade-in flex flex-col gap-10">
            <div>
              <h3 className="font-outfit font-bold text-white text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {[['Home','#home'],['About Us','#about'],['Services','#services'],['Track Shipment','#track'],['Contact','#contact']].map(([l,h]) => (
                  <li key={l}>
                    <a href={h} className="text-white/60 hover:text-[#3B4B96] transition-colors text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"/>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-white text-lg mb-4">Our Services</h3>
              <ul className="space-y-2.5">
                {['Ocean Freight','Air Freight','Road & Last-Mile','Warehousing','Customs Clearance'].map(s => (
                  <li key={s}>
                    <a href="#services" className="text-white/60 hover:text-[#3B4B96] transition-colors text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#3B4B96] rounded-full"/>
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-white text-lg mb-4">Contact Info</h3>
              <ul className="space-y-3">
                {[
                  ['📍','1140 6th Ave, New York, NY 10036, USA'],
                  ['📞','+1 300 400 5000'],
                  ['✉️','hello@securelinedelivery.com'],
                  ['🕐','Mon–Fri, 8am – 8pm'],
                ].map(([icon, text]) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <span className="text-white/60 text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
