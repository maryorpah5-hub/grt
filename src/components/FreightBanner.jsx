import seaFreightBg from '../assets/images/shiponseaatnight.jpg';

export default function FreightBanner() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background - deep navy with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a]/90 via-[#0d1629]/80 to-[#1c2b4a]/70 z-10"/>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${seaFreightBg})` }}
      />
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10 z-10"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}/>
      {/* Orange glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D4AF37]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10"/>
      {/* Teal glow */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#3B4B96]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 z-10"/>

      <div className="relative max-w-7xl mx-auto px-6 fade-in z-20">
        <div className="max-w-2xl">
          <span className="inline-block bg-[#D4AF37]/20 text-[#FBBF24] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            International Services
          </span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            International Freight<br/>Forwarding Services
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            We ensure your shipment travels expeditiously and at the lowest cost possible.
            Managing the import and export of goods across borders is what Secureline Delivery does best — every single day.
          </p>
          <a href="#contact"
            className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-[#D4AF37] text-white hover:bg-[#D4AF37] px-7 py-3.5 rounded-xl font-semibold transition-all duration-300">
            Find Out More
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
