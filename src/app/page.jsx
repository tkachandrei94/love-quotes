/* eslint-disable indent */
'use client';

import { useState, useEffect, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import { quotes, backgrounds } from '@/data/quotes';
import { getRandomItem, getRandomItemIndex } from '@/utils/random';

import 'swiper/css';
import 'swiper/css/effect-creative';

const initialBg = getRandomItem(backgrounds);
const initialQuoteIndex = getRandomItemIndex(quotes);

export default function Home() {
  const [slides, setSlides] = useState([{ bg: '', quoteIndex: 0 }]);
  const [language, setLanguage] = useState('en');
  const [isDarkBg, setIsDarkBg] = useState(true);
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

  const getRandomQuote = () => {
    if (!swiperInstance) return;

    const randomQuoteIndex = getRandomItemIndex(quotes);
    const newBg = getRandomItem(backgrounds);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = newBg;

    img.onload = () => {
      setSlides((prev) => [
        ...prev,
        { bg: newBg, quoteIndex: randomQuoteIndex },
      ]);
      calculateBrightness(img);

      setTimeout(() => {
        swiperInstance.slideNext();
      }, 50);
    };
  };

  const changeLanguage = useCallback(() => {
    const newLanguage = language === 'ua' ? 'en' : 'ua';
    console.log('newLanguage: ', newLanguage);

    setLanguage(newLanguage);
  }, [language]);

  useEffect(() => {
    setSlides([{ bg: initialBg, quoteIndex: initialQuoteIndex }]);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = initialBg;
    img.onload = () => {
      calculateBrightness(img);
    };
  }, [calculateBrightness]);

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <Swiper
        modules={[EffectCreative]}
        effect={'creative'}
        speed={1500}
        creativeEffect={{
          prev: {
            translate: ['-100%', 0, 0],
            duration: 1500,
          },
          next: {
            translate: ['100%', 0, 0],
            duration: 1500,
          },
        }}
        allowTouchMove={false}
        onSwiper={setSwiperInstance}
        className='w-full h-full'
      >
        {slides.map((slide, index) => {
          // console.log('quotes: ', quotes);
          // console.log('slide: ', slide);
          // console.log('language: ', language);
          return (
            <SwiperSlide key={index}>
              <div
                className='relative w-full h-full bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                <div className='absolute top-12 left-12 max-w-2xl'>
                  <p className='text-7xl text-left font-bold italic text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-relaxed'>
                    {quotes[slide.quoteIndex][language]}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        onClick={getRandomQuote}
        className='absolute inset-0 cursor-pointer z-10'
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeLanguage();
          }}
          className={`z-11 absolute top-4 right-4 w-16 h-16 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center font-bold
            ${
              isDarkBg
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-black/20 hover:bg-black/30 text-black'
            }`}
        >
          {language === 'ua' ? 'UA' : 'EN'}
        </button>
      </div>
    </div>
  );
}
