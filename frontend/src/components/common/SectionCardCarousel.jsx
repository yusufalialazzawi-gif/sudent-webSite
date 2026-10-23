import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SectionCardCarousel({
  items = [],
  renderItem,
  desktopItems = 4,
  tabletItems = 2,
  mobileItems = 1,
  autoplay = true,
  interval = 3000,
  showControls = true,
  showDots = true,
  className = '',
}) {
  const { isRtl } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems, setVisibleItems] = useState(desktopItems);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const containerRef = useRef(null);

  // Update visible items based on screen breakpoint
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(mobileItems);
      } else if (width < 1024) {
        setVisibleItems(tabletItems);
      } else if (width < 1280) {
        setVisibleItems(Math.min(desktopItems, 3));
      } else {
        setVisibleItems(desktopItems);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopItems, tabletItems, mobileItems]);

  const total = Array.isArray(items) ? items.length : 0;
  const maxIndex = Math.max(0, total - visibleItems);

  // Viewport detection: Starts 0.5s after user views the carousel, with guaranteed fallback
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let viewTimer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (viewTimer) clearTimeout(viewTimer);
          viewTimer = setTimeout(() => {
            setIsInView(true);
          }, 500);
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(el);

    // Guaranteed fallback after 1.2s
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 1200);

    return () => {
      observer.disconnect();
      if (viewTimer) clearTimeout(viewTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Next Slide
  const nextSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex, total, visibleItems]);

  // Previous Slide
  const prevSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex, total, visibleItems]);

  // "Video gibi olmasın, kullanıcı yanından geçtiğinde hareket etsin"
  const hasInitialMoved = useRef(false);
  const lastHoverTime = useRef(0);

  useEffect(() => {
    if (!isInView || hasInitialMoved.current || total <= visibleItems) {
      return;
    }
    const timer = setTimeout(() => {
      hasInitialMoved.current = true;
      nextSlide();
    }, 800);
    return () => clearTimeout(timer);
  }, [isInView, nextSlide, total, visibleItems]);

  const handleUserPassBy = () => {
    const now = Date.now();
    if (now - lastHoverTime.current > 1800) {
      lastHoverTime.current = now;
      nextSlide();
    }
  };

  // Touch swipe support
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRtl) {
      if (isLeftSwipe) prevSlide();
      if (isRightSwipe) nextSlide();
    } else {
      if (isLeftSwipe) nextSlide();
      if (isRightSwipe) prevSlide();
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const stepPercentage = 100 / visibleItems;
  const transformStyle = {
    transform: isRtl
      ? `translateX(${currentIndex * stepPercentage}%)`
      : `translateX(-${currentIndex * stepPercentage}%)`,
    transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={handleUserPassBy}
      onMouseMove={handleUserPassBy}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      {/* Navigation Controls Bar */}
      {showControls && total > visibleItems && (
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title={isPaused ? 'Devam Et' : 'Durdur'}
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-700" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={prevSlide}
            disabled={total <= visibleItems}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 text-slate-700 flex items-center justify-center transition-all disabled:opacity-30"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 flip-in-rtl" />
          </button>

          <button
            onClick={nextSlide}
            disabled={total <= visibleItems}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 text-slate-700 flex items-center justify-center transition-all disabled:opacity-30"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 flip-in-rtl" />
          </button>
        </div>
      )}

      {/* Sliding Viewport */}
      <div className="overflow-hidden rounded-3xl p-1 -m-1">
        <div className="flex will-change-transform" style={transformStyle}>
          {items.map((item, idx) => (
            <div
              key={item.id || item.slug || idx}
              className="shrink-0 px-3 transition-opacity duration-300"
              style={{ width: `${stepPercentage}%` }}
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {showDots && maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          {Array.from({ length: Math.min(10, maxIndex + 1) }).map((_, dotIdx) => {
            const isActive =
              currentIndex === dotIdx ||
              (dotIdx === 9 && currentIndex >= 9);

            return (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-6 bg-brand-amber-500 shadow-sm shadow-brand-amber-500/50'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
