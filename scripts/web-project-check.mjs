import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const report={checks:[],accessibility:[]};
await mkdir('.qa',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function audit(name,target=page){const r=await new AxeBuilder({page:target}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();report.accessibility.push({name,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});}
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 await page.getByRole('heading',{name:'Video editing. Graphic design.'}).waitFor();
 assert(await page.locator('.hero-description').innerText().then(t=>!t.includes('Video editing is my strongest creative skill.')));
 assert(await page.locator('#work .section-heading-row>p').innerText().then(t=>t.includes('Video editing is my strongest creative skill.')));
 assert.equal(await page.getByRole('link',{name:'Featured work',exact:true}).count(),1);
 assert.equal(await page.getByText(/selected work/i).count(),0);
 assert.equal(await page.locator('.project-card').count(),9);
 assert.equal(await page.locator('.video-card .project-credit').filter({hasText:'Video editing by me'}).count(),4);
 assert.equal(await page.locator('.design-card .project-credit').filter({hasText:'Graphic design & editing by me'}).count(),5);
 assert.equal(await page.locator('.web-project').count(),2);
 const lara=page.locator('.web-project').filter({has:page.getByRole('heading',{name:'LARA',exact:true})});
 assert.equal(await lara.getByRole('link',{name:/Explore website/}).getAttribute('href'),'https://lara.ecommerceproj.online/');
 assert.equal(await lara.getByRole('link',{name:/Explore website/}).getAttribute('target'),'_blank');
 await lara.getByRole('button',{name:/Watch navigation video/}).click();
 assert(await page.getByRole('heading',{name:'LARA Website Navigation AVP',exact:true}).isVisible());
 assert.equal(await page.locator('.dialog-credit').innerText(),'Video editing by me');
 await page.keyboard.press('Escape');
 await page.locator('#web-projects').scrollIntoViewIfNeeded();
 await page.locator('.web-preview img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 await page.screenshot({path:'.qa/web-projects-desktop.png'});
 await audit('Portfolio with web projects and editing credits');
 report.checks.push('Featured work terminology, editing emphasis, visible credits, website links and related LARA video');
 const biniCard=page.locator('.web-project').filter({has:page.getByRole('heading',{name:'BINI',exact:true})});
 const popupPromise=page.waitForEvent('popup');
 await biniCard.getByRole('link',{name:/Explore website/}).click();
 const bini=await popupPromise;await bini.waitForLoadState('load');
 assert.equal(bini.url(),base+'/projects/bini/index.html');
 const members=['Aiah','Colet','Gwen','Maloi','Jhoanna','Mikha','Sheena','Stacey'];
 async function imagesOK(){await bini.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));assert.equal(await bini.locator('img').evaluateAll(imgs=>imgs.some(i=>i.naturalWidth===0)),false);}
 await imagesOK();await audit('BINI home',bini);
 for(const member of members){
  await bini.getByRole('navigation').getByRole('link',{name:member,exact:true}).click();
  await bini.waitForLoadState('load');await imagesOK();
  assert.equal(await bini.locator('h1').count(),1);
  assert((await bini.locator('h1').innerText()).startsWith(member));
  assert.equal(await bini.getByRole('navigation').getByRole('link',{name:member,exact:true}).getAttribute('aria-current'),'page');
  assert.equal(await bini.locator('form,input[type=password],marquee').count(),0);
 }
 report.checks.push('BINI opens in a new tab; all eight member pages, correct active links, photos, and direct access work');
 for(const width of [320,390,768,1440]){
  await bini.setViewportSize({width,height:900});
  assert.equal(await bini.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.setViewportSize({width,height:900});await page.locator('#web-projects').scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width===390){await page.screenshot({path:'.qa/web-projects-mobile.png'});await audit('BINI member mobile',bini);await bini.screenshot({path:'.qa/bini-member-mobile.png'});}
 }
 await bini.getByRole('link',{name:'Return to Hannah’s portfolio',exact:true}).first().click();
 await bini.getByRole('heading',{name:'Website projects.'}).waitFor();
 await bini.goto(base+'/projects/bini/login.html',{waitUntil:'load'});
 assert.equal(await bini.locator('input,form').count(),0);
 await audit('BINI welcome page',bini);
 await bini.getByRole('link',{name:'Explore BINI',exact:true}).click();await imagesOK();
 await bini.setViewportSize({width:320,height:800});
 assert.equal(await bini.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await audit('BINI home mobile',bini);
 report.checks.push('320/390/768/1440px layouts, portfolio return links, and welcome page without credentials');
 assert.equal(errors.length,0);
 assert.equal(report.accessibility.flatMap(a=>a.violations).length,0,JSON.stringify(report.accessibility));
 console.log(JSON.stringify(report,null,2));
}finally{await writeFile('.qa/web-project-report.json',JSON.stringify(report,null,2));await browser.close();}
