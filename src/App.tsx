import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Icon } from '@iconify/react';

/* ───────────────────────── constants ───────────────────────── */

// Replace with your Formspree form ID from https://formspree.io
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwdkepq';

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Journey', id: 'journey' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
];

const SOCIAL_LINKS = [
  { icon: 'mdi:github', href: 'https://github.com/ramtarun02/About', label: 'GitHub' },
  { icon: 'mdi:linkedin', href: 'https://linkedin.com/in/ramtarun237', label: 'LinkedIn' },
  { icon: 'mdi:instagram', href: 'https://instagram.com/trn_0330', label: 'Instagram' },
];

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  article: string;
  gallery: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'flowvfp',
    title: 'FlowVFP',
    subtitle: 'Transonic CFD in the Browser',
    description:
      'A modern web application wrapping the classic ESDU Viscous Full Potential solver, enabling interactive transonic wing design directly in the browser.',
    tags: ['Python', 'React', 'Flask', 'CFD'],
    image: './assets/IMG_4.webp',
    article: `Most transonic wing design tools still feel stuck in the 90s: opaque Fortran binaries, fragile MATLAB scripts, and a maze of input files you are afraid to touch. FlowVFP is my attempt to drag that workflow into a browser tab.

FlowVFP wraps the classic ESDU Viscous Full Potential solver in a modern web application that runs on any machine with a decent browser. Instead of editing GEO/MAP/DAT files by hand and nursing a CLI run, you upload geometry, tweak it interactively in 2D/3D, and launch simulations with a click while watching convergence live over WebSocket. Behind the scenes, legacy Fortran executables orchestrate the actual physics, but the user never has to see a command line.

The app is structured as four focused modules: a Geometry Module for section-by-section editing and batch interpolation of twist, sweep, and dihedral; a Solver Module that manages single runs, continuation runs, and automated AoA/Mach sweeps; a VFP-Post module for Cp, wave drag, and boundary-layer analysis; and a ProWiM module for propeller-wing interaction.

What I enjoyed most was turning "CFD as a black box" into "CFD as a live conversation." You can nudge twist distributions, rerun a sweep, and immediately see how shock locations, lift, and wave drag move in response. Because the whole system is cloud-deployable and license-free, it is now practical for a class or design team to explore transonic design iterations collaboratively, in real time, from ordinary laptops.`,
    gallery: ['./assets/IMG_4.webp', './assets/IMG_5.webp', './assets/IMG_6.webp'],
  },
  {
    id: 'neural-bemt',
    title: 'Neural-BEMT',
    subtitle: 'A BEMT Solver Built for ML',
    description:
      'A clean-room Python implementation of Blade Element Momentum Theory, designed from the start to be both production-grade and machine-learning-ready.',
    tags: ['Python', 'PyTorch', 'BEMT', 'ML'],
    image: './assets/IMG_5.webp',
    article: `Blade element-momentum theory is one of those ideas that shows up everywhere -- from hobby propellers to offshore turbines -- yet most codes feel either too simple for research or too entangled for extension. Neural-BEMT is my clean-room implementation of BEMT in Python, designed from the start to be both production-grade and machine-learning-ready.

The code unifies propeller and wind-turbine analysis in a single solver that flips sign conventions via a simple machine_type switch, but keeps the underlying induction iteration stable even near singular flow angles. It comes with analytic Prandtl tip and hub loss models, high-induction corrections (Glauert and Buhl), 3D stall delay corrections, and a prescribed wake model that can generate slipstream fields and streamtube contraction maps.

Under the hood, Neural-BEMT is modular: there are dedicated packages for airfoil polars (including multi-Re tables and 3D-corrected wrappers), blade and rotor geometry, pluggable loss-factor models, and post-processing utilities for spanwise distributions, sweep curves, and CSV export.

The "Neural" part is not about adding magic black boxes everywhere; it is about exposing interfaces where learned surrogates actually make sense. Any airfoil polar can be swapped for a neural network, any empirical loss factor can be replaced by a learned model, and the solver configuration already includes switches that map cleanly onto physics-informed training or RL-based blade optimisation loops.`,
    gallery: ['./assets/IMG_5.webp', './assets/IMG_4.webp', './assets/IMG_6.webp'],
  },
  {
    id: 'neural-flux',
    title: 'Neural Flux Operator',
    subtitle: 'Learning Transient Flow on Point Clouds',
    description:
      'A neural operator that respects finite-volume structure while forecasting complex unsteady aerodynamics on raw point clouds.',
    tags: ['PyTorch', 'GNN', 'CFD', 'Operator'],
    image: './assets/IMG_6.webp',
    article: `CFD solvers know the physics but they are slow; generic sequence models are fast but indifferent to geometry and boundaries. This project asks a pointed question: can we build a neural operator that respects the spirit of finite-volume updates while forecasting complex unsteady aerodynamics on raw point clouds?

The benchmark is demanding: given geometry, airfoil-surface indices, and 5 past velocity frames on 100k points, predict the next 5 frames of the 3D flow around one to three airfoils with no-slip boundaries. I formalised this as a geometry-conditioned operator acting on a graph built over the sampled points, where edges represent local geometric neighborhoods and airfoil proximity.

The resulting model has four stages: rich feature construction (coordinates, airfoil mask, boundary distance, velocity history), graph building with both spatial and boundary-aware edges, a stack of finite-volume-inspired operator blocks, and a rollout head that predicts multi-step futures. Each operator block updates a point latent state via learned "flux" messages that depend on relative positions, states, and boundary information, regularised to behave like antisymmetric exchanges in the interior with strict no-slip behavior at the airfoil.

What emerges is a model that sits somewhere between CFD and deep learning: it does not solve the Navier-Stokes equations, but it also does not treat the flow as a generic video. The open question it leaves you with is simple: how much of CFD reliability can we recover if we let the neural network learn its own "numerical fluxes" on graphs, while we keep nudging it to think in terms of conservation and boundaries?`,
    gallery: ['./assets/IMG_6.webp', './assets/IMG_4.webp', './assets/IMG_5.webp'],
  },
];

const JOURNEY = [
  {
    period: '2023',
    title: 'Research Intern',
    org: 'Cranfield University',
    description:
      'Ran a full wind-tunnel campaign on tubercled wings at the National Wind Tunnel Facility and built Python automation to process large CFD datasets. Cross-compared RANS, vortex methods, and experiments to quantify 3-7 % efficiency gains, contributing to an ICAS 2024 paper.',
  },
  {
    period: 'Late 2023 - 2024',
    title: 'Remote Research Intern',
    org: 'University of Cambridge',
    description:
      'Developed hybrid physics-ML models for friction factors in engine nozzles and built a physics-informed neural operator for cylinder flow with ~95 % accuracy -- the point where CFD became a playground for neural operators and physics-informed learning.',
  },
  {
    period: '2023 - 2024',
    title: 'Aerodynamics Engineer',
    org: 'BONV Technologies',
    description:
      'Owned aerodynamic configuration trades for a high-altitude heavy-payload UAV -- from performance analysis and Python dashboards for flight-test data to FEA workflows in ANSYS, learning how aerodynamic ambition collides with structural and propulsion constraints.',
  },
];

const EDUCATION = [
  {
    period: '2024 - 2026',
    degree: 'MSc by Research - Aerospace',
    school: 'Cranfield University',
    location: 'Cranfield, UK',
    description:
      'Built FlowVFP, a production-grade Viscous Full Potential solver wrapped in a React/Flask web app for transonic aircraft analysis. Extended the solver to full-aircraft trim including tailplane aerodynamics and wake-based inflow modelling, directly supporting Airbus OneHEART design decisions.',
  },
  {
    period: '2020 - 2024',
    degree: 'B.Tech - Materials Engineering',
    school: 'IIT (BHU) Varanasi',
    location: 'Varanasi, India',
    description:
      'Gravitated toward aerodynamics through independent research on vertical-axis wind turbines, culminating in an AIAA SciTech 2024 publication -- turning a non-aero starting point into publishable CFD research and academic writing.',
  },
];

const EXPERTISE = [
  { title: 'CFD & Solvers', color: '#426EF0', icon: 'lucide:wrench', items: ['OpenFOAM', 'SU2', 'Meshing'] },
  { title: 'Programming', color: '#8B5CF6', icon: 'lucide:code-2', items: ['C++', 'Python', 'MPI/CUDA'] },
  { title: 'AI/ML for Fluids', color: '#10B981', icon: 'lucide:cpu', items: ['PINNs', 'PyTorch', 'TensorFlow'] },
  { title: 'Tools & Platforms', color: '#F59E0B', icon: 'lucide:terminal', items: ['ParaView', 'Git/CI', 'Linux'] },
];

/* ───────────────────────── animation variants ───────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

/* ───────────────────────── section reveal wrapper ───────────────────────── */

function Reveal({ children, className = '', variants: v = fadeUp }: { children: React.ReactNode; className?: string; variants?: Variants }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -48px 0px' }}
      variants={v}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────── project modal ───────────────────────── */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" />

      {/* modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-white/96 backdrop-blur-md shadow-[0_30px_80px_rgba(15,23,42,0.16)] border border-white/50 modal-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 mt-4 z-20 w-10 h-10 rounded-full bg-white/85 border border-white/70 shadow flex items-center justify-center hover:bg-white hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
          aria-label="Close modal"
        >
          <Icon icon="lucide:x" className="w-5 h-5" />
        </button>

        {/* hero image */}
        <div className="h-64 md:h-80 w-full relative overflow-hidden rounded-t-[24px]">
          <img src={project.image} alt={project.title} decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* content */}
        <div className="px-8 md:px-14 pb-10 -mt-16 relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[#426EF0]/10 border border-[#426EF0]/20 rounded-full text-[10px] font-bold text-[#426EF0] uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-1">{project.title}</h2>
          <p className="text-lg text-[#426EF0] font-medium mb-6">{project.subtitle}</p>

          <div className="prose prose-sm max-w-none text-[#323843]/85 leading-relaxed space-y-4">
            {project.article.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* gallery marquee */}
          <div className="mt-12">
            <h3 className="text-lg font-bold mb-4">Project Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.gallery.map((img, i) => (
                <div key={img + i} className="overflow-hidden rounded-[18px] bg-slate-100 shadow-sm">
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="interactive-media h-48 md:h-56 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── main app ───────────────────────── */

export default function App() {
  const prefersReduced = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();

  /* -- avatar morph scroll transforms -- */
  const heroAvatarScale = useTransform(scrollY, [0, 320], [1, 0.28]);
  const heroAvatarOpacity = useTransform(scrollY, [80, 280], [1, 0]);
  const heroAvatarY = useTransform(scrollY, [0, 320], [0, -120]);
  const headerAvatarOpacity = useTransform(scrollY, [140, 260], [0, 1]);
  const headerAvatarScale = useTransform(scrollY, [140, 260], [0.88, 1]);
  const scrollTopOpacity = useTransform(scrollY, [160, 260], [0, 1]);
  const scrollTopScale = useTransform(scrollY, [160, 260], [0.92, 1]);
  const scrollTopY = useTransform(scrollY, [160, 260], [12, 0]);
  const scrollTopPointerEvents = useTransform(scrollY, (value) => (value > 220 ? 'auto' : 'none'));

  /* -- smooth scroll -- */
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* -- contact form -- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message }),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  /* -- lock scroll on mobile menu -- */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (videoRef.current && !prefersReduced) {
      videoRef.current.playbackRate = 0.82;
    }
  }, [prefersReduced]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-mono text-[#121722] selection:bg-[#D6A85C]/25 selection:text-[#3159D8]">

      {/* ────── ambient background ────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,110,240,0.12),transparent_0_34%),radial-gradient(circle_at_82%_18%,rgba(37,192,244,0.14),transparent_0_28%),radial-gradient(circle_at_62%_22%,rgba(245,158,11,0.10),transparent_0_22%),linear-gradient(180deg,rgba(249,250,251,0.62),rgba(241,244,254,0.38))]" />
        <div className="ambient-orb absolute top-[-60px] left-[-100px] w-[420px] h-[240px] bg-[#426EF0]/10 rounded-full" />
        <div className="ambient-orb absolute top-[260px] right-[-80px] w-[320px] h-[220px] bg-[#25C0F4]/10 rounded-full" />
        <div className="ambient-orb absolute bottom-[-120px] left-[18%] w-[380px] h-[220px] bg-[#8B5CF6]/8 rounded-full" />
        <div className="ambient-orb absolute top-[12%] right-[16%] w-[240px] h-[160px] bg-[#F59E0B]/10 rounded-full" />

        {!prefersReduced && (
          <video
            ref={videoRef}
            src="./assets/water-drop.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="video-bg hidden lg:block"
            aria-hidden="true"
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,240,0.03)_0%,rgba(249,250,251,0.50)_100%)]" />
      </div>

      {/* ────── header ────── */}
      <header className="sticky top-0 z-50 w-full h-16 bg-[rgba(255,252,247,0.80)] backdrop-blur-md border-b border-[#E8DCC8]/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3 group">
            <motion.div
              className="w-8 h-8 rounded-full overflow-hidden bg-[#E3E6FE]"
              style={prefersReduced ? {} : { opacity: headerAvatarOpacity, scale: headerAvatarScale }}
            >
              <img src="./assets/profile-pic.png" alt="Profile" className="w-full h-full object-cover scale-125 translate-y-0.5" />
            </motion.div>
            <span className="text-base font-semibold tracking-tight group-hover:text-[#426EF0] transition-colors">
              Tarun Ramprakash
            </span>
          </button>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-[#8F96A3] hover:text-[#426EF0] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#426EF0] after:transition-all hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* mobile toggle */}
          <button
            className="md:hidden p-2 text-[#8F96A3] hover:text-[#426EF0] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'} className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ────── mobile menu overlay ────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-white/90 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 pt-12">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-lg font-medium text-[#323843] hover:text-[#426EF0] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-4 mt-8">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-[#8F96A3] hover:text-[#426EF0] transition-colors">
                    <Icon icon={s.icon} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">

        {/* ════════════ HERO ════════════ */}
        <section
          id="home"
          ref={heroRef}
          className="max-w-7xl mx-auto px-6 lg:px-12 min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-10 lg:py-0"
        >
          {/* profile picture */}
          <motion.div
            className="gpu-layer relative w-full lg:w-2/5 flex justify-center"
            style={prefersReduced ? {} : { scale: heroAvatarScale, opacity: heroAvatarOpacity, y: heroAvatarY }}
          >
            <div className="relative w-[260px] h-[260px] md:w-[330px] md:h-[330px] bg-[#DEFDF2] rounded-full shadow-2xl overflow-visible">
              <div className="absolute inset-[-19px] bg-[#426EF0]/20 rounded-full blur-[64px]" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white/50">
                <img src="./assets/profile-pic.png" alt="Tarun Ramprakash" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* hero card */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: prefersReduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-3/5 glass-card smooth-card p-8 md:p-10 rounded-[20px] shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="lux-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-[#D6A85C] rounded-full animate-pulse" />
              <span className="text-xs font-medium">Available for new opportunities</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 font-sans">Tarun Ramprakash</h1>

            <div className="mb-6">
              <p className="text-xl md:text-2xl font-light text-[#8F96A3]">Computational Aerodynamicist</p>
              <p className="text-xl md:text-2xl font-medium text-[#426EF0]">CFD Solver Developer & Physics-AI</p>
            </div>

            <p className="text-base md:text-lg text-[#323843]/80 leading-relaxed mb-8">
              Bridging the gap between traditional numerical methods and modern machine learning. I specialize in developing high-performance fluid dynamics solvers and integrating data-driven surrogate models to accelerate aerospace design cycles.
            </p>

            <motion.div className="flex flex-wrap gap-2.5 mb-8" variants={stagger} initial="hidden" animate="visible">
              {['C++', 'Python', 'OpenFOAM', 'CUDA', 'PyTorch', 'MPI'].map((skill) => (
                <motion.span
                  key={skill}
                  variants={scaleUp}
                  className="px-4 py-2 bg-white/50 border border-white/60 rounded-full text-xs font-semibold shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('projects')}
                className="lux-primary-button px-8 py-3 text-white rounded-full font-medium hover:-translate-y-0.5 transition-[transform,box-shadow,background-color] duration-200 flex items-center justify-center gap-2"
              >
                View Projects
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
              <button className="lux-secondary-button px-8 py-3 rounded-full font-medium hover:bg-white/85 hover:-translate-y-0.5 transition-[transform,background-color,box-shadow] duration-200 flex items-center justify-center gap-2">
                <Icon icon="lucide:download" className="w-4 h-4" />
                Download CV
              </button>
            </div>
          </motion.div>
        </section>

        {/* ════════════ QUOTE 1 ════════════ */}
        <Reveal>
          <section className="lux-quote-band w-full py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-6">
                "The laws of aerodynamics are unforgiving, but the numerical methods we use to understand them can be beautiful."
              </p>
              <span className="text-sm font-semibold tracking-[0.1em] text-[#426EF0] uppercase">- T. Ramprakash</span>
            </div>
          </section>
        </Reveal>

        {/* ════════════ FEATURED PROJECTS ════════════ */}
        <section id="projects" className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Featured Projects</h2>
              <div className="lux-divider w-20 h-1 mx-auto rounded-full" />
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                whileHover={prefersReduced ? undefined : { y: -6, scale: 1.01, transition: { duration: 0.22, ease: EASE } }}
                className="glass-card smooth-card rounded-[20px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.08)] flex flex-col h-full cursor-pointer group"
                onClick={() => setActiveProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveProject(project)}
              >
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="interactive-media w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-[#426EF0]/0 group-hover:bg-[#426EF0]/6 transition-colors duration-300 flex items-center justify-center">
                    <Icon icon="lucide:expand" className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-sans mb-1">{project.title}</h3>
                  <p className="text-sm text-[#426EF0] font-medium mb-3">{project.subtitle}</p>
                  <p className="text-sm text-[#8F96A3] leading-relaxed mb-8 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#426EF0]/10 border border-[#426EF0]/20 rounded-full text-[10px] font-bold text-[#426EF0] uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════ QUOTE 2 ════════════ */}
        <Reveal>
          <section className="lux-quote-band w-full py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-6">
                "All models are wrong, but some are useful. The goal is to make them run faster without losing the physics."
              </p>
              <span className="text-sm font-semibold tracking-[0.1em] text-[#426EF0] uppercase">- George E. P. Box (Adapted)</span>
            </div>
          </section>
        </Reveal>

        {/* ════════════ TECHNICAL EXPERTISE ════════════ */}
        <section id="skills" className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Technical Expertise</h2>
              <div className="lux-divider w-20 h-1 mx-auto mb-6 rounded-full" />
              <p className="max-w-2xl mx-auto text-[#8F96A3] text-base">
                A synergistic blend of deep physics knowledge, high-performance computing, and modern data-driven techniques.
              </p>
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {EXPERTISE.map((e) => (
              <motion.div
                key={e.title}
                variants={scaleUp}
                whileHover={prefersReduced ? undefined : { y: -4, scale: 1.01, transition: { duration: 0.22, ease: EASE } }}
                className="glass-card smooth-card p-8 rounded-[24px] shadow-md flex flex-col items-center text-center bg-gradient-to-br from-white/85 to-[#F1F4FE]/78"
              >
                <div
                  className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 border"
                  style={{ borderColor: e.color + '20' }}
                >
                  <Icon icon={e.icon} className="w-7 h-7" style={{ color: e.color }} />
                </div>
                <h3 className="text-lg font-bold mb-6">{e.title}</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {e.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-white rounded-full text-xs font-medium shadow-sm border"
                      style={{ color: e.color, borderColor: e.color + '30' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════ PROFESSIONAL JOURNEY ════════════ */}
        <section id="journey" className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Professional Journey</h2>
              <div className="lux-divider w-20 h-1 mx-auto rounded-full" />
            </div>
          </Reveal>

          <div className="relative">
            {/* timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#426EF0]/10 via-[#426EF0]/30 to-[#426EF0]/10 hidden md:block" />

            {JOURNEY.map((j, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={j.period} className={`relative flex flex-col md:flex-row items-center justify-between ${i < JOURNEY.length - 1 ? 'mb-24' : ''}`}>
                  {isLeft ? (
                    <>
                      <Reveal className="w-full md:w-[45%] order-2 md:order-1" variants={slideRight}>
                        <div className="glass-card smooth-card p-8 rounded-[18px] shadow-lg md:text-right">
                          <span className="text-sm font-semibold text-[#426EF0] mb-2 block">{j.period}</span>
                          <h3 className="text-2xl font-bold mb-1">{j.title}</h3>
                          <p className="text-[#8F96A3] font-medium mb-4">{j.org}</p>
                          <p className="text-sm text-[#323843] leading-relaxed">{j.description}</p>
                        </div>
                      </Reveal>
                      <motion.div
                        initial={{ scale: 0.82, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#426EF0] rounded-full shadow-md z-10 hidden md:block"
                      />
                      <div className="w-full md:w-[45%] order-1 md:order-2 mb-8 md:mb-0" />
                    </>
                  ) : (
                    <>
                      <div className="w-full md:w-[45%] order-1" />
                      <motion.div
                        initial={{ scale: 0.82, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#426EF0] rounded-full shadow-md z-10 hidden md:block"
                      />
                      <Reveal className="w-full md:w-[45%] order-2" variants={slideLeft}>
                        <div className="glass-card smooth-card p-8 rounded-[18px] shadow-lg">
                          <span className="text-sm font-semibold text-[#426EF0] mb-2 block">{j.period}</span>
                          <h3 className="text-2xl font-bold mb-1">{j.title}</h3>
                          <p className="text-[#8F96A3] font-medium mb-4">{j.org}</p>
                          <p className="text-sm text-[#323843] leading-relaxed">{j.description}</p>
                        </div>
                      </Reveal>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════ QUOTE 3 ════════════ */}
        <Reveal>
          <section className="lux-quote-band w-full py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-6">
                "Theory guides, experiment decides, and computation provides the insight to bridge them."
              </p>
              <span className="text-sm font-semibold tracking-[0.1em] text-[#426EF0] uppercase">- Anonymous</span>
            </div>
          </section>
        </Reveal>

        {/* ════════════ ACADEMIC BACKGROUND ════════════ */}
        <section id="education" className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Academic Background</h2>
              <div className="lux-divider w-20 h-1 mx-auto rounded-full" />
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {EDUCATION.map((edu) => (
              <motion.div
                key={edu.period}
                variants={fadeUp}
                whileHover={prefersReduced ? undefined : { y: -4, scale: 1.005, transition: { duration: 0.22, ease: EASE } }}
                className="glass-card smooth-card p-8 rounded-[18px] shadow-lg relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#426EF0]/40" />
                <div className="flex items-center gap-2 text-[#426EF0] mb-4">
                  <Icon icon="lucide:calendar" className="w-4 h-4" />
                  <span className="text-xs font-semibold">{edu.period}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                <div className="flex items-center gap-2 text-[#8F96A3] text-sm mb-6">
                  <span className="font-medium">{edu.school}</span>
                  <span>-</span>
                  <Icon icon="lucide:map-pin" className="w-3 h-3" />
                  <span>{edu.location}</span>
                </div>
                <p className="text-sm text-[#323843] leading-relaxed">{edu.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ════════════ CONTACT ════════════ */}
        <section id="contact" className="max-w-5xl mx-auto px-6 lg:px-12 py-24">
          <Reveal variants={scaleUp}>
            <div className="glass-card rounded-[24px] shadow-2xl overflow-hidden flex flex-col lg:flex-row bg-white/80">
              {/* contact info */}
              <div className="lg:w-2/5 p-12 bg-gradient-to-br from-[#F8F1E2] via-[#EEF2FF] to-[#F7F8FC] relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#426EF0]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 bg-[#25C0F4]/10 rounded-full blur-3xl" />
                <div className="absolute top-[28%] left-[8%] w-40 h-40 bg-[#F59E0B]/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold font-sans mb-6 tracking-tight">Let&apos;s Connect</h2>
                  <p className="text-[#181B20]/80 mb-8 leading-relaxed">
                    Interested in collaborating on high-fidelity simulation tools or discussing the future of AI in aerodynamics? Send a message.
                  </p>

                  <a
                    href="mailto:tarun.uk24@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-[#426EF0] font-medium mb-10 hover:underline"
                  >
                    <Icon icon="lucide:mail" className="w-4 h-4" />
                    tarun.uk24@gmail.com
                  </a>

                  <div className="flex gap-4">
                    {SOCIAL_LINKS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-12 h-12 rounded-xl bg-white/55 border border-white/70 flex items-center justify-center hover:bg-white hover:-translate-y-0.5 transition-[transform,background-color,box-shadow] duration-200 shadow-sm"
                      >
                        <Icon icon={s.icon} className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* contact form */}
              <div className="lg:w-3/5 p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-[#181B20]/80">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#426EF0]/20 focus:border-[#426EF0] outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[#181B20]/80">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#426EF0]/20 focus:border-[#426EF0] outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-[#181B20]/80">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="How can we work together?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#426EF0]/20 focus:border-[#426EF0] outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full py-4 bg-[#426EF0] text-white rounded-xl font-medium shadow-lg hover:bg-[#3659D1] hover:shadow-xl hover:-translate-y-0.5 transition-[transform,box-shadow,background-color] duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Icon icon="lucide:send" className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {formStatus === 'success' && (
                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-green-600 text-center font-medium">
                      Message sent successfully! I will get back to you soon.
                    </motion.p>
                  )}
                  {formStatus === 'error' && (
                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 text-center font-medium">
                      Something went wrong. Please try again or email me directly.
                    </motion.p>
                  )}
                </form>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ────── footer ────── */}
      <footer className="w-full py-12 bg-[rgba(255,252,247,0.82)] backdrop-blur-md border-t border-[#E8DCC8]/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="text-sm text-[#8F96A3]">2026 Tarun Ramprakash - Computational Aerodynamics</span>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-[#8F96A3] hover:text-[#426EF0] hover:-translate-y-0.5 transition-[transform,color] duration-200"
              >
                <Icon icon={s.icon} className="w-4 h-4" />
              </a>
            ))}
            <a
              href="mailto:tarun.uk24@gmail.com"
              aria-label="Email"
              className="text-[#8F96A3] hover:text-[#426EF0] hover:-translate-y-0.5 transition-[transform,color] duration-200"
            >
              <Icon icon="lucide:mail" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ────── scroll-to-top ────── */}
      <motion.button
        onClick={() => scrollTo('home')}
        style={prefersReduced ? undefined : { opacity: scrollTopOpacity, scale: scrollTopScale, y: scrollTopY, pointerEvents: scrollTopPointerEvents }}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#426EF0] text-white shadow-xl flex items-center justify-center hover:bg-[#3659D1] hover:-translate-y-0.5 transition-[transform,background-color,box-shadow] duration-200"
        aria-label="Scroll to top"
      >
        <Icon icon="lucide:chevron-up" className="w-5 h-5" />
      </motion.button>

      {/* ────── project modal ────── */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
