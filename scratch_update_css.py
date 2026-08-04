import re

with open('src/app/home.css', 'r') as f:
    css = f.read()

# 1. Update imports
css = re.sub(
    r"@import url\('https://api\.fontshare\.com[^']+'\);\n@import url\('https://fonts\.googleapis\.com[^']+'\);",
    "@import url('https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Outfit:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');",
    css
)

# 2. Update variables
vars_old = """  --ink: #0f0e0c;
  --ink-2: #191714;
  --bone: #f1ede7;
  --sand: #e2dcd2;
  --accent: #e4502a;
  --line: rgba(15, 14, 12, 0.13);
  --line-inv: rgba(241, 237, 231, 0.16);

  --display: 'Clash Display', 'Switzer', system-ui, sans-serif;
  --sans: 'Switzer', system-ui, -apple-system, sans-serif;
  --mono: 'Geist Mono', ui-monospace, 'SFMono-Regular', monospace;"""

vars_new = """  --ink: #000000;
  --ink-2: #09090b;
  --bone: #0a0a0c;
  --sand: #18181b;
  --accent: #9d4edd;
  --line: rgba(255, 255, 255, 0.08);
  --line-inv: rgba(255, 255, 255, 0.12);
  --text-main: #f8f9fa;
  --text-muted: rgba(248, 249, 250, 0.6);

  --display: 'Skranji', cursive;
  --sans: 'Outfit', system-ui, -apple-system, sans-serif;
  --mono: 'Space Mono', ui-monospace, 'SFMono-Regular', monospace;"""
css = css.replace(vars_old, vars_new)

# 3. Update global text color
css = css.replace("color: var(--ink);", "color: var(--text-main);")
css = css.replace("color: var(--bone);", "color: var(--text-main);")

# 4. Update specific rgba text colors to use light colors instead of dark
css = re.sub(r"rgba\(15, 14, 12, (0\.\d+)\)", r"rgba(255, 255, 255, \1)", css)
css = re.sub(r"rgba\(241, 237, 231, (0\.\d+)\)", r"rgba(255, 255, 255, \1)", css)

# 5. Add glassmorphism to topbar
css = css.replace(".dm-topbar {", ".dm-topbar {\n  background: rgba(0, 0, 0, 0.4);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  padding: 1rem 2rem;\n  border-radius: 50px;\n  border: 1px solid var(--line);")
css = css.replace(".dm-hero-inner {", ".dm-hero-inner {\n  padding-top: clamp(1rem, 2vw, 2rem);")

# 6. Update topbar-cta to pill and glowing
cta_old = """  border-radius: 50px;
  font-size: 0.66rem;"""
cta_new = """  border-radius: 50px;
  font-size: 0.66rem;
  box-shadow: 0 0 15px rgba(157, 78, 221, 0.2);"""
css = css.replace(cta_old, cta_new)

with open('src/app/home.css', 'w') as f:
    f.write(css)

print("CSS updated successfully!")
