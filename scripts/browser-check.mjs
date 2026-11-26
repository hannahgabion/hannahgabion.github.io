import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
await mkdir('.qa',{recursive:true});
const report={checks:[],accessibility:[],errors:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 async function goto(route='/'){await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:60000});await page.locator('h1').waitFor();}
 async function axe(name){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();report.accessibility.push({name,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))});}
 await goto();
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.project-card').count(),9);
 assert.equal(await page.locator('iframe').count(),0,'YouTube must not load before a request.');
 assert.equal(await page.locator('video').count(),0,'Local video must not load before a request.');
 await axe('Home desktop');
 await page.getByRole('button',{name:'Graphic design',exact:true}).click();
 assert.equal(await page.locator('.project-card').count(),5);
 const art=page.getByRole('button',{name:/Himala/});
 await art.click();await page.getByRole('dialog').waitFor();
 await axe('Artwork viewer');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog').count(),0);
 assert(await art.evaluate(el=>el===document.activeElement),'Closing a viewer restores focus.');
 report.checks.push('Category filters, artwork viewer, Escape, and focus restoration');
 await page.getByRole('button',{name:'Film & video',exact:true}).click();
 assert.equal(await page.locator('.project-card').count(),4);
 for(const title of ['Save Me a Drink','Barbershop Ad','Bite the Beach']){
  await page.getByRole('button',{name:new RegExp(title)}).click();
  await page.locator('.youtube-load').click();
  const frame=page.locator('iframe');await frame.waitFor();
  assert((await frame.getAttribute('src')).includes('youtube-nocookie.com/embed/'));
  assert(!(await frame.getAttribute('src')).includes('autoplay=1'));
  await page.getByRole('button',{name:'Read the transcript',exact:false}).waitFor();
  await page.getByRole('button',{name:'Close project',exact:true}).click();
 }
 report.checks.push('All three YouTube embeds load on request, with transcripts and no autoplay');
 await goto('/more-work.html');
 assert.equal(await page.locator('.project-card').count(),6);
 assert.equal(await page.locator('.project-card').filter({hasText:/Gabion family bonding/i}).count(),0);
 for(const [title,id] of [['Understanding Ourselves - Podcast','NmcSOrDYlUo'],['LARA Website Navigation AVP','QJyWCqNArBw'],['OBLICON','yPJe4zwgHf0']]){
  const card=page.locator('.project-button').filter({hasText:title});
  await card.scrollIntoViewIfNeeded();
  await card.locator('img').evaluate(img=>img.decode());
  assert.equal(await card.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0),true,`${title} thumbnail loads.`);
  await card.click();
  await page.locator('.youtube-load').click();
  assert((await page.locator('iframe').getAttribute('src')).includes(`/embed/${id}`));
  await page.getByRole('button',{name:'Read the transcript',exact:false}).click();
  assert(await page.locator('#video-transcript').isVisible());
  await page.keyboard.press('Escape');
 }
 report.checks.push('Three additional YouTube videos in the school archive, with thumbnails, embeds and transcripts; family video excluded');
 await axe('More work school collection');
 await page.getByRole('button',{name:/Freelance Works 9 projects/}).click();
 assert.equal(await page.locator('.project-card').count(),9);
 await page.getByRole('button',{name:'Graphic design',exact:true}).click();
 assert.equal(await page.locator('.project-card').count(),6);
 report.checks.push('Both archive collections and category filtering');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});await goto();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`No horizontal overflow at ${width}px.`);
  await page.screenshot({path:`.qa/home-${width}.png`});
  if(width===390){
   await page.getByRole('button',{name:'Open navigation',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'Close navigation',exact:true}).getAttribute('aria-expanded'),'true');
   await page.keyboard.press('Escape');
   await axe('Home mobile');
  }
 }
 report.checks.push('320, 390, 768, 1440px layouts; mobile menu; reduced motion');
 // 640 CSS pixels approximates 200% browser zoom on a 1280px viewport.
 await page.setViewportSize({width:640,height:450});await goto();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 report.checks.push('200% equivalent layout reflow');
 await page.setViewportSize({width:1440,height:1000});
 const local=process.env.PORTFOLIO_SKIP_MEDIA ? [] : ['pricing-strategy','ethics','documentary','freelance-01','freelance-02','antiklo'];
 for(const id of local){
  await goto(`/?project=${id}`);
  const video=page.locator('video');await video.waitFor();
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&v.readyState>=1;},{},{timeout:45000});
  assert.equal(await video.evaluate(v=>v.paused),true,'No autoplay.');
  await video.evaluate(v=>{v.muted=true;return v.play();});
  await page.waitForFunction(()=>document.querySelector('video').currentTime>.2,{},{timeout:30000});
  const result=await video.evaluate(async v=>{v.pause();const target=Math.min(20,v.duration/2);v.currentTime=target;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));return {duration:v.duration,time:v.currentTime,tracks:v.textTracks.length};});
  assert(result.time>1&&result.duration>1);assert(result.tracks>0,`${id} has a caption track.`);
  await page.getByRole('button',{name:'Read the transcript',exact:false}).click();
  assert(await page.locator('#video-transcript').isVisible());
  if(id==='pricing-strategy') {
   await axe('Local video player and transcript');
   const fullscreen=await video.evaluate(async v=>{try{await v.requestFullscreen();const active=document.fullscreenElement===v;await document.exitFullscreen();return active;}catch{return false;}});
   assert(fullscreen,'Fullscreen enters and exits successfully.');
   report.checks.push('Native fullscreen enter/exit');
  }
  await page.keyboard.press('Escape');assert.equal(await page.locator('video').count(),0);
  report.checks.push(`${id}: metadata, playback, seeking, captions, transcript, player removal on close`);
 }
 assert.equal(report.errors.length,0,'No application exceptions.');
 await writeFile('.qa/browser-report.json',JSON.stringify(report,null,2));
 const violations=report.accessibility.flatMap(r=>r.violations);
 console.log(JSON.stringify(report,null,2));
 assert.equal(violations.length,0,'Accessibility checks must pass.');
}finally{await writeFile('.qa/browser-report.json',JSON.stringify(report,null,2));await browser.close();}
