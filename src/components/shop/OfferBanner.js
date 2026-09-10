'use client';

import MapleImage from '@/components/MapleImage';
import Link from 'next/link';

export default function OfferBanner({ settings }) {
  if (!settings?.shop_banner_enabled) return null;

  return (
    <div className="tdc-offer-banner tdc-offer-banner--page">
      <div className="tdc-offer-banner-media">
        <MapleImage
          src={settings.shop_banner_image}
          alt={settings.shop_banner_image_alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="tdc-offer-banner-copy">
        <span className="dm-page-kicker">{settings.shop_banner_eyebrow}</span>
        <h2>{settings.shop_banner_title}</h2>
        <p>{settings.shop_banner_text}</p>
        <Link href={settings.shop_banner_cta_href || '#tdc-catalog'} className="btn">
          {settings.shop_banner_cta_label} →
        </Link>
      </div>
    </div>
  );
}
