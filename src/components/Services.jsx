import bgImage from '../assets/images/shipcargoonsea.jpg'

export default function Services() {
  const services = [
    { emoji: '🚢', title: 'Ocean Freight', color: 'from-[#1c2b4a] to-[#253660]', accent: '#3B4B96',
      desc: 'Cost-effective FCL & LCL ocean shipping across global lanes with real-time container tracking.' },
    { emoji: '✈️', title: 'Air Freight', color: 'from-[#D4AF37]/20 to-[#D4AF37]/5', accent: '#D4AF37',
      desc: 'Priority air cargo for time-sensitive shipments. Fast clearance, secure handling, global reach.' },
    { emoji: '🚛', title: 'Road & Last-Mile', color: 'from-[#1c2b4a] to-[#253660]', accent: '#3B4B96',
      desc: 'Door-to-door delivery with barcode scanning, real-time alerts and proof-of-delivery confirmation.' },
    { emoji: '📦', title: 'Parcel & Document', color: 'from-[#D4AF37]/20 to-[#D4AF37]/5', accent: '#D4AF37',
      desc: 'Same-day and next-day parcel delivery with full chain-of-custody and digital signature capture.' },
    { emoji: '🏭', title: 'Warehousing', color: 'from-[#1c2b4a] to-[#253660]', accent: '#3B4B96',
      desc: 'Strategic warehousing, inventory management and fulfillment across our global network.' },
    { emoji: '🌐', title: 'Customs Clearance', color: 'from-[#D4AF37]/20 to-[#D4AF37]/5', accent: '#D4AF37',
      desc: 'Streamlined import/export documentation, duty calculation and compliance worldwide.' },
  ]

  return (
    <section id="services" className="relative py-24 bg-[#f7f9fc] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#f7f9fc]/90"/>
      
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16 fade-in">
          <span className="inline-block bg-[#3B4B96]/10 text-[#2C3977] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-[#0d1629] mb-4">
            Complete Logistics Solutions
          </h2>
          <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
            From freight forwarding to last-mile delivery — every link in your supply chain, handled.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title}
              className="fade-in group bg-white rounded-2xl p-7 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-navy-800/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {s.emoji}
              </div>
              <h3 className="font-outfit text-xl font-bold text-[#0d1629] mb-2">{s.title}</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed mb-5">{s.desc}</p>
              <a href="#contact"
                style={{ color: s.accent }}
                className="text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                Learn more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
