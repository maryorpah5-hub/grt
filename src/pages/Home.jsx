import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import ImageCarousel from '../components/ImageCarousel'
import FreightBanner from '../components/FreightBanner'
import Process from '../components/Process'
import TrackSection from '../components/TrackSection'
import WhyUs from '../components/WhyUs'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import CTABanner from '../components/CTABanner'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-inter">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <ImageCarousel />
      <FreightBanner />
      <Process />
      <TrackSection />
      <WhyUs />
      <Stats />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  )
}
