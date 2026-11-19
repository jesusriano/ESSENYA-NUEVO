import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let pluginRegistered = false;

interface ScrollExpandImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 'contain' conserva logotipos y textos completos; 'cover' recorta. */
  fit?: 'contain' | 'cover';
  /** Color de fondo del marco (rellena los bordes con 'contain'). */
  background?: string;
  /** Punto de enfoque de la imagen cuando se recorta. */
  focalPosition?: string;
  /** Intensidad del parallax en porcentaje (escritorio). En móvil se reduce. */
  parallax?: number;
}

export function ScrollExpandImage({
  src,
  alt,
  width,
  height,
  fit = 'contain',
  background = '#F5F1EA',
  focalPosition = 'center',
  parallax = 6,
}: ScrollExpandImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!pluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    }

    const section = sectionRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!section || !frame || !image) return;

    const ctx = gsap.context(() => {
      gsap.matchMedia().add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduce } = context.conditions as { isDesktop: boolean; reduce: boolean };

          if (reduce) {
            gsap.set(frame, { width: '100%', borderRadius: 0 });
            return;
          }

          const startWidth = isDesktop ? '62%' : '88%';
          const startRadius = isDesktop ? 32 : 20;
          const shift = isDesktop ? parallax : Math.max(1, parallax / 3);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            frame,
            { width: startWidth, borderRadius: startRadius },
            { width: '100%', borderRadius: 0, ease: 'none' },
            0,
          ).fromTo(
            image,
            { yPercent: -shift },
            { yPercent: shift, ease: 'none' },
            0,
          );
        },
      );
    }, section);

    const refreshOnLoad = () => ScrollTrigger.refresh();
    image.addEventListener('load', refreshOnLoad);
    if (image.complete) ScrollTrigger.refresh();

    return () => {
      image.removeEventListener('load', refreshOnLoad);
      ctx.revert();
    };
  }, [parallax]);

  return (
    <section
      ref={sectionRef}
      aria-label={alt}
      className="relative h-[170vh] md:h-[190vh]"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
        <div
          ref={frameRef}
          className="relative max-h-[88vh] overflow-hidden"
          style={{ width: '62%', aspectRatio: `${width} / ${height}`, background, borderRadius: 32 }}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: fit, objectPosition: focalPosition, willChange: 'transform' }}
          />
        </div>
      </div>
    </section>
  );
}