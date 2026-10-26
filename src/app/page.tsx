import { Hero } from '@/components/hero/Hero';
import { NightFade, SkyBackdrop } from '@/components/hero/SkyBackdrop';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { StructuredData } from '@/components/StructuredData';
import { About } from '@/components/sections/About';
import { CaseStudyFeature } from '@/components/sections/CaseStudyFeature';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Publications } from '@/components/sections/Publications';
import { caseStudies, experience, profile, projects, publications, sections } from '@/content';

export default function HomePage() {
  const featured = caseStudies.find((s) => s.featured) ?? caseStudies[0];
  return (
    <>
      <StructuredData profile={profile} publications={publications} />
      <SiteHeader name={profile.name} />
      <SkyBackdrop />
      <main id="main">
        <Hero profile={profile} />
        <NightFade>
          <About profile={profile} copy={sections.about} />
          <CaseStudyFeature copy={sections.caseStudies} study={featured} />
          <Projects copy={sections.projects} items={projects} />
          <Experience copy={sections.experience} items={experience} />
          <Publications items={publications} copy={sections.research} />
          <Contact profile={profile} copy={sections.contact} />
          <SiteFooter name={profile.name} />
        </NightFade>
      </main>
    </>
  );
}
