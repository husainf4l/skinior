"use client";

import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ChatInterface from "./ChatInterface";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Floating Chat Button (fixed to viewport) */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "50%",
          padding: "16px",
          border: "none",
          cursor: "pointer",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          zIndex: 2147483647,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1d4ed8";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2563eb";
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <XMarkIcon style={{ width: "24px", height: "24px" }} />
        ) : (
          <ChatBubbleLeftRightIcon style={{ width: "24px", height: "24px" }} />
        )}
      </button>

      {/* Chat Interface */}
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
          <ChatInterface onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
