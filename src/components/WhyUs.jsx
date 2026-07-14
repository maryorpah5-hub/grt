import bgImage from '../assets/images/cargos2.jpg'

export default function WhyUs() {
  const cards = [
    { emoji: '🛡️', title: 'Safe & Secure', grad: 'from-[#1c2b4a] to-[#253660]',
      desc: '100% all-round security with full insurance coverage on every shipment we handle.' },
    { emoji: '🎧', title: '24/7 Support', grad: 'from-[#D4AF37]/90 to-[#FBBF24]',
      desc: 'Round-the-clock human support across chat, email, phone and WhatsApp — always.' },
    { emoji: '💰', title: 'Competitive Rates', grad: 'from-[#1c2b4a] to-[#253660]',
      desc: 'Transparent pricing, zero hidden fees. Excellent service at the most affordable rates.' },
    { emoji: '⚡', title: 'Express Delivery', grad: 'from-[#D4AF37]/90 to-[#FBBF24]',
      desc: 'From same-day to 48-hour international — we move fast when it matters most.' },
    { emoji: '🌱', title: 'Eco-Friendly', grad: 'from-[#1c2b4a] to-[#253660]',
      desc: 'Carbon-neutral shipping options with our green logistics fleet and offset partnerships.' },
    { emoji: '📱', title: 'Smart Technology', grad: 'from-[#D4AF37]/90 to-[#FBBF24]',
      desc: 'AI-powered routing, real-time dashboards and mobile-first tracking for your team.' },
  ]

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/90"/>
      
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16 fade-in">
          <span className="inline-block bg-[#1c2b4a]/10 text-[#1c2b4a] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Our Promise
          </span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-[#0d1629] mb-4">
            Why Choose Secureline?
          </h2>
          <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
            Built on the principles of reliability, transparency and customer-first service since 2001.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title}
              className={`fade-in group relative rounded-2xl bg-gradient-to-br ${c.grad} p-7 overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300`}>
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}/>
              <div className="relative">
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{c.emoji}</div>
                <h3 className="font-outfit text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
