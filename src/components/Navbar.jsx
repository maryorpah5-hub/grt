import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Home', 'About', 'Services', 'Track Shipment', 'Contact']
  const hrefs = ['#home', '#about', '#services', '#track', '#contact']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <img src={logo} alt="Secureline Delivery Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="font-outfit text-[#3B4B96] text-2xl font-bold tracking-tight">
            Secureline<span className="text-[#D4AF37]">Delivery</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l, i) => (
            <li key={l}>
              <a href={hrefs[i]}
                className="text-[#3B4B96] hover:text-[#D4AF37] text-sm font-semibold transition-colors duration-200 relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-200 group-hover:w-full"/>
              </a>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="#contact"
            className="bg-[#D4AF37] hover:bg-[#FBBF24] text-white px-6 py-2.5 rounded-sm text-sm font-bold transition-all duration-200 shadow-md">
            Get a Quote
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          <span className={`w-6 h-0.5 bg-[#3B4B96] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`w-6 h-0.5 bg-[#3B4B96] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}/>
          <span className={`w-6 h-0.5 bg-[#3B4B96] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-4">
          {links.map((l, i) => (
            <a key={l} href={hrefs[i]}
              onClick={() => setMenuOpen(false)}
              className="text-[#3B4B96] hover:text-[#D4AF37] text-base font-semibold py-2 border-b border-gray-50 transition-colors">
              {l}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}
            className="bg-[#D4AF37] text-white text-center py-3 rounded-sm font-bold mt-2">
            Get a Quote
          </a>
        </div>
      </div>
    </nav>
  )
}
