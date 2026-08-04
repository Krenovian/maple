import re

with open('src/app/home.css', 'r') as f:
    css = f.read()

# Replace the old dm-hero-head and dm-hero-foot
old_hero_head = """/* Hero headline */
.dm-hero-head {
  padding-bottom: clamp(1rem, 3vw, 2.5rem);
}
.dm-hero-title {
  font-size: clamp(2.4rem, 8.6vw, 9rem);
  line-height: 0.84;
  letter-spacing: -0.045em;
}
.dm-hero-title .dm-mask {
  padding-bottom: 0.04em;
  margin-bottom: -0.04em;
}

.dm-hero-foot {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 2rem;
  border-top: 1px solid var(--line-inv);
  padding-top: clamp(1rem, 1.8vw, 1.6rem);
}
.dm-hero-lede {
  max-width: 36ch;
  font-size: clamp(0.85rem, 1vw, 0.98rem);
  line-height: 1.6;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.74);
}
.dm-hero-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}
.dm-hero-scroll i {
  display: block;
  width: 1px;
  height: 54px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), transparent);
  position: relative;
  overflow: hidden;
}
.dm-hero-scroll i::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 18px;
  background: var(--accent);
  animation: dm-scrolldot 2.2s var(--ease) infinite;
}
@keyframes dm-scrolldot {
  0% { transform: translateY(-20px); }
  100% { transform: translateY(58px); }
}
.dm-hero-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  text-align: right;
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.dm-hero-meta strong {
  font-weight: 500;
  color: var(--text-main);
}

@media (max-width: 900px) {
  .dm-topbar-nav { display: none; }
  .dm-topbar-cta { display: none; }
  .dm-hero-foot { grid-template-columns: 1fr; gap: 1.25rem; }
  .dm-hero-scroll { display: none; }
  .dm-hero-meta { align-items: flex-start; text-align: left; flex-direction: row; flex-wrap: wrap; gap: 1rem; }
}"""

new_hero_css = """/* Center typography for GenZ Aesthetic */
.dm-hero-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}
.dm-hero-title-massive {
  font-family: var(--display);
  font-size: clamp(4rem, 12vw, 13rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: var(--text-main);
  text-transform: uppercase;
  text-shadow: 0 10px 40px rgba(0,0,0,0.5);
  font-weight: 700;
}
.dm-hero-title-massive em {
  font-style: normal;
  color: var(--accent);
  background: -webkit-linear-gradient(45deg, var(--accent), #e0aaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Floating Glassmorphic Badges */
.dm-hero-badge {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  z-index: 15;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.dm-badge-left {
  bottom: 3rem;
  left: clamp(1.5rem, 5vw, 5rem);
  max-width: 320px;
}
.dm-badge-left p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--sans);
}

.dm-badge-right {
  bottom: 3rem;
  right: clamp(1.5rem, 5vw, 5rem);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.dm-badge-right span {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}
.dm-badge-right strong {
  color: var(--text-main);
  font-weight: 700;
}

@media (max-width: 900px) {
  .dm-topbar-nav { display: none; }
  .dm-topbar-cta { display: none; }
  .dm-badge-right { display: none; }
  .dm-badge-left { bottom: 2rem; left: 1.5rem; right: 1.5rem; max-width: none; }
  .dm-hero-title-massive { font-size: clamp(3.5rem, 14vw, 5rem); }
}"""

css = css.replace(old_hero_head, new_hero_css)

with open('src/app/home.css', 'w') as f:
    f.write(css)

print("CSS rewritten successfully!")
