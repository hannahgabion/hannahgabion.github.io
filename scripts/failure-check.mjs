import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:900},reducedMotion:'reduce'});
 await page.route('**/media/video/pricing-strategy/stream.m3u8',route=>route.fulfill({status:403,body:'Unavailable'}));
 await page.goto('http://127.0.0.1:4173/?project=pricing-strategy',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Retry video',exact:true}).waitFor({timeout:60000});
 assert(await page.getByRole('alert').isVisible());
 await page.unroute('**/media/video/pricing-strategy/stream.m3u8');
 await page.getByRole('button',{name:'Retry video',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1,{},{timeout:30000});
 assert.equal(await page.getByRole('alert').count(),0);
 await page.keyboard.press('Escape');
 await page.route('**/media/himala-full.webp',route=>route.abort());
 await page.goto('http://127.0.0.1:4173/?project=himala',{waitUntil:'domcontentloaded'});
 await page.getByRole('alert').waitFor();
 assert((await page.getByRole('alert').innerText()).includes('artwork could not load'));
 console.log('PASS: failed HLS stream shows a clear error, retry recovers playback, artwork failures show a clear error.');
}finally{await browser.close();}
