import bgImage from '../assets/images/cargoonarrrival.jpg'

export default function Testimonials() {
  const reviews = [
    {
      quote: 'I use Secureline Delivery and I totally love their professional customer service. They are the best and I will recommend them — they never disappoint.',
      name: 'Joeby Ragpa', role: 'COO, Hyatt Global', initials: 'JR',
      color: 'from-[#D4AF37] to-[#FBBF24]',
    },
    {
      quote: 'The shipping process was a pleasurable experience. Their delivery was timely and swift. Their safety measures and customer service are absolutely top notch.',
      name: 'Alexandra Samokhin', role: 'CEO, Alexi Brands', initials: 'AS',
      color: 'from-[#1c2b4a] to-[#253660]',
    },
    {
      quote: 'Secureline transformed our supply chain. Real-time tracking and customs clearance support saved us weeks of stress and thousands in potential delay costs.',
      name: 'Marcus Kelechi', role: 'Head of Operations, TradeLink Co.', initials: 'MK',
      color: 'from-[#3B4B96] to-[#2C3977]',
    },
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
          <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Social Proof
          </span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold text-[#0d1629] mb-4">
            Satisfied Customers
          </h2>
          <p className="text-[#6b7280] text-lg max-w-xl mx-auto">
            Don't take our word for it — here's what our clients say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {reviews.map((r) => (
            <div key={r.name}
              className="fade-in bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Stars */}
              <div className="text-[#D4AF37] text-lg mb-4 tracking-wider">★★★★★</div>
              {/* Quote mark */}
              <div className="font-outfit text-6xl text-[#f0f4f8] leading-none -mt-2 mb-2 select-none">"</div>
              <p className="text-[#374151] leading-relaxed text-sm flex-1 -mt-6">{r.quote}</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <div className="font-outfit font-bold text-[#0d1629] text-sm">{r.name}</div>
                  <div className="text-[#D4AF37] text-xs font-semibold">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
