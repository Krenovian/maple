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

export default async function HomePage() {
  const projects = await prisma.project.findMany({
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
  });

  return (
    <div className="dm-home">
      <Preloader />
      <CustomCursor />
      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Works projects={projects} />
        <Services />
        <ProcessBand />
        <IndexList />
        <Closing />
      </main>

      <Footer />
    </div>
  );
}
