import { AmbientField } from '@/components/AmbientField';
import { Hero } from '@/components/hero/Hero';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { About } from '@/components/sections/About';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Experience } from '@/components/sections/Experience';
import { Publications } from '@/components/sections/Publications';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { caseStudies, education, profile, publications, roles, skills } from '@/content';

export default function HomePage() {
  return (
    <>
      <AmbientField />
      <SiteHeader name={profile.name} />
      <main id="top">
        <Hero profile={profile} />
        <About profile={profile} />
        <CaseStudies studies={caseStudies} />
        <Experience roles={roles} education={education} />
        <Publications items={publications} />
        <Skills groups={skills} />
        <Contact profile={profile} />
      </main>
      <SiteFooter />
    </>
  );
}
