'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FloatingChatButton from './chat/FloatingChatButton';

export default function FloatingLayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Create a portal that renders directly to document.body
  // This ensures it's completely outside the normal document flow
  return createPortal(
    <div
      id="floating-ui-layer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      <FloatingChatButton />
    </div>,
    document.body
  );
}
