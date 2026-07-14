import { useEffect, useRef } from 'react';
import img1 from '../assets/images/cargoonarrrival.jpg';
import img2 from '../assets/images/cargos1.jpg';
import img3 from '../assets/images/cargos2.jpg';
import img4 from '../assets/images/cargos3.jpg';
import img5 from '../assets/images/cargos4.jpg';
import img6 from '../assets/images/dhlflight.jpg';
import img7 from '../assets/images/flight2.jpg';
import img8 from '../assets/images/flight3.jpg';
import img9 from '../assets/images/seafreight.jpg';
import img10 from '../assets/images/shipcargoonsea.jpg';
import img11 from '../assets/images/shipcarryingloadonsea.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

export default function ImageCarousel() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 1;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="font-outfit text-3xl md:text-4xl font-bold text-[#0d1629] text-center">
          Our Global Operations
        </h2>
        <p className="text-center text-gray-500 mt-3">A glimpse into our daily logistics and freight processes.</p>
      </div>
      
      <div className="relative w-full">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden whitespace-nowrap"
          style={{ width: '100vw', paddingLeft: '24px', paddingRight: '24px' }}
        >
          {/* Double the images for infinite scroll effect */}
          {[...images, ...images].map((src, index) => (
            <div 
              key={index} 
              className="inline-block w-[300px] md:w-[400px] h-[250px] md:h-[300px] shrink-0 rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src={src} 
                alt={`Operation visual ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
