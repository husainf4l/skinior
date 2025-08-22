'use client';

import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  target?: string; // CSS selector for the content element
  className?: string;
  showPercentage?: boolean;
}

export default function ReadingProgress({ 
  target = 'article', 
  className = '',
  showPercentage = false 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Element is above the viewport
      if (elementTop > windowHeight) {
        setProgress(0);
        setIsVisible(false);
        return;
      }

      // Element is below the viewport
      if (elementTop + elementHeight < 0) {
        setProgress(100);
        setIsVisible(true);
        return;
      }

      // Element is in the viewport
      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = Math.max(1, elementHeight - windowHeight);
      const progressPercentage = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));

      setProgress(progressPercentage);
      setIsVisible(progressPercentage > 0);
    };

    // Calculate initial progress
    calculateProgress();

    // Listen for scroll events
    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [target]);

  return (
    <>
      {/* Top Progress Bar */}
      <div 
        className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 origin-left z-50 transition-transform duration-300 ${
          isVisible ? 'transform scale-x-100' : 'transform scale-x-0'
        } ${className}`}
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      {/* Side Progress Indicator (for larger screens) */}
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 hidden lg:block z-40 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="relative">
          {/* Background */}
          <div className="w-1 h-32 bg-gray-200 rounded-full"></div>
          
          {/* Progress */}
          <div 
            className="absolute top-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ height: `${(progress / 100) * 128}px` }}
          />
          
          {/* Percentage indicator */}
          {showPercentage && (
            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded shadow-lg border">
              {Math.round(progress)}%
            </div>
          )}
        </div>
      </div>

      {/* Floating Progress Circle (mobile) */}
      <div className={`fixed bottom-4 right-4 lg:hidden z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}>
        <div className="relative w-12 h-12">
          {/* Background circle */}
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              className="transition-all duration-300"
            />
          </svg>
          
          {/* Gradient definition */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for reading progress
export function useReadingProgress(target = 'article') {
  const [progress, setProgress] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(0); // words per minute

  useEffect(() => {
    const startTime = Date.now();
    let lastProgress = 0;
    let wordsRead = 0;

    const calculateReadingMetrics = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      if (elementTop > windowHeight || elementTop + elementHeight < 0) return;

      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = Math.max(1, elementHeight - windowHeight);
      const progressPercentage = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));

      setProgress(progressPercentage);

      // Calculate reading metrics
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000 / 60; // minutes
      setTimeOnPage(timeElapsed);

      // Estimate words read based on progress
      const textContent = targetElement.textContent || '';
      const totalWords = textContent.split(/\s+/).length;
      const currentWordsRead = Math.floor((progressPercentage / 100) * totalWords);
      
      if (currentWordsRead > lastProgress) {
        wordsRead = currentWordsRead;
        const wpm = timeElapsed > 0 ? wordsRead / timeElapsed : 0;
        setReadingSpeed(Math.round(wpm));
        lastProgress = currentWordsRead;
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateReadingMetrics);
    };

    calculateReadingMetrics();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [target]);

  return { progress, timeOnPage, readingSpeed };
}

// Reading stats component
interface ReadingStatsProps {
  target?: string;
  locale?: string;
}

export function ReadingStats({ target = 'article', locale = 'en' }: ReadingStatsProps) {
  const { progress, timeOnPage, readingSpeed } = useReadingProgress(target);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(progress > 10 && timeOnPage > 0.5); // Show after 30 seconds and 10% progress
  }, [progress, timeOnPage]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white text-gray-700 text-xs px-3 py-2 rounded-lg shadow-lg border max-w-xs hidden lg:block">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>{locale === 'ar' ? 'التقدم:' : 'Progress:'}</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-between">
          <span>{locale === 'ar' ? 'الوقت:' : 'Time:'}</span>
          <span className="font-medium">{Math.round(timeOnPage)}m</span>
        </div>
        {readingSpeed > 0 && (
          <div className="flex justify-between">
            <span>{locale === 'ar' ? 'السرعة:' : 'Speed:'}</span>
            <span className="font-medium">{readingSpeed} {locale === 'ar' ? 'ك/د' : 'wpm'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
