import re

with open('src/app/globals.css', 'r') as f:
    css = f.read()

# Replace the desktop overlay css block
start_marker = "/* Overlay Menu */"
end_marker = "/* Orizon Style Hero */"

new_desktop_css = """/* Overlay Menu */
.overlay-menu {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 9999;
  pointer-events: none;
}
.overlay-open {
  pointer-events: all;
}
.overlay-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 12, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.5s ease;
}
.overlay-open .overlay-backdrop {
  opacity: 1;
}
.overlay-panel {
  position: absolute;
  top: 0; right: 0;
  width: 40%;
  min-width: 400px;
  height: 100vh;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  padding: 6rem 4rem 4rem;
  transform: translateX(100%);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.overlay-open .overlay-panel {
  transform: translateX(0);
}
.overlay-close {
  position: absolute;
  top: 2.5rem;
  right: 3rem;
  font-size: 3rem;
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
  line-height: 1;
  transition: transform 0.3s;
}
.overlay-close:hover { transform: rotate(90deg); color: var(--accent, #8D554E); }
.overlay-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.overlay-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.overlay-links a {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4.5rem);
  color: #fff;
  text-transform: uppercase;
  opacity: 0.4;
  transition: all 0.4s ease;
  display: block;
  letter-spacing: -0.02em;
}
.overlay-links a:hover {
  opacity: 1;
  color: var(--accent, #8D554E);
  transform: translateX(20px);
}
.overlay-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 2.5rem;
  margin-top: 2rem;
}
.overlay-footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.overlay-footer-col span {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
}
.overlay-footer-col a {
  font-size: 0.95rem;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}
.overlay-footer-col a:hover {
  color: var(--accent, #8D554E);
}
.overlay-socials {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .overlay-panel {
    width: 100%;
    min-width: auto;
    padding: 5rem 2rem 3rem;
  }
}

"""

pattern = re.compile(re.escape(start_marker) + r".*?" + re.escape(end_marker), re.DOTALL)
css = pattern.sub(new_desktop_css + end_marker, css)

# Remove the mobile override for the old overlay menu
mobile_override_pattern = re.compile(r"/\* Convert full-screen overlay to side dropdown on mobile \*/.*?visibility: visible;\n  }", re.DOTALL)
css = mobile_override_pattern.sub("/* Mobile dropdown removed in favor of sliding glass panel */", css)

# Also there's another mobile override block right after for the overlay-close
mobile_close_pattern = re.compile(r"\.overlay-close \{\n    top: 1rem;\n    right: 1rem;\n    font-size: 2rem;\n    color: #333;\n  \}", re.DOTALL)
css = mobile_close_pattern.sub("", css)

# And for overlay-links
mobile_links_pattern = re.compile(r"\.overlay-links \{\n    margin-bottom: 2rem;\n    gap: 1rem;\n  \}\n  \.overlay-links a \{\n    font-size: 1\.2rem;\n    color: #333;\n    text-transform: none;\n    opacity: 1;\n  \}", re.DOTALL)
css = mobile_links_pattern.sub("", css)


with open('src/app/globals.css', 'w') as f:
    f.write(css)

print("Globals CSS updated!")
