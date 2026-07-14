import { useEffect, useRef, useState } from 'react'
import bgImage from '../assets/images/shipcarryingloadonsea.jpg'

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count >= 1000 ? count.toLocaleString() : count}
    </span>
  )
}



export default function Stats() {
  const stats = [
    { emoji: '📍', value: 205,    suffix: '+', label: 'Locations' },
    { emoji: '🌐', value: 121054, suffix: '',  label: 'Clients Worldwide' },
    { emoji: '🚛', value: 2213,   suffix: '',  label: 'Trucks' },
    { emoji: '👥', value: 50000,  suffix: '+', label: 'Workers' },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/90 via-[#B8860B]/80 to-[#0d1629]/90"/>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}/>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"/>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="fade-in text-center group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{s.emoji}</div>
              <div className="font-outfit text-4xl md:text-5xl font-black text-white mb-2">
                <CountUp target={s.value} />
                {s.suffix}
              </div>
              <div className="text-white/70 font-medium text-sm uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
