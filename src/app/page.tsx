import { Hero } from '@/components/hero/Hero';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { StructuredData } from '@/components/StructuredData';
import { About } from '@/components/sections/About';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { LatestStrip } from '@/components/sections/LatestStrip';
import { Projects } from '@/components/sections/Projects';
import { Publications } from '@/components/sections/Publications';
import { Skills } from '@/components/sections/Skills';
import {
  caseStudies,
  education,
  githubUser,
  latest,
  profile,
  projects,
  publications,
  roles,
  sections,
  skills,
} from '@/content';

export default function HomePage() {
  return (
    <>
      <StructuredData profile={profile} publications={publications} />
      <SiteHeader name={profile.name} />
      <main id="top">
        <Hero profile={profile} />
        <LatestStrip items={latest} copy={sections.latest} />
        <About profile={profile} copy={sections.about} />
        <CaseStudies studies={caseStudies} copy={sections.caseStudies} />
        <Projects items={projects} user={githubUser} copy={sections.projects} />
        <Experience roles={roles} education={education} copy={sections.experience} />
        <Publications items={publications} copy={sections.research} />
        <Skills groups={skills} copy={sections.skills} />
        <Contact profile={profile} copy={sections.contact} />
      </main>
      <SiteFooter />
    </>
  );
}
