import './home.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

import Preloader from '@/components/home/Preloader';
import CustomCursor from '@/components/home/CustomCursor';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Manifesto from '@/components/home/Manifesto';
import Works from '@/components/home/Works';
import Services from '@/components/home/Services';
import ProcessBand from '@/components/home/ProcessBand';
import IndexList from '@/components/home/IndexList';
import Closing from '@/components/home/Closing';
import DecorClub from '@/components/home/DecorClub';
import { getSiteImages } from '@/lib/siteSettings';
import { resolveHeroImages } from '@/lib/siteImageFields';
import { getHomepageContent } from '@/lib/siteContent';
import { HOMEPAGE_SHOP } from '@/lib/homepageShop';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [projects, siteImages, homepageContent, featuredProducts] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        location: true,
        area: true,
        year: true,
        image: true,
        slug: true,
      },
    }),
    getSiteImages(),
    getHomepageContent(),
    prisma.product.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        image: true,
        imageAlt: true,
      },
    }),
  ]);

  const homepageProducts = featuredProducts.slice(0, HOMEPAGE_SHOP.featuredLimit);
  const heroImages = resolveHeroImages(siteImages);

  return (
    <div className="dm-home">
      <Preloader />
      <CustomCursor />
      <Navbar />

      <main>
        <Hero
          heroImage={heroImages[0]}
          heroImages={heroImages}
          heroImageAlt={siteImages.hero_image_alt}
        />
        <Marquee />
        <Manifesto
          content={homepageContent.manifesto}
          image={siteImages.manifesto_image}
          imageAlt={siteImages.manifesto_image_alt}
        />
        <Works projects={projects} />
        <Services siteImages={siteImages} />
        <ProcessBand />
        <IndexList />
        <DecorClub shop={HOMEPAGE_SHOP} products={homepageProducts} />
        <Closing
          quoteImage={siteImages.closing_quote_image}
          quoteImageAlt={siteImages.closing_quote_image_alt}
          testimonial={homepageContent.testimonial}
        />
      </main>

      <Footer />
    </div>
  );
}
