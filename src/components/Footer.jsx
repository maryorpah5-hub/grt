import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-[#060d1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Secureline Logo" className="w-8 h-8 object-contain opacity-90" />
          <span className="font-outfit text-white font-semibold">
            Secureline<span className="text-[#D4AF37]">Delivery</span>
          </span>
        </div>
        <span className="text-white/40 text-sm">© 2024 Secureline Delivery. All rights reserved.</span>
        <div className="flex items-center gap-3">
          {['in','𝕏','f','ig'].map(s => (
            <a key={s} href="#"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#D4AF37] text-white/50 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-200">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
