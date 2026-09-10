import './globals.css';

import SmoothScroll from '@/components/SmoothScroll';
import ScrollAnimations from '@/components/ScrollAnimations';
import { CartProvider } from '@/components/shop/CartProvider';
import { WishlistProvider } from '@/components/shop/WishlistProvider';
import CartDrawer from '@/components/shop/CartDrawer';
import { siteUrl } from '@/lib/catalog';
import { SERVICE_INTEGRATED, SERVICE_TAGLINE } from '@/lib/services';

const base = siteUrl();

export const metadata = {
  metadataBase: new URL(base),
  icons: {
    icon: [{ url: '/images/logo-mark.png', type: 'image/png' }],
    apple: [{ url: '/images/logo-mark.png', type: 'image/png' }],
  },
  title: {
    default: `MAPLE INFRA & INTERIORS | ${SERVICE_TAGLINE}`,
    template: '%s | MAPLE INFRA & INTERIORS',
  },
  description:
    `Formerly DE MAPLE Architects & Engineers. Integrated capability: ${SERVICE_INTEGRATED}. Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar — 200+ projects over 15 years.`,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'MAPLE INFRA & INTERIORS',
    title: 'MAPLE INFRA & INTERIORS',
    description:
      `Integrated capability across ${SERVICE_INTEGRATED}. Based in Maranchery, Malappuram — South India · Qatar.`,
    images: [{ url: '/images/hero.png', width: 1200, height: 630, alt: 'MAPLE INFRA & INTERIORS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAPLE INFRA & INTERIORS',
    description:
      'Based in Maranchery, Malappuram, with projects delivered across Kerala, Bengaluru and Qatar.',
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
