export default function CTABanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] to-[#1e3a8a]"/>
      <div className="absolute inset-0 opacity-15"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}/>
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl"/>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="fade-in flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-3">
              Ready To Begin?
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Secureline Delivery is all about relationships. Connect with us by phone, text or email to start a conversation.
            </p>
          </div>
          <a href="#contact"
            className="flex-shrink-0 bg-[#D4AF37] hover:bg-[#FBBF24] text-[#0A192F] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:-translate-y-0.5 hover:shadow-2xl whitespace-nowrap">
            Send a Request →
          </a>
        </div>
      </div>
    </section>
  )
}
