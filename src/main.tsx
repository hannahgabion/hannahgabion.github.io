import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, Play, Plus, X, Menu, Download, FolderOpen, Film, Image as ImageIcon, Mail, Phone, MapPin, Sparkles, ChevronDown, Volume2 } from 'lucide-react';
import { projects, webProjects, identity, tools, media, durationFor, editingCreditFor, type Project, type Category, type Collection } from './content';
import './styles.css';
import { siteUrl } from './paths';

const archivePage = window.location.pathname.includes('more-work');
const home = (anchor: string) => archivePage ? siteUrl(`/${anchor}`) : anchor;
const featured = projects.filter(p => p.featured);
const archived = projects.filter(p => !p.featured);

function Flourish({ className = '' }: { className?: string }) {
  return <svg className={`flourish ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 0C40 28 28 40 0 40C28 40 40 52 40 80C40 52 52 40 80 40C52 40 40 28 40 0Z" fill="currentColor"/></svg>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [menuOpen]);
  return <header className="site-header">
    <a href={siteUrl('/')} className="brand"><span className="brand-mark" aria-hidden="true">h<span>.</span></span><span className="brand-name">HANNAH GABION<span>MARKETING & MULTIMEDIA</span></span></a>
    <button className="menu-toggle" ref={menuButton} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? 'navigation is-open' : 'navigation'}>
      <a href={home('#work')} onClick={() => setMenuOpen(false)}>Featured work</a>
      <a href={home('#about')} onClick={() => setMenuOpen(false)}>About me</a>
      <a href={siteUrl('/more-work.html')} aria-current={archivePage ? 'page' : undefined} onClick={() => setMenuOpen(false)}>More work</a>
      <a className="header-contact" href={home('#contact')} onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={17}/></a>
    </nav>
  </header>;
}

function Hero() {
  return <section className="hero wrap" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="eyebrow"><span className="small-star">✳</span> MARKETING & MULTIMEDIA</p>
      <h1 id="hero-title">Ideas with purpose.<br/>Visuals with <em>feeling.</em></h1>
      <p className="hero-intro">Hi, I’m Hannah.<span className="wave" aria-hidden="true">✧</span></p>
      <p className="hero-description">I bring stories to life through thoughtful pacing, visuals, and sound, with a background in marketing and multimedia design.</p>
      <div className="hero-actions"><a className="button button-dark" href="#work">Explore my work <ArrowDownIcon/></a><a className="text-link" href="#contact">Get in touch <ArrowUpRight size={18}/></a></div>
      <div className="hero-location"><span className="location-dot"/><span>BASED IN THE PHILIPPINES</span></div>
    </div>
    <div className="hero-visual">
      <div className="portrait-outline" aria-hidden="true"/>
      <div className="portrait-frame"><img src={siteUrl('/media/hannah-960.webp')} srcSet={`${siteUrl('/media/hannah-480.webp')} 480w, ${siteUrl('/media/hannah-960.webp')} 960w, ${siteUrl('/media/hannah-1600.webp')} 1600w`} sizes="(max-width: 720px) 85vw, 40vw" alt="Hannah Michelle Gabion" fetchPriority="high" width="960" height="720"/></div>
      <Flourish className="hero-star"/>
      <div className="portrait-note"><span className="note-line"/>A little strategy.<br/><em>A lot of heart.</em></div>
      <div className="portrait-caption"><span>CREATIVE MIND. CURIOUS HEART.</span><span>01 — HELLO</span></div>
    </div>
  </section>;
}
function ArrowDownIcon() { return <ArrowRight className="diagonal-down" size={18}/>; }

function PracticeStrip() {
  return <div className="practice-strip" aria-label="Creative disciplines"><div className="wrap practice-inner"><span>Marketing with intention</span><Flourish/><span>Design with personality</span><Flourish/><span>Stories in motion</span><Flourish/></div></div>;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project, trigger: HTMLElement) => void }) {
  const video = project.kind !== 'image';
  return <article className={`project-card ${video ? 'video-card' : 'design-card'}`}>
    <button className="project-button" onClick={e => onOpen(project, e.currentTarget)}>
      <span className="sr-only">{video ? 'Watch ' : 'View '}</span><div className="project-image">
        <img src={siteUrl(`/media/${project.id}-960.webp`)} {...(!video ? {srcSet:`${siteUrl(`/media/${project.id}-480.webp`)} 480w, ${siteUrl(`/media/${project.id}-960.webp`)} 960w, ${siteUrl(`/media/${project.id}-1600.webp`)} 1600w`, sizes:'(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 40vw'} : {})} alt="" loading="lazy" width={media[project.id]?.width || 960} height={media[project.id]?.height || 540}/>
        <span className="project-type">{video ? <><Film size={13}/> {project.kind === 'youtube' ? 'FILM & VIDEO' : 'VIDEO EDITING'}</> : <><ImageIcon size={13}/> GRAPHIC DESIGN</>}</span>
        {video ? <><span className="play-icon"><Play size={23} fill="currentColor"/></span><span className="duration">{durationFor(project)}</span></> : <span className="expand-icon"><Plus size={23}/></span>}
      </div>
      <div className="project-info"><div><span className="project-label">{project.label}</span><h3>{project.title}</h3><span className="project-credit">{editingCreditFor(project)}</span></div><ArrowUpRight size={23} className="project-arrow"/></div>
    </button>
  </article>;
}

function Filters({ value, setValue }: { value: 'All' | Category; setValue: (v: 'All' | Category) => void }) {
  return <div className="filters" role="group" aria-label="Filter work by type">{(['All','Video','Design'] as const).map(v => <button key={v} aria-pressed={value === v} className={value === v ? 'filter active' : 'filter'} onClick={() => setValue(v)}>{v === 'All' ? 'All work' : v === 'Video' ? 'Film & video' : 'Graphic design'}{v === 'All' && <span className="filter-dot"/>}</button>)}</div>;
}

function FeaturedWork({ onOpen }: { onOpen: (p: Project, trigger: HTMLElement) => void }) {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const visible = featured.filter(p => filter === 'All' || p.category === filter);
  return <section className="work-section wrap section-space" id="work" aria-labelledby="work-heading">
    <div className="section-topline"><p className="eyebrow">01 / FEATURED WORK</p><span className="aside-label">A FEW THINGS I’VE PUT MY HEART INTO</span></div>
    <div className="section-heading-row"><h2 id="work-heading">From an idea<br/>to <em>something real.</em></h2><p>Video editing is my strongest creative skill. Explore my video edits, graphics, and visual stories.</p></div>
    <Filters value={filter} setValue={setFilter}/>
    <p className="sr-only" aria-live="polite">{visible.length} featured projects shown.</p>
    <div className="projects-grid">{visible.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen}/>)}</div>
    <div className="more-work-invitation"><div className="folder-symbol"><FolderOpen size={26}/></div><div><h3>There’s more where that came from.</h3><p>Explore the projects, experiments, and edits in my creative folders.</p></div><a className="text-link" href={siteUrl('/more-work.html')}>Open my folders <ArrowUpRight size={19}/></a></div>
  </section>;
}

function WebProjects({ onOpen }: { onOpen: (p: Project, trigger: HTMLElement) => void }) {
  return <section className="web-projects-section" id="web-projects" aria-labelledby="web-projects-heading"><div className="wrap">
    <div className="section-topline"><p className="eyebrow">02 / WEB PROJECTS</p><Flourish className="tiny-flourish"/></div>
    <div className="section-heading-row"><h2 id="web-projects-heading">Ideas you can<br/><em>click through.</em></h2><p>A couple of ways I’ve explored bringing content, design, and navigation together on the web.</p></div>
    <div className="web-projects-grid">{webProjects.map(project => <article className="web-project" key={project.id}>
      <a className="web-preview" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.title} website (opens in a new tab)`}><img src={project.preview} alt={project.previewAlt} width="1280" height="800" loading="lazy"/><span className="web-preview-icon"><ArrowUpRight size={23}/></span></a>
      <div className="web-project-content"><span className="eyebrow">{project.platform}</span><h3>{project.title}</h3><p>{project.description}</p><p className="web-role">{project.role}</p><div className="web-project-actions"><a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">Explore website <ArrowUpRight size={17}/><span className="sr-only"> — {project.title}, opens in a new tab</span></a>{project.relatedVideoId && <button className="text-link" onClick={e => {const video=projects.find(p=>p.id===project.relatedVideoId);if(video) onOpen(video,e.currentTarget);}}>Watch navigation video <Play size={15}/></button>}</div></div>
    </article>)}</div>
  </div></section>;
}

function About() {
  return <section className="about-section" id="about" aria-labelledby="about-heading"><div className="wrap about-grid">
    <div className="about-heading"><p className="eyebrow">03 / THE PERSON BEHIND THE PIXELS</p><h2 id="about-heading">A marketer’s mind.<br/>A creative’s <em>eye.</em></h2><Flourish className="about-star"/><p className="about-signature">Hannah Michelle.</p></div>
    <div className="about-copy"><p className="about-lead">I’m Hannah Michelle E. Gabion, a marketing and multimedia design student at FEU Diliman.</p><p>I enjoy finding the connection between a good idea and the way people experience it. Sometimes that means shaping a story in an edit. Other times, it’s finding the right layout, colour, or visual to make a message click.</p><p>Video editing is where I feel most at home: shaping a story, finding its rhythm, and bringing the pieces together. I also enjoy graphic design, digital marketing, and exploring websites with HTML, CSS, and Hostinger.</p><div className="about-facts"><div><span>MY FOUNDATION</span><strong>Marketing & Multimedia Design</strong><p>BS Business Administration · FEU Diliman<br/>August 2023 – present</p></div><div><span>MY APPROACH</span><strong>Thoughtful, curious, collaborative.</strong><p>From the first idea to the final little detail.</p></div></div><a className="text-link" href={identity.resume} target="_blank" rel="noopener noreferrer">Get to know me on paper <Download size={17}/><span className="sr-only"> — résumé PDF, opens in a new tab</span></a></div>
  </div></section>;
}

function Experience() {
  return <section className="experience-section wrap section-space" id="experience" aria-labelledby="experience-heading"><div className="section-topline"><p className="eyebrow">04 / ALONG THE WAY</p><Flourish className="tiny-flourish"/></div><div className="experience-grid"><div><h2 id="experience-heading">Learning by doing.<br/><em>Growing through creating.</em></h2><p className="section-description">The experiences and milestones that have shaped how I work.</p><a className="text-link" href="https://paraverse.feutech.edu.ph/briefcase/profile/270013202D" target="_blank" rel="noopener noreferrer">More on Briefcase <ArrowUpRight size={17}/><span className="sr-only"> (opens in a new tab)</span></a></div><div className="experience-list">
      <div className="experience-item"><span className="experience-year">2026 — PRESENT</span><h3>Freelance Video Editor</h3><p>Editing short-form video advertisements and content for freelance clients.</p></div>
      <div className="experience-item"><span className="experience-year">2020 — 2022</span><h3>Livestreaming & Technical Support</h3><p>SRAP Social Communications Ministry</p></div>
      <div className="experience-item award-item"><span className="experience-year">SELECTED RECOGNITION</span><h3>Stories worth celebrating.</h3><ul><li><span>2026</span><div>PelikulAds — Best Cinematography<small>1st Runner-Up · FEU Diliman Junior Marketing Association</small></div></li><li><span>2025</span><div>Best in Formal Advertisement<small>3rd Business Innovation Week · FEU Diliman</small></div></li><li><span>2024</span><div>Top Performing Student<small>Academic Year 2023–2024 · FEU Diliman</small></div></li></ul></div>
      <div className="certifications"><span className="experience-year">A FEW MORE TOOLS IN MY KIT</span><p>Certified Digital Marketing Professional <span>·</span> IT Specialist — HTML & CSS <span>·</span> Customer Service Foundations</p></div>
    </div></div></section>;
}

function Toolkit() {
  return <section className="toolkit-section" aria-labelledby="toolkit-heading"><div className="wrap"><div className="toolkit-header"><div><p className="eyebrow">05 / MY CREATIVE TOOLKIT</p><h2 id="toolkit-heading">Good ideas. <em>Favourite tools.</em></h2></div><p>The apps behind the edits,<br/>the layouts, and the little details.</p></div><div className="toolkit-grid">{tools.map(tool => <div className="tool-card" key={tool.logo}><img src={siteUrl(`/logos/${tool.logo}.svg`)} alt="" width="48" height="48" loading="lazy"/><h3>{tool.name}</h3><p>{tool.detail}</p></div>)}</div></div></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  async function copyEmail() { try { await navigator.clipboard.writeText(identity.email); setCopied(true); setCopyFailed(false); window.setTimeout(() => setCopied(false), 3500); } catch { setCopyFailed(true); } }
  return <section className="contact-section wrap section-space" id="contact" aria-labelledby="contact-heading"><div className="contact-intro"><p className="eyebrow">06 / LET’S MAKE SOMETHING</p><h2 id="contact-heading">Have a story in mind?<br/>Let’s bring it <em>to life.</em></h2><p>I’d love to hear your ideas, talk about a project,<br className="desktop-break"/> or simply connect.</p></div><div className="contact-card"><Flourish className="contact-star"/><a className="contact-email" href={`mailto:${identity.email}`}><Mail size={20}/><span>{identity.email}</span><ArrowUpRight size={20}/></a><div className="contact-details"><a href={`tel:${identity.tel}`}><Phone size={17}/>{identity.phone}</a><span><MapPin size={17}/>{identity.location}</span></div><div className="contact-actions"><a className="button button-dark" href={`mailto:${identity.email}`}>Say hello <ArrowUpRight size={18}/></a><button className="copy-email" onClick={copyEmail}>{copied ? 'Email copied ✓' : 'Copy email address'}</button></div><p className="sr-only" role="status">{copied ? 'Email address copied to clipboard.' : copyFailed ? `Copy is unavailable. The email address is ${identity.email}.` : ''}</p></div></section>;
}

function Footer() {
  return <footer className="site-footer wrap"><a href={siteUrl('/')} className="footer-signature" aria-label="hannah. — home">hannah<span>.</span></a><p>Made with intention, and a little pink.</p><div className="social-links">{identity.socials.map(s => <a href={s.url} key={s.label} target="_blank" rel="noopener noreferrer">{s.label}<ArrowUpRight size={13}/><span className="sr-only"> (opens in a new tab)</span></a>)}</div><span className="copyright">© {new Date().getFullYear()} HANNAH GABION</span></footer>;
}

function Archive({ onOpen }: { onOpen: (p: Project, trigger: HTMLElement) => void }) {
  const initialCollection = new URLSearchParams(window.location.search).get('collection') === 'freelance' ? 'Freelance Works' : 'School Projects';
  const [collection, setCollection] = useState<Collection>(initialCollection);
  const [filter, setFilter] = useState<'All' | Category>('All');
  const visible = archived.filter(p => p.collection === collection && (filter === 'All' || p.category === filter));
  const changeCollection = (next: Collection) => { setCollection(next); const url = new URL(window.location.href); url.searchParams.set('collection', next === 'School Projects' ? 'school' : 'freelance'); history.replaceState({}, '', url); };
  return <main id="main" className="archive-main wrap" tabIndex={-1}><a href={siteUrl('/#work')} className="text-link back-link"><ArrowLeft size={17}/> Back to featured work</a><div className="section-topline"><p className="eyebrow">THE CREATIVE FOLDERS</p><span className="aside-label">MORE IDEAS. MORE EXPLORING.</span></div><div className="section-heading-row"><h1>There’s always<br/><em>a little more.</em></h1><p>A home for the projects, variations, and experiments beyond my featured work.</p></div><div className="collection-folders" role="group" aria-label="Choose a work collection">{(['School Projects','Freelance Works'] as const).map(c => <button key={c} className={collection === c ? 'collection-folder selected' : 'collection-folder'} aria-pressed={collection === c} onClick={() => changeCollection(c)}><FolderOpen size={27}/><div><strong>{c}</strong><span>{archived.filter(p => p.collection === c).length} projects</span></div><ArrowUpRight size={20}/></button>)}</div><div className="archive-filter-row"><h2>{collection}</h2><Filters value={filter} setValue={setFilter}/></div><p className="sr-only" aria-live="polite">{visible.length} projects shown in {collection}.</p><div className="projects-grid archive-grid">{visible.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpen}/>)}</div>{visible.length === 0 && <div className="empty-state"><Sparkles/><h3>A different kind of creativity.</h3><p>This folder has no {filter.toLowerCase()} projects. Try another filter.</p><button className="text-link" onClick={() => setFilter('All')}>Show all work <ArrowRight size={17}/></button></div>}<div className="archive-bottom"><p>Looking for a particular project?</p><a className="text-link" href={siteUrl('/#contact')}>Let’s talk <ArrowUpRight size={17}/></a></div></main>;
}

type Transcript = { language: string; reviewStatus: string; segments: { start: number; end: number; text: string }[] };
function VideoPlayer({ project, transcript }: { project: Project; transcript: Transcript | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    let hls: import('hls.js').default | undefined;
    let recoveries = 0;
    const src = siteUrl(`/media/video/${project.id}/stream.m3u8`);
    setError('');
    const fail = () => setError('The video could not load. Check your connection and try again.');
    if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = src; video.addEventListener('error', fail); }
    else {
      import('hls.js').then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) { setError('This browser cannot play this video. Please try a current version of Chrome, Firefox, Edge, or Safari.'); return; }
        hls = new Hls({ maxBufferLength: 20, maxMaxBufferLength: 30 });
        hls.loadSource(src); hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => { if (!data.fatal) return; if (data.type === Hls.ErrorTypes.MEDIA_ERROR && recoveries++ < 1) hls?.recoverMediaError(); else { hls?.destroy(); fail(); } });
      }).catch(fail);
    }
    return () => { cancelled = true; video.pause(); hls?.destroy(); video.removeEventListener('error', fail); video.removeAttribute('src'); video.load(); };
  }, [project.id, retry]);
  return <div className="local-player"><video ref={videoRef} controls playsInline preload="metadata" controlsList="nodownload" poster={siteUrl(`/media/${project.id}-960.webp`)} aria-label={project.title} crossOrigin="anonymous">{transcript && <track key={`${project.id}-${transcript.language}`} kind="captions" src={siteUrl(`/captions/${project.id}.vtt`)} srcLang={transcript.language} label={transcript.language === 'tl' ? 'Filipino' : 'English'} default/>}</video>{error && <div className="player-error" role="alert"><p>{error}</p><button className="button button-dark" onClick={() => setRetry(v => v + 1)}>Retry video</button></div>}</div>;
}

function ProjectDialog({ project, onClose, trigger }: { project: Project; onClose: () => void; trigger: HTMLElement | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptFailed, setTranscriptFailed] = useState(false);
  const [artLoaded, setArtLoaded] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const [youtubeStarted, setYoutubeStarted] = useState(false);
  useEffect(() => {
    const el = dialog.current!;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el.showModal();
    return () => { el.close(); document.body.style.overflow = oldOverflow; if (trigger?.isConnected) trigger.focus({preventScroll:true}); };
  }, [trigger]);
  useEffect(() => {
    if (project.kind === 'image') return;
    const controller = new AbortController();
    fetch(siteUrl(`/captions/${project.id}.json`), {signal:controller.signal}).then(r => { if (!r.ok) throw new Error('Unavailable'); return r.json(); }).then(setTranscript).catch(e => { if (e.name !== 'AbortError') setTranscriptFailed(true); });
    return () => controller.abort();
  }, [project]);
  const isVideo = project.kind !== 'image';
  return <dialog ref={dialog} className={`project-dialog ${isVideo ? 'video-dialog' : 'art-dialog'}`} aria-labelledby="dialog-title" aria-describedby="dialog-description" onCancel={e => {e.preventDefault(); onClose();}} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="dialog-top"><span className="eyebrow">{project.label}</span><button autoFocus className="close-dialog" onClick={onClose} aria-label="Close project"><X size={23}/></button></div>
    <div className="dialog-content">
      <div className="dialog-media">{project.kind === 'youtube' ? <div className="youtube-player">{youtubeStarted ? <iframe src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0&cc_load_policy=1&playsinline=1`} title={`${project.title} video player`} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <button className="youtube-load" onClick={() => setYoutubeStarted(true)} aria-label={`Load video player YouTube — ${project.title}`}><img src={siteUrl(`/media/${project.id}-960.webp`)} alt=""/><span className="youtube-load-label"><span className="play-icon"><Play fill="currentColor" size={26}/></span><span>Load video player</span><small>YouTube</small></span></button>}</div> : project.kind === 'video' ? <VideoPlayer project={project} transcript={transcript}/> : <div className="artwork-view">{!artLoaded && !artFailed && <p className="art-loading" role="status">Loading full-size artwork…</p>}{artFailed ? <p role="alert">The artwork could not load. Please close this viewer and try again.</p> : <img src={siteUrl(`/media/${project.id}-full.webp`)} alt={project.alt} onLoad={() => setArtLoaded(true)} onError={() => setArtFailed(true)} width={media[project.id]?.width} height={media[project.id]?.height}/>}</div>}</div>
      <div className="dialog-description"><div className="dialog-category"><span>{project.collection}</span><span>{project.category === 'Video' ? 'FILM & VIDEO' : 'GRAPHIC DESIGN'}</span></div><h2 id="dialog-title">{project.title}</h2><p className="dialog-credit">{editingCreditFor(project)}</p><p id="dialog-description">{project.description}</p>{project.youtubeId && <a className="text-link" href={`https://www.youtube.com/watch?v=${project.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={16}/><span className="sr-only"> (opens in a new tab)</span></a>}
      {isVideo && <div className="transcript-block">{transcript ? <><button className="transcript-toggle" aria-expanded={transcriptOpen} aria-controls="video-transcript" onClick={() => setTranscriptOpen(!transcriptOpen)}><span><Volume2 size={17}/> Read the transcript</span><ChevronDown className={transcriptOpen ? 'rotated' : ''} size={18}/></button>{transcript.reviewStatus === 'machine-draft' && <p className="caption-note">Automatic captions may contain errors.</p>}{transcriptOpen && <div id="video-transcript" className="transcript-text" tabIndex={0} aria-label="Video transcript">{transcript.segments.length ? transcript.segments.map((s, i) => <p key={i}><time>{Math.floor(s.start/60)}:{String(Math.floor(s.start%60)).padStart(2,'0')}</time><span>{s.text}</span></p>) : <p>No spoken dialogue in this video.</p>}</div>}</> : transcriptFailed ? <p className="caption-note">{project.kind === 'youtube' ? 'Use the CC button in the YouTube player to check available captions.' : 'The transcript could not load. Please reopen this project to try again.'}</p> : <p className="caption-note" role="status">Loading transcript…</p>}</div>}
      </div>
    </div>
  </dialog>;
}

function App() {
  const initial = projects.find(p => p.id === new URLSearchParams(location.search).get('project')) ?? null;
  const [selected, setSelected] = useState<Project | null>(initial);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    document.title = archivePage ? 'More Work — Hannah Gabion' : 'Hannah Gabion — Marketing & Multimedia';
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);} }), {threshold: .08});
    document.querySelectorAll('.section-heading-row, .about-grid, .experience-grid, .toolkit-header, .contact-section').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
    const pop = () => setSelected(projects.find(p => p.id === new URLSearchParams(location.search).get('project')) ?? null);
    window.addEventListener('popstate',pop);
    return () => { observer.disconnect(); window.removeEventListener('popstate',pop); };
  }, []);
  const open = (project: Project, element: HTMLElement) => {trigger.current = element; setSelected(project); const url = new URL(location.href); url.searchParams.set('project', project.id); history.pushState({},'',url);};
  const close = () => {setSelected(null); const url = new URL(location.href); url.searchParams.delete('project'); history.replaceState({},'',url);};
  return <><a className="skip-link" href="#main">Skip to content</a><Header/>{archivePage ? <Archive onOpen={open}/> : <main id="main" tabIndex={-1}><Hero/><PracticeStrip/><FeaturedWork onOpen={open}/><WebProjects onOpen={open}/><About/><Experience/><Toolkit/><Contact/></main>}<Footer/>{selected && <ProjectDialog key={selected.id} project={selected} trigger={trigger.current} onClose={close}/>}</>;
}

createRoot(document.getElementById('root')!).render(<App/>);
