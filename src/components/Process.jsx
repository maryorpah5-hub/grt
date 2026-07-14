import bgImage from '../assets/images/flight1.jpg'

export default function Process() {
  const steps = [
    { num: '01', emoji: '📞', title: 'Connect', desc: 'Reach out to discuss your needs — storing, shipping or scaling your supply chain.' },
    { num: '02', emoji: '📋', title: 'Review', desc: 'Our experts review your shipment details, route options and delivery requirements.' },
    { num: '03', emoji: '📊', title: 'Plan', desc: 'Receive a customized, all-inclusive pricing proposal tailored to your specs.' },
    { num: '04', emoji: '📈', title: 'Grow', desc: 'Expand your reach with a trusted partner that maximizes returns and minimizes cost.' },
  ]

  return (
    <section className="relative py-24 bg-[#f7f9fc] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#f7f9fc]/90"/>
      
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-16 fade-in">
          <span className="inline-block bg-[#D4AF37]/20 text-[#B8860B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-[#0d1629] mb-4">
            Ship With Confidence In 4 Steps
          </h2>
          <p className="text-[#6b7280] text-lg max-w-xl mx-auto">
            We've simplified international logistics into a clear, transparent process designed around you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((s, i) => (
            <div key={s.num} className="fade-in relative">
              <div className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-outfit text-5xl font-black text-[#f0f4f8] select-none">{s.num}</span>
                  <span className="text-3xl">{s.emoji}</span>
                </div>
                <h3 className="font-outfit text-xl font-bold text-[#0d1629] mb-2">{s.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{s.desc}</p>
              </div>
              {/* Arrow connector (desktop only) */}
              {i < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-8 h-8 bg-[#D4AF37] rounded-full items-center justify-center text-[#0A192F] text-sm font-bold shadow-md shadow-yellow-500/30">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center fade-in">
          <a href="#contact"
            className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#112A4F] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl shadow-blue-900/20 hover:-translate-y-0.5">
            Book In Less Than 60 Seconds
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
