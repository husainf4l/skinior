"use client";

import { useEffect, useState } from "react";
import FloatingChatButton from "./chat/FloatingChatButton";

// Industry standard floating widget implementation
export default function FloatingLayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return;

    // Create the floating container using vanilla DOM manipulation
    // This is the same approach used by Intercom, Zendesk, etc.
    const createFloatingContainer = () => {
      // Remove any existing container first
      const existing = document.getElementById("skinior-floating-widget");
      if (existing) {
        existing.remove();
      }

      // Create a new container element
      const container = document.createElement("div");
      container.id = "skinior-floating-widget";

      // Apply styles directly as CSS text to prevent any override
      container.style.cssText = `
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        transform: translateZ(0) !important;
        transition: none !important;
        width: auto !important;
        height: auto !important;
        max-width: none !important;
        max-height: none !important;
        min-width: 0 !important;
        min-height: 0 !important;
        overflow: visible !important;
        clip: auto !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      `;

      // Append directly to body
      document.body.appendChild(container);

      return container;
    };

    const container = createFloatingContainer();
    setMounted(true);

    // Cleanup function - use element.remove() which is safe if the node is already detached
    return () => {
      const element = document.getElementById("skinior-floating-widget");
      if (element) {
        // Only remove if we created it (no-op if it's already detached)
        try {
          element.remove();
        } catch (e) {
          // Defensive fallback: if remove() is not supported, attempt a guarded removeChild
          if (element.parentNode && element.parentNode.contains(element)) {
            element.parentNode.removeChild(element);
          }
        }
      }
    };
  }, []);

  // Don't use React Portal - render directly into DOM
  useEffect(() => {
    if (!mounted) return;

    const container = document.getElementById("skinior-floating-widget");
    if (!container) return;

    // Import React and ReactDOM dynamically to render into the container
    import("react-dom/client").then(({ createRoot }) => {
      const root = createRoot(container);
      root.render(<FloatingChatButton />);

      return () => {
        root.unmount();
      };
    });
  }, [mounted]);

  // This component doesn't render anything in the React tree
  return null;
}
