import { useState, useEffect } from 'react';

interface UseImageLoadingProps {
  src: string;
  hoverSrc?: string;
}

export const useImageLoading = ({ src, hoverSrc }: UseImageLoadingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHoverLoaded, setIsHoverLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = src;

    // Preload hover image
    if (hoverSrc) {
      const hoverImg = new Image();
      hoverImg.onload = () => setIsHoverLoaded(true);
      hoverImg.src = hoverSrc;
    }
  }, [src, hoverSrc]);

  return { isLoaded, isHoverLoaded, error };
};

// Generate blur data URL for better loading experience
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Optimize image URLs for different use cases
export const optimizeImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
} = {}) => {
  const { width, height } = options;
  
  // For placehold.co, we can add parameters
  if (url.includes('placehold.co')) {
    let optimizedUrl = url;
    
    if (width && height) {
      optimizedUrl = url.replace(/\/\d+x\d+/, `/${width}x${height}`);
    }
    
    return optimizedUrl;
  }
  
  // For other services, return as-is (Next.js will handle optimization)
  return url;
};

// Calculate optimal image sizes for responsive design
export const getOptimalImageSizes = () => {
  return {
    mobile: '(max-width: 640px) 50vw',
    tablet: '(max-width: 768px) 33vw',
    desktop: '(max-width: 1024px) 25vw',
    large: '20vw'
  };
};

export const getResponsiveSizes = (): string => {
  const sizes = getOptimalImageSizes();
  return `${sizes.mobile}, ${sizes.tablet}, ${sizes.desktop}, ${sizes.large}`;
};
