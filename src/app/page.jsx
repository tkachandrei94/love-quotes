'use client';

import { useState, useEffect, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import { quotes, backgrounds } from '@/data/quotes';
import { getRandomItem } from '@/utils/random';

import 'swiper/css';
import 'swiper/css/effect-creative';

const initialBg = getRandomItem(backgrounds);
const initialQuote = getRandomItem(quotes['ua']);

export default function Home() {
  const [slides, setSlides] = useState([
    { bg: initialBg, quote: initialQuote },
  ]);
  const [language, setLanguage] = useState('en');
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const calculateBrightness = useCallback((img) => {
    const colorThief = new ColorThief();
    try {
      const color = colorThief.getColor(img);
      const brightness =
        (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
      setIsDarkBg(brightness < 128);
    } catch (error) {
      console.error('Error calculating brightness:', error);
    }
  }, []);

  const getRandomQuote = useCallback(() => {
    const randomQuote = getRandomItem(quotes[language]);
    const newBg = getRandomItem(backgrounds);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = newBg;
    img.onload = () => {
      setSlides((prev) => [...prev, { bg: newBg, quote: randomQuote }]);
      calculateBrightness(img);
      swiperInstance?.slideNext();
    };
  }, [language, calculateBrightness, swiperInstance]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = initialBg;
    img.onload = () => {
      calculateBrightness(img);
      setIsLoaded(true);
    };
  }, []);

  useEffect(() => {
    getRandomQuote();
  }, [language]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <Swiper
        modules={[EffectCreative]}
        effect={'creative'}
        speed={1500} // Скорость анимации в миллисекундах
        creativeEffect={{
          prev: {
            translate: ['-100%', 0, 0],
            duration: 1500, // Длительность эффекта
          },
          next: {
            translate: ['100%', 0, 0],
            duration: 1500, // Длительность эффекта
          },
        }}
        allowTouchMove={false}
        onSwiper={setSwiperInstance}
        className='w-full h-full'
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className='relative w-full h-full bg-cover bg-center bg-no-repeat'
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              <div className='absolute top-12 left-12 max-w-2xl'>
                <p className='text-6xl text-left font-bold italic text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-relaxed'>
                  {slide.quote}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        onClick={getRandomQuote}
        className='absolute inset-0 cursor-pointer z-10'
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLanguage(language === 'ua' ? 'en' : 'ua');
          }}
          className={`absolute top-4 right-4 w-16 h-16 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center font-bold
            ${
              isDarkBg
                ? 'bg-black/20 hover:bg-white/30 text-white'
                : 'bg-white/20 hover:bg-black/30 text-black'
            }`}
        >
          {language === 'ua' ? 'UA' : 'EN'}
        </button>
      </div>
    </div>
  );
}
