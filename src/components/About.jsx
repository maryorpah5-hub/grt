import { useEffect, useRef } from 'react'
import flightBg from '../assets/images/dhlflight.jpg'

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual side */}
          <div className="fade-in relative">
            {/* Main block */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c2b4a] to-[#060d1a] shadow-2xl">
              {/* Flight Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen"
                style={{ backgroundImage: `url(${flightBg})` }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/10 select-none">
                  <div className="text-8xl relative z-10 drop-shadow-2xl opacity-50">🌍</div>
                </div>
              </div>
              {/* Gradient lines decoration */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #3B4B96 0, #3B4B96 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a]/80 via-transparent to-transparent"/>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <p className="font-outfit text-2xl font-bold text-white mb-1">Global Presence</p>
                <p className="text-[#3B4B96] text-sm font-medium">205+ locations worldwide</p>
              </div>
            </div>

            {/* Accent block */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FBBF24] shadow-xl shadow-orange-500/30 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl font-outfit font-black">50K+</div>
                <div className="text-xs font-semibold mt-1 opacity-90">Professionals</div>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -top-5 -left-5 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-outfit font-bold text-[#0d1629] text-sm">Industry Leader</div>
                <div className="text-[#6b7280] text-xs">Serving since 2001</div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="fade-in">
            <span className="inline-block bg-[#3B4B96]/10 text-[#2C3977] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Who We Are
            </span>
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-[#0d1629] mb-6 leading-tight">
              We Take Care Of Your Entire Supply Chain
            </h2>
            <p className="text-[#374151] text-lg leading-relaxed mb-4 font-medium">
              Secureline Delivery is an international team of 50,000+ logistics professionals united by one mission —
              to move the world's goods safely, efficiently and sustainably.
            </p>
            <p className="text-[#6b7280] leading-relaxed mb-8">
              As global markets evolve and regulatory landscapes shift, our agents leverage decades of expertise
              to ensure your shipments clear borders and reach their destination on time, every time.
              We're your strategic partner in global freight, documentation and full compliance.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Packaging, Crating & Secure Storage',
                'Safety Compliance & Quality Assurance',
                'Sustainable & Carbon-Offset Shipping',
                'Global Partnerships & Trade Networks',
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                  <span className="text-[#374151] font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#contact"
                className="bg-[#D4AF37] hover:bg-[#FBBF24] text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5">
                Get In Touch
              </a>
              <a href="#services"
                className="text-[#1c2b4a] font-semibold hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                Our Services →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
