"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getResponsiveSizes } from "@/hooks/useImageOptimization";

interface OptimizedImageProps {
  src: string;
  alt: string;
  hoverSrc?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  width?: number;
  height?: number;
  fill?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const OptimizedImage = ({
  src,
  alt,
  hoverSrc,
  className = "",
  priority = false,
  quality = 85,
  width,
  height,
  fill = false,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTime = Date.now();

  const handleLoad = () => {
    const endTime = Date.now();
    setLoadTime(endTime - startTime);
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    const errorMsg = `Failed to load image: ${src}`;
    setError(errorMsg);
    onError?.(errorMsg);
  };

  // Log performance metrics in development
  useEffect(() => {
    if (loadTime && process.env.NODE_ENV === "development") {
      console.log(`Image loaded in ${loadTime}ms: ${src}`);
    }
  }, [loadTime, src]);

  const imageProps = {
    className: `transition-all duration-700 ease-out ${className} ${
      isLoaded ? "opacity-100" : "opacity-0"
    }`,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    sizes: getResponsiveSizes(),
    placeholder: "blur" as const,
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOpCsIoqKKKkKggUVoooOOhRRQII//2Q==",
    priority,
  };

  const containerProps = hoverSrc
    ? {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }
    : {};

  return (
    <div className="relative" {...containerProps}>
      {fill ? (
        <Image src={src} fill alt={alt} {...imageProps} />
      ) : (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          {...imageProps}
        />
      )}

      {/* Hover Image */}
      {hoverSrc && fill && (
        <Image
          src={hoverSrc}
          alt={`${alt} hover`}
          fill
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          quality={quality}
          sizes={getResponsiveSizes()}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOpCsIoqKKKkKggUVoooOOhRRQII//2Q=="
        />
      )}

      {/* Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm text-center p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Image failed to load
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
