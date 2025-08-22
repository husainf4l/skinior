"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  contentSelector?: string;
  headingSelector?: string;
  className?: string;
  locale?: string;
  showProgress?: boolean;
  autoHide?: boolean;
}

export default function TableOfContents({
  contentSelector = "article",
  headingSelector = "h1, h2, h3, h4, h5, h6",
  className = "",
  locale = "en",
  showProgress = true,
  autoHide = false,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(!autoHide);
  const [readingProgress, setReadingProgress] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const generateTOC = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll(
        headingSelector
      ) as NodeListOf<HTMLElement>;
      const items: TOCItem[] = [];

      headings.forEach((heading, index) => {
        // Generate unique ID if heading doesn't have one
        if (!heading.id) {
          const text = heading.textContent || "";
          heading.id = `heading-${index}-${text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;
        }

        // Get heading level (h1 = 1, h2 = 2, etc.)
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";

        items.push({
          id: heading.id,
          text: text.trim(),
          level,
          element: heading,
        });
      });

      setTocItems(items);
    };

    // Generate TOC after content loads
    generateTOC();

    // Regenerate if content changes
    const observer = new MutationObserver(generateTOC);
    const contentElement = document.querySelector(contentSelector);

    if (contentElement) {
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [contentSelector, headingSelector]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX
      let currentActiveId = "";

      // Find the currently active heading
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const rect = item.element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;

        if (scrollPosition >= elementTop) {
          currentActiveId = item.id;
          break;
        }
      }

      // Update reading progress using functional update
      setReadingProgress((prevProgress) => {
        const newProgress = { ...prevProgress };

        tocItems.forEach((item) => {
          const rect = item.element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (
            scrollPosition >= elementTop &&
            scrollPosition <= elementBottom + 200
          ) {
            newProgress[item.id] = true;
          }
        });

        return newProgress;
      });

      setActiveId(currentActiveId);

      // Auto-hide logic
      if (autoHide) {
        const shouldShow =
          window.scrollY > 300 &&
          tocItems.some(
            (item) => item.element.getBoundingClientRect().bottom > 0
          );
        setIsVisible(shouldShow);
      }
    };

    handleScroll(); // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems, autoHide]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed headers
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getIndentClass = (level: number) => {
    const baseLevel = Math.min(...tocItems.map((item) => item.level));
    const relativeLevel = level - baseLevel;

    switch (relativeLevel) {
      case 0:
        return "pl-0";
      case 1:
        return "pl-4";
      case 2:
        return "pl-8";
      case 3:
        return "pl-12";
      case 4:
        return "pl-16";
      default:
        return "pl-20";
    }
  };

  const getTextSize = (level: number) => {
    switch (level) {
      case 1:
        return "text-base font-semibold";
      case 2:
        return "text-sm font-medium";
      case 3:
        return "text-sm";
      case 4:
        return "text-xs";
      default:
        return "text-xs";
    }
  };

  if (tocItems.length === 0 || !isVisible) return null;

  return (
    <div
      className={`fixed right-8 top-1/2 transform -translate-y-1/2 w-64 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-40 hidden xl:block ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {locale === "ar" ? "جدول المحتويات" : "Table of Contents"}
          </h3>
          {showProgress && (
            <span className="text-xs text-gray-500">
              {Object.keys(readingProgress).length}/{tocItems.length}
            </span>
          )}
        </div>
        {showProgress && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(readingProgress).length / tocItems.length) * 100
                }%`,
              }}
            />
          </div>
        )}
      </div>

      {/* TOC Items */}
      <div className="max-h-96 overflow-y-auto py-2">
        <nav>
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            const isRead = readingProgress[item.id];

            return (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  w-full text-left px-4 py-2 transition-all duration-200 hover:bg-gray-50 flex items-start gap-2
                  ${getIndentClass(item.level)}
                  ${isActive ? "bg-blue-50 border-r-2 border-blue-600" : ""}
                `}
              >
                {/* Progress indicator */}
                <div className="flex-shrink-0 mt-1.5">
                  {isRead ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : isActive ? (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  )}
                </div>

                {/* Heading text */}
                <span
                  className={`
                  ${getTextSize(item.level)}
                  ${isActive ? "text-blue-700" : "text-gray-700"}
                  ${isRead ? "opacity-75" : ""}
                  line-clamp-2 leading-tight
                `}
                >
                  {item.text}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer with collapse button */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => setIsVisible(false)}
          className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {locale === "ar" ? "إخفاء" : "Hide"}
        </button>
      </div>
    </div>
  );
}

// Floating TOC Button (for when TOC is hidden)
interface FloatingTOCButtonProps {
  isVisible: boolean;
  onClick: () => void;
  locale?: string;
}

export function FloatingTOCButton({
  isVisible,
  onClick,
  locale = "en",
}: FloatingTOCButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed right-8 bottom-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-300 z-40 xl:hidden"
      title={locale === "ar" ? "جدول المحتويات" : "Table of Contents"}
    >
      <svg
        className="w-6 h-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    </button>
  );
}

// Mobile TOC Modal
interface MobileTOCProps {
  isOpen: boolean;
  onClose: () => void;
  tocItems: TOCItem[];
  activeId: string;
  locale?: string;
  onItemClick: (id: string) => void;
}

export function MobileTOC({
  isOpen,
  onClose,
  tocItems,
  activeId,
  locale = "en",
  onItemClick,
}: MobileTOCProps) {
  if (!isOpen) return null;

  const getIndentClass = (level: number) => {
    const baseLevel = Math.min(...tocItems.map((item) => item.level));
    const relativeLevel = level - baseLevel;
    return `pl-${relativeLevel * 4}`;
  };

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {locale === "ar" ? "جدول المحتويات" : "Table of Contents"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* TOC Items */}
        <div className="overflow-y-auto p-6">
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  onClose();
                }}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${getIndentClass(item.level)}
                  ${
                    activeId === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }
                `}
              >
                <span className="text-sm leading-tight">{item.text}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Hook for TOC functionality
export function useTableOfContents(
  contentSelector = "article",
  headingSelector = "h1, h2, h3, h4, h5, h6"
) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId] = useState<string>("");

  useEffect(() => {
    const generateTOC = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll(
        headingSelector
      ) as NodeListOf<HTMLElement>;
      const items: TOCItem[] = [];

      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || "";
          heading.id = `heading-${index}-${text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;
        }

        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";

        items.push({
          id: heading.id,
          text: text.trim(),
          level,
          element: heading,
        });
      });

      setTocItems(items);
    };

    generateTOC();

    const observer = new MutationObserver(generateTOC);
    const contentElement = document.querySelector(contentSelector);

    if (contentElement) {
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [contentSelector, headingSelector]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return { tocItems, activeId, scrollToHeading };
}
