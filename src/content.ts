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
export const projects: Project[] = [
  { id:'save-me-a-drink',title:'Save Me a Drink',category:'Video',kind:'youtube',collection:'School Projects',label:'Film trailer',description:'A promotional trailer that brings a story into focus through pacing, visual transitions, and the rhythm of an edit.',alt:'Thumbnail for the Save Me a Drink film trailer',featured:true,youtubeId:'AKGZ4RsqTAw',duration:'2:02' },
  { id:'barbershop',title:'The barbershop edit',category:'Video',kind:'youtube',collection:'School Projects',label:'Advertisement',description:'A barbershop advertisement, bringing service, atmosphere, and brand personality together on screen.',alt:'Thumbnail for the barbershop advertisement',featured:true,youtubeId:'IxjIiXCaXZA',duration:'1:46' },
  { id:'bite-the-beach',title:'Bite the Beach',category:'Video',kind:'youtube',collection:'School Projects',label:'Food & culture vlog',description:'“BITE THE BEACH” — A Food Vlog Exploring Cultures by the Coast. A look at food and the stories that connect it to a place. Edited by me, and produced and filmed with our DM21 team for Purposive Communication.',alt:'Thumbnail for Bite the Beach, a coastal food and culture vlog',featured:true,youtubeId:'c9GAk21ThUQ',duration:'8:54' },
  { id:'pricing-strategy',title:'The strategy behind the price',category:'Video',kind:'video',collection:'School Projects',label:'Pricing strategy video',description:'A school video project exploring IKEA’s use of odd pricing, and how small changes in price can shape the way we see value.',alt:'Preview frame from the Pricing Strategy Video',featured:true },
  { id:'terr atrax'.replace(' ',''),title:'TerraTrax',category:'Design',kind:'image',collection:'School Projects',label:'Brand & promotional design',description:'A promotional poster for TerraTrax, a concept that encourages everyday sustainable actions through a gamified experience. My listed team role: Product Lead.',alt:'Green TerraTrax poster with a mobile app mockup, sustainability messaging, and the project team',featured:true },
  { id:'himala',title:'Himala',category:'Design',kind:'image',collection:'School Projects',label:'Film poster study',description:'A school poster design study for Himala, using a monochrome composition and oversized typography to communicate the film’s dramatic tone.',alt:'Monochrome Himala film poster study featuring Nora Aunor and large serif title lettering',featured:true },
  { id:'hey-babe',title:'Hey Babe!',category:'Design',kind:'image',collection:'School Projects',label:'Film poster study',description:'A school poster design study for Hey Babe!, pairing warm imagery with expressive lettering and a bright, romantic palette.',alt:'Hey Babe! poster study with a smiling couple, green background, and orange script title',featured:true },
  { id:'mothers-day',title:'A thoughtful little gift',category:'Design',kind:'image',collection:'Freelance Works',label:'Mother’s Day campaign',description:'A product advertisement for Sofia & Spritz, built around gifting, soft pinks, and clear product feature callouts.',alt:'Pink Sofia & Spritz crossbody bag in a Mother’s Day advertisement, surrounded by flowers',featured:true },
  { id:'alba-crossbody',title:'Everyday, thoughtfully designed',category:'Design',kind:'image',collection:'Freelance Works',label:'Product advertisement',description:'A feature-led graphic for the Alba Crossbody, using product detail crops and visual callouts to make its features easy to explore.',alt:'Blue Alba Crossbody advertisement showing the bag, interchangeable straps, pockets, and leather detail',featured:true },
  { id:'understanding-ourselves',title:'Understanding Ourselves - Podcast',category:'Video',kind:'youtube',collection:'School Projects',label:'Podcast',description:'A podcast project titled “Understanding Ourselves,” shared from my YouTube channel.',alt:'Thumbnail for Understanding Ourselves - Podcast',youtubeId:'NmcSOrDYlUo',duration:'51:24' },
  { id:'lara-navigation',title:'LARA Website Navigation AVP',category:'Video',kind:'youtube',collection:'School Projects',label:'Website walkthrough',description:'An audiovisual walkthrough of the LARA website and its navigation.',alt:'Thumbnail for the LARA Website Navigation AVP',youtubeId:'QJyWCqNArBw',duration:'7:14' },
  { id:'oblicon',title:'OBLICON',category:'Video',kind:'youtube',collection:'School Projects',label:'School video project',description:'A video project titled “OBLICON,” shared from my YouTube channel.',alt:'Thumbnail for the OBLICON video project',youtubeId:'yPJe4zwgHf0',duration:'11:35' },
  { id:'terr atrax-banner'.replace(' ',''),title:'TerraTrax — the bigger picture',category:'Design',kind:'image',collection:'School Projects',label:'Promotional banner',description:'A companion banner for the TerraTrax school project.',alt:'TerraTrax sustainability project promotional banner' },
  { id:'ethics',title:'An ethics perspective',category:'Video',kind:'video',collection:'School Projects',label:'School video project',description:'A final video project created for an ethics course.',alt:'Preview frame from the ethics final video project' },
  { id:'documentary',title:'A day at Santacruzan',category:'Video',kind:'video',collection:'School Projects',label:'Community documentary',description:'A personal documentary about preparing for and joining a Santacruzan procession, with reflections on culture, community, and understanding the self.',alt:'Hannah in a pink gown during the Santacruzan procession' },
  { id:'freelance-01',title:'A better place for your glasses',category:'Video',kind:'video',collection:'Freelance Works',label:'Short-form product edit',description:'A short product-focused edit showcasing Sofia & Spritz glasses cases.',alt:'Pink Sofia & Spritz glasses case shown beside a cup of coffee' },
  { id:'freelance-02',title:'The electrostatic whiteboard',category:'Video',kind:'video',collection:'Freelance Works',label:'Product video advertisement',description:'A feature-led product advertisement explaining the uses and setup of an electrostatic whiteboard.',alt:'An electrostatic whiteboard being demonstrated on a wall' },
  { id:'antiklo',title:'Antiklo Flexi Light',category:'Video',kind:'video',collection:'Freelance Works',label:'Product video advertisement',description:'A product-focused video advertisement for the Antiklo Flexi Light.',alt:'Preview frame from the Antiklo Flexi Light video advertisement' },
  { id:'leather-comparison',title:'Details that make a difference',category:'Design',kind:'image',collection:'Freelance Works',label:'Product comparison graphic',description:'A side-by-side product comparison graphic for Sofia & Spritz.',alt:'Side-by-side graphic comparing a Sofia & Spritz leather bag with a worn alternative' },
  { id:'sunglasses-case',title:'Small case, big difference',category:'Design',kind:'image',collection:'Freelance Works',label:'Product comparison graphic',description:'A product graphic comparing the size and portability of sunglasses cases.',alt:'Graphic comparing a bulky hard sunglasses case with a slim pink leather case' },
  ...(['a','b','c','d'] as const).map((letter): Project => ({id:`birth-chart-${letter}`,title:`The bag that fits your sign — ${letter.toUpperCase()}`,category:'Design',kind:'image',collection:'Freelance Works',label:'Social advertisement variation',description:'One of four social advertisement variations from a coordinated product campaign.',alt:`Variation ${letter.toUpperCase()} of a Sofia & Spritz campaign pairing bag colours with zodiac elements`})),
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
  { name:'CapCut', logo:'capcut', detail:'Short-form storytelling' },
  { name:'Canva', logo:'canva', detail:'Social & brand content' },
  { name:'Figma', logo:'figma', detail:'Visual & interface design' },
  { name:'Photoshop', logo:'photoshop', detail:'Image & graphic design' },
];
