// src/components/InteractiveCard.jsx
// Reusable card with hover effects using CSS instead of JS event handlers

import { useState } from 'react';

export function HoverCard({ children, style, hoverStyle }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

export function HoverButton({ children, onClick, style, hoverStyle }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}
