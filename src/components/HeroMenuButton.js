'use client';

export default function HeroMenuButton() {
  return (
    <button 
      className="hero-menu-btn" 
      onClick={() => window.dispatchEvent(new CustomEvent('toggle-menu'))}
      aria-label="Open Menu"
    >
      <span></span><span></span><span></span>
    </button>
  );
}
