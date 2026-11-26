import mediaIndex from './media-index.json';
import { siteUrl } from './paths';

export type Category = 'Video' | 'Design';
export type Collection = 'School Projects' | 'Freelance Works';
export type Project = {
  id: string;
  title: string;
  category: Category;
  kind: 'youtube' | 'video' | 'image';
  collection: Collection;
  label: string;
  description: string;
  alt: string;
  featured?: boolean;
  youtubeId?: string;
  duration?: string;
};
export type WebProject = {
  id: string;
  title: string;
  platform: string;
  description: string;
  role: string;
  href: string;
  preview: string;
  previewAlt: string;
  relatedVideoId?: string;
};
export const webProjects: WebProject[] = [
  {
    id: 'lara-website', title: 'LARA', platform: 'HOSTINGER · ECOMMERCE',
    description: 'An ecommerce website for a clothing brand, created with my team using Hostinger.',
    role: 'Created with my team using Hostinger', href: 'https://lara.ecommerceproj.online/',
    preview: siteUrl('/media/lara-website.webp'), previewAlt: 'Screenshot of the LARA ecommerce website', relatedVideoId: 'lara-navigation',
  },
  {
    id: 'bini-website', title: 'BINI', platform: 'HTML & CSS',
    description: 'A website I built with HTML and CSS, with a home page and individual profiles for all eight BINI members.',
    role: 'HTML & CSS development by me', href: siteUrl('/projects/bini/index.html'),
    preview: siteUrl('/media/bini-website.webp'), previewAlt: 'Screenshot of my BINI HTML and CSS website',
  },
];
export function editingCreditFor(project: Project) {
  return project.category === 'Video' ? 'Video editing by me' : 'Graphic design & editing by me';
}
export const identity = {
  name: 'Hannah Michelle E. Gabion',
  email: 'gabion.hannahmichelle@gmail.com',
  phone: '+63 969 562 6978',
  tel: '+639695626978',
  location: 'Rodriguez, Rizal, Philippines',
  resume: siteUrl('/Hannah-Michelle-Gabion-Resume.pdf'),
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/hanami.gd/' },
    { label: 'YouTube', url: 'https://www.youtube.com/@hannnahmichhelle' },
    { label: 'Facebook', url: 'https://www.facebook.com/hmgabion' },
    { label: 'Briefcase', url: 'https://paraverse.feutech.edu.ph/briefcase/profile/270013202D' },
  ],
};
export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  href: string;
  linkLabel: 'View credential' | 'View on Briefcase';
};
// Titles, issuers, dates and credential links from Hannah's public Briefcase.
export const certifications: Certification[] = [
  {
    id: 'customer-service', title: 'Customer Service Foundations',
    issuer: 'LinkedIn Learning', issued: '2026-07-23',
    href: `${identity.socials.find(s => s.label === 'Briefcase')!.url}#certifications`,
    linkLabel: 'View on Briefcase',
  },
  {
    id: 'digital-marketing', title: 'Certified Digital Marketing Professional (CDMP)',
    issuer: 'East West International Educational Specialists', issued: '2026-07-17',
    href: 'https://www.credly.com/badges/f6764068-465f-4781-b02d-b97c98680bf4',
    linkLabel: 'View credential',
  },
  {
    id: 'html-css', title: 'IT Specialist — HTML and CSS',
    issuer: 'Certiport', issued: '2024-12-03',
    href: 'https://www.credly.com/badges/b78fb0a8-a73e-4265-81ec-404c697f3707/public_url',
    linkLabel: 'View credential',
  },
];
export const projects: Project[] = [
  { id:'save-me-a-drink',title:'Save Me a Drink Trailer',category:'Video',kind:'youtube',collection:'School Projects',label:'Film trailer',description:'A promotional trailer for Save Me a Drink.',alt:'Thumbnail for the Save Me a Drink film trailer',featured:true,youtubeId:'AKGZ4RsqTAw',duration:'2:02' },
  { id:'barbershop',title:'Barbershop Ad',category:'Video',kind:'youtube',collection:'School Projects',label:'Advertisement',description:'A video advertisement for a barbershop.',alt:'Thumbnail for the barbershop advertisement',featured:true,youtubeId:'IxjIiXCaXZA',duration:'1:46' },
  { id:'bite-the-beach',title:'Bite the Beach',category:'Video',kind:'youtube',collection:'School Projects',label:'Food & culture vlog',description:'A food vlog exploring cultures by the coast. Edited by me and produced and filmed with our DM21 team for Purposive Communication.',alt:'Thumbnail for Bite the Beach, a coastal food and culture vlog',featured:true,youtubeId:'c9GAk21ThUQ',duration:'8:54' },
  { id:'pricing-strategy',title:'Pricing Strategy Video',category:'Video',kind:'video',collection:'School Projects',label:'School video project',description:'A school project explaining IKEA’s use of odd pricing and its effect on perceived value.',alt:'Preview frame from the Pricing Strategy Video',featured:true },
  { id:'terr atrax'.replace(' ',''),title:'TerraTrax',category:'Design',kind:'image',collection:'School Projects',label:'Brand & promotional design',description:'A promotional poster for TerraTrax, a concept that encourages everyday sustainable actions through a gamified experience. My listed team role: Product Lead.',alt:'Green TerraTrax poster with a mobile app mockup, sustainability messaging, and the project team',featured:true },
  { id:'himala',title:'Himala Poster',category:'Design',kind:'image',collection:'School Projects',label:'Film poster study',description:'A monochrome film poster design study for Himala.',alt:'Monochrome Himala film poster study featuring Nora Aunor and large serif title lettering',featured:true },
  { id:'hey-babe',title:'Hey Babe! Poster',category:'Design',kind:'image',collection:'School Projects',label:'Film poster study',description:'A film poster design study for the movie Hey Babe!',alt:'Hey Babe! poster study with a smiling couple, green background, and orange script title',featured:true },
  { id:'mothers-day',title:'Mother’s Day Ad',category:'Design',kind:'image',collection:'Freelance Works',label:'Mother’s Day campaign',description:'A Mother’s Day product advertisement for Sofia & Spritz.',alt:'Pink Sofia & Spritz crossbody bag in a Mother’s Day advertisement, surrounded by flowers',featured:true },
  { id:'alba-crossbody',title:'Alba Crossbody Ad',category:'Design',kind:'image',collection:'Freelance Works',label:'Product advertisement',description:'A graphic highlighting the Alba Crossbody’s product features.',alt:'Blue Alba Crossbody advertisement showing the bag, interchangeable straps, pockets, and leather detail',featured:true },
  { id:'understanding-ourselves',title:'Understanding Ourselves - Podcast',category:'Video',kind:'youtube',collection:'School Projects',label:'Podcast',description:'A podcast project titled “Understanding Ourselves,” shared from my YouTube channel.',alt:'Thumbnail for Understanding Ourselves - Podcast',youtubeId:'NmcSOrDYlUo',duration:'51:24' },
  { id:'lara-navigation',title:'LARA Website Navigation AVP',category:'Video',kind:'youtube',collection:'School Projects',label:'Website walkthrough',description:'An audiovisual walkthrough of the LARA website and its navigation.',alt:'Thumbnail for the LARA Website Navigation AVP',youtubeId:'QJyWCqNArBw',duration:'7:14' },
  { id:'oblicon',title:'OBLICON',category:'Video',kind:'youtube',collection:'School Projects',label:'School video project',description:'A video project titled “OBLICON,” shared from my YouTube channel.',alt:'Thumbnail for the OBLICON video project',youtubeId:'yPJe4zwgHf0',duration:'11:35' },
  { id:'terr atrax-banner'.replace(' ',''),title:'TerraTrax Banner',category:'Design',kind:'image',collection:'School Projects',label:'Promotional banner',description:'A companion banner for the TerraTrax school project.',alt:'TerraTrax sustainability project promotional banner' },
  { id:'ethics',title:'Ethics Video Project',category:'Video',kind:'video',collection:'School Projects',label:'School video project',description:'A final video project created for an ethics course.',alt:'Preview frame from the ethics final video project' },
  { id:'documentary',title:'Santacruzan Documentary',category:'Video',kind:'video',collection:'School Projects',label:'Community documentary',description:'A personal documentary about preparing for and joining a Santacruzan procession, with reflections on culture, community, and understanding the self.',alt:'Hannah in a pink gown during the Santacruzan procession' },
  { id:'freelance-01',title:'Sofia & Spritz Glasses Case',category:'Video',kind:'video',collection:'Freelance Works',label:'Short-form product edit',description:'A short product video showcasing Sofia & Spritz glasses cases.',alt:'Pink Sofia & Spritz glasses case shown beside a cup of coffee' },
  { id:'freelance-02',title:'Electrostatic Whiteboard Ad',category:'Video',kind:'video',collection:'Freelance Works',label:'Product video advertisement',description:'A product advertisement explaining the uses and setup of an electrostatic whiteboard.',alt:'An electrostatic whiteboard being demonstrated on a wall' },
  { id:'antiklo',title:'Antiklo Flexi Light',category:'Video',kind:'video',collection:'Freelance Works',label:'Product video advertisement',description:'A product-focused video advertisement for the Antiklo Flexi Light.',alt:'Preview frame from the Antiklo Flexi Light video advertisement' },
  { id:'leather-comparison',title:'Leather Bag Comparison',category:'Design',kind:'image',collection:'Freelance Works',label:'Product comparison graphic',description:'A side-by-side product comparison graphic for Sofia & Spritz.',alt:'Side-by-side graphic comparing a Sofia & Spritz leather bag with a worn alternative' },
  { id:'sunglasses-case',title:'Sunglasses Case Comparison',category:'Design',kind:'image',collection:'Freelance Works',label:'Product comparison graphic',description:'A product graphic comparing the size and portability of sunglasses cases.',alt:'Graphic comparing a bulky hard sunglasses case with a slim pink leather case' },
  ...(['a','b','c','d'] as const).map((letter): Project => ({id:`birth-chart-${letter}`,title:`Zodiac Bag Campaign — ${letter.toUpperCase()}`,category:'Design',kind:'image',collection:'Freelance Works',label:'Social advertisement variation',description:'One of four social advertisement variations for a Sofia & Spritz product campaign.',alt:`Variation ${letter.toUpperCase()} of a Sofia & Spritz campaign pairing bag colours with zodiac elements`})),
];

type MediaMetadata = { width: number; height: number; duration?: number; sourceFile?: string };
export const media = mediaIndex as Record<string, MediaMetadata>;
export function durationFor(project: Project) {
  if (project.duration) return project.duration;
  const seconds = Math.round(media[project.id]?.duration ?? 0);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export const tools = [
  { name:'Premiere Pro', logo:'premiere-pro', detail:'Video editing' },
  { name:'CapCut', logo:'capcut', detail:'Short-form video editing' },
  { name:'Canva', logo:'canva', detail:'Social & brand content' },
  { name:'Figma', logo:'figma', detail:'Visual & interface design' },
  { name:'Photoshop', logo:'photoshop', detail:'Image & graphic design' },
];
