/* eslint-disable indent */
'use client';

import { useState, useEffect, useCallback } from 'react';
import ColorThief from 'colorthief';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import { backgrounds, quotes } from '@/data/quotes';

import 'swiper/css';
import 'swiper/css/effect-creative';

const initialQuoteIndex = 0;

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [indexes, setIndexes] = useState([initialQuoteIndex]);

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

  const getSlide = () => {
    if (!swiperInstance) return;

    const newIndex = indexes[indexes.length - 1] + 1;
    const quoteIndex = newIndex > backgrounds.length ? 0 : newIndex;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = quotes[quoteIndex].image;

    img.onload = () => {
      setIndexes((prev) => [
        ...prev,
        quoteIndex,
      ]);
      calculateBrightness(img);

      setTimeout(() => {
        swiperInstance.slideNext();
      }, 50);
    };
  };

  const changeLanguage = useCallback(() => {
    const newLanguage = language === 'ua' ? 'en' : 'ua';

    setLanguage(newLanguage);
  }, [language]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = quotes[initialQuoteIndex].image;
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
        {indexes.map((curIndex, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className='relative w-full h-full bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: `url(${quotes[curIndex].image})` }}
              >
                <div className='absolute top-12 left-8 max-w-2xl'>
                  <p className='
                    text-1xl        /* Базовый размер для мобильных */
                    sm:text-3xl     /* Для экранов от 640px */
                    md:text-4xl     /* Для экранов от 768px */
                    lg:text-5xl     /* Для экранов от 1024px */
                    xl:text-6xl     /* Для экранов от 1280px */
                    2xl:text-7xl    /* Для экранов от 1536px */
                    text-left 
                    font-bold 
                    italic 
                    text-white 
                    drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] 
                    leading-relaxed
                    max-w-[90vw]    /* Ограничение ширины текста */
                    break-words     /* Перенос длинных слов */
                  '>
                    {quotes[curIndex][language]}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        onClick={getSlide}
        className='absolute inset-0 cursor-pointer z-10'
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeLanguage();
          }}
          className={`
            z-11 
            absolute 
            top-2 sm:top-3 md:top-4     /* Адаптивный отступ сверху */
            right-2 sm:right-3 md:right-4  /* Адаптивный отступ справа */
            w-10 sm:w-12 md:w-14 lg:w-16   /* Адаптивная ширина */
            h-10 sm:h-12 md:h-14 lg:h-16   /* Адаптивная высота */
            text-sm sm:text-base md:text-lg lg:text-xl  /* Адаптивный размер текста */
            rounded-full 
            backdrop-blur-sm 
            transition-all 
            duration-300 
            flex 
            items-center 
            justify-center 
            font-bold
            ${isDarkBg
              ? 'bg-white/20 hover:bg-white/30 text-black'
              : 'bg-black/20 hover:bg-black/30 text-white'
            }
          `}
        >
          {language === 'ua' ? 'UA' : 'EN'}
        </button>
      </div>
    </div>
  );
}
