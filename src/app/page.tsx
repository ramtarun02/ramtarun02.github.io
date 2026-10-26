import { Hero } from '@/components/hero/Hero';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { StructuredData } from '@/components/StructuredData';
import { About } from '@/components/sections/About';
import { CaseStudyFlagship } from '@/components/sections/CaseStudyFlagship';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Publications } from '@/components/sections/Publications';
import { Skills } from '@/components/sections/Skills';
import { profile, publications, sections } from '@/content';

export default function HomePage() {
  return (
    <>
      <StructuredData profile={profile} publications={publications} />
      <SiteHeader name={profile.name} />
      <div
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          minHeight: '100vh',
          fontFamily: 'var(--font-body)',
        }}
      >
        <main>
          <Hero profile={profile} />
          <About profile={profile} copy={sections.about} />
          <Experience copy={sections.experience} />
          <Projects copy={sections.projects} />
          <Publications items={publications} copy={sections.research} />
          <Skills copy={sections.skills} />
          <CaseStudyFlagship copy={sections.caseStudies} />
          <Contact profile={profile} copy={sections.contact} />
        </main>
        <SiteFooter name={profile.name} />
      </div>
    </>
  );
}
