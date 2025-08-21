"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ChatInterface from "./ChatInterface";

const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    // Reuse existing floating container if present (prevents duplicates)
    let container = document.getElementById(
      "skinior-floating-widget"
    ) as HTMLDivElement | null;

    if (!container) {
      container = document.createElement("div");
      container.id = "skinior-floating-widget";
      container.style.cssText = `
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      `;

      // Safely append to body
      try {
        document.body.appendChild(container);
      } catch (error) {
        console.warn("Failed to append floating chat container:", error);
        return;
      }
    }

    portalRef.current = container;
    setMounted(true);

    return () => {
      // Improved cleanup with better error handling
      if (typeof window === "undefined") return;

      try {
        const existing = document.getElementById("skinior-floating-widget");
        if (existing && existing === portalRef.current) {
          // Check if element is still in DOM before removing
          if (document.contains(existing)) {
            existing.remove();
          }
        }
      } catch (error) {
        // Silently handle cleanup errors during route transitions
        console.debug("Floating chat cleanup error (safe to ignore):", error);
      }

      portalRef.current = null;
    };
  }, []);

  if (!mounted || !portalRef.current) return null;

  return createPortal(
    <div
      style={{
        position: "relative",
        zIndex: 1,
        fontFamily: "inherit",
      }}
    >
      {/* Fixed Position Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          width: "56px",
          height: "56px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease-in-out",
          transform: "translateZ(0)",
          margin: "0",
          padding: "0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1d4ed8";
          e.currentTarget.style.transform = "translateZ(0) scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2563eb";
          e.currentTarget.style.transform = "translateZ(0) scale(1)";
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          // Close icon
          <svg
            style={{ width: "24px", height: "24px" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Chat icon
          <svg
            style={{ width: "24px", height: "24px" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.289l-4.421 1.289a.75.75 0 01-.949-.949l1.289-4.421A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
            />
          </svg>
        )}
      </button>

      {/* Floating Chat Interface */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 2147483647,
            pointerEvents: "auto",
          }}
        >
          <ChatInterface onClose={() => setIsOpen(false)} isFloating={true} />
        </div>
      )}
    </div>,
    portalRef.current
  );
};

export default FloatingChatWidget;
