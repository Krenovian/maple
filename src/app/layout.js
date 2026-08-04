import './globals.css';

import SmoothScroll from '@/components/SmoothScroll';
import ScrollAnimations from '@/components/ScrollAnimations';
import { CartProvider } from '@/components/shop/CartProvider';
import { WishlistProvider } from '@/components/shop/WishlistProvider';
import CartDrawer from '@/components/shop/CartDrawer';
import { siteUrl } from '@/lib/catalog';

const base = siteUrl();

export const metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'MAPLE INFRA & INTERIORS | Architecture · Engineering · Interiors',
    template: '%s | MAPLE INFRA & INTERIORS',
  },
  description:
    'Formerly DE MAPLE Architects & Engineers. Based in Maranchery, Ponnani (Malappuram), delivering architecture, interiors, contracting and consultancy across Kerala, Bengaluru and Qatar — 200+ projects over 15 years.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'MAPLE INFRA & INTERIORS',
    title: 'MAPLE INFRA & INTERIORS',
    description:
      'Architecture, interiors, contracting and consultancy from Malappuram — 200+ projects across Kerala, Bengaluru and Qatar.',
    images: [{ url: '/images/hero.png', width: 1200, height: 630, alt: 'MAPLE INFRA & INTERIORS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAPLE INFRA & INTERIORS',
    description:
      'Architecture, interiors, contracting and consultancy from Malappuram.',
    images: ['/images/hero.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <SmoothScroll>
              <ScrollAnimations />
              {children}
              <CartDrawer />
            </SmoothScroll>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
