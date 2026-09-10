import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapleImage from '@/components/MapleImage';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Our Team | MAPLE INFRA & INTERIORS',
  description:
    'Meet the architects, engineers and interior designers behind MAPLE INFRA & INTERIORS.',
};

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    where: { featured: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <div className="dm-page">
      <Navbar />

      <header className="dm-page-hero">
        <div className="dm-wrap">
          <span className="dm-page-kicker">People</span>
          <h1>
            Our <em>team</em>
          </h1>
          <p>
            A multidisciplinary studio of architects, engineers and interior designers — working together
            from concept to completion across South India and Qatar.
          </p>
        </div>
      </header>

      <section className="section team-section">
        <div className="dm-wrap">
          {members.length === 0 ? (
            <p className="team-empty">Team profiles are being updated. Visit again soon.</p>
          ) : (
            <div className="team-grid reveal-stagger">
              {members.map((member) => (
                <article className="team-card" key={member.id}>
                  <div className="team-card-photo">
                    {member.image ? (
                      <MapleImage
                        src={member.image}
                        alt={member.imageAlt || member.name}
                        fill
                        sizes="(max-width: 700px) 80vw, 25vw"
                      />
                    ) : (
                      <div className="team-card-placeholder" aria-hidden="true">
                        <span>{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="team-card-copy">
                    <h2>{member.name}</h2>
                    <p className="team-card-role">{member.role}</p>
                    {member.bio ? <p className="team-card-bio">{member.bio}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dm-wrap">
          <div className="dm-cta-band reveal-scale">
            <div>
              <h2>Work with our team</h2>
              <p>Tell us about your project and we&apos;ll connect you with the right specialists.</p>
            </div>
            <Link href="/contact" className="btn">Start a Project ↗</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
