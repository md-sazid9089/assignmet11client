import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxBackground = () => {
  const containerRef = useRef(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const circle3Ref = useRef(null);

  useEffect(() => {
    const circles = [
      { ref: circle1Ref, speed: 0.5 },
      { ref: circle2Ref, speed: 0.3 },
      { ref: circle3Ref, speed: 0.2 },
    ];

    circles.forEach(({ ref, speed }) => {
      if (ref.current) {
        gsap.to(ref.current, {
          y: () => window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      aria-hidden="true"
    >
      {/* Circle 1 - Top Right */}
      <div
        ref={circle1Ref}
        className="absolute -top-48 -right-48 w-96 h-96 bg-[#b35a44]/10 rounded-full blur-3xl"
      />

      {/* Circle 2 - Middle Left */}
      <div
        ref={circle2Ref}
        className="absolute top-1/3 -left-64 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"
      />

      {/* Circle 3 - Bottom Right */}
      <div
        ref={circle3Ref}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
    </div>
  );
};

export default ParallaxBackground;
