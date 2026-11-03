import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const metadata = JSON.parse(fs.readFileSync('src/media-index.json','utf8'));
let source = fs.readFileSync('src/content.ts','utf8').replace("import mediaIndex from './media-index.json';", `const mediaIndex = ${JSON.stringify(metadata)};`).replace("import { siteUrl } from './paths';", "const siteUrl = path => path;");
const compiled = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {projects,identity} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
assert.equal(projects.length,24,'All eighteen local works and six YouTube works must be listed.');
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Project IDs must be unique.');
assert.equal(projects.filter(p=>p.featured).length,9);
assert.equal(projects.filter(p=>p.featured&&p.category==='Video').length,4);
assert.equal(projects.filter(p=>p.kind==='image').length,12);
assert.equal(projects.filter(p=>p.kind==='video').length,6);
assert.equal(projects.filter(p=>p.kind==='youtube').length,6);
assert(!projects.some(p=>p.youtubeId==='mFQQlJleQos'||/gabion family bonding/i.test(p.title)),'The family bonding video must remain excluded.');
for(const id of ['NmcSOrDYlUo','QJyWCqNArBw','yPJe4zwgHf0']){
 const p=projects.find(p=>p.youtubeId===id);
 assert(p&&!p.featured&&p.collection==='School Projects','Additional YouTube work belongs in the school archive.');
}
assert(fs.existsSync(`public${identity.resume}`),'Downloadable résumé exists.');
assert.equal(fs.readFileSync(`public${identity.resume}`).subarray(0,5).toString(),'%PDF-');
for(const p of projects){
 assert(p.title && p.alt && p.description && p.collection);
 assert(fs.existsSync(`public/media/${p.id}-960.webp`),`${p.id} has a thumbnail.`);
 if(p.kind==='image') assert(fs.existsSync(`public/media/${p.id}-full.webp`),`${p.id} has full artwork.`);
 if(p.kind!=='image'){
  const transcript=JSON.parse(fs.readFileSync(`public/captions/${p.id}.json`,'utf8'));
  assert(Array.isArray(transcript.segments));
  let previous=-1;
  for(const segment of transcript.segments){assert(segment.start>=previous);assert(segment.end>segment.start);assert(segment.text.trim());previous=segment.start;}
 }
 if(p.kind==='video'){
  const folder=`public/media/video/${p.id}`;
  const playlist=fs.readFileSync(`${folder}/stream.m3u8`,'utf8');
  assert(playlist.includes('#EXT-X-ENDLIST'),`${p.id} must be completely encoded.`);
  for(const segment of playlist.split(/\r?\n/).filter(l=>l&&!l.startsWith('#'))){
   const stat=fs.statSync(path.join(folder,segment));assert(stat.size>0&&stat.size<25*1024*1024,`${p.id} segment within hosting limits.`);
  }
  assert(fs.readFileSync(`public/captions/${p.id}.vtt`,'utf8').startsWith('WEBVTT'));
 }
}
const localFiles=projects.filter(p=>p.kind!=='youtube').map(p=>metadata[p.id].sourceFile.replaceAll('\\','/'));
assert.equal(new Set(localFiles).size,18,'Every local work appears exactly once.');
for(const dir of ['SCHOOL PROJECTS','FREELANCE WORKS']){
 const sourceRoot=path.join('..',dir);
 if(fs.existsSync(sourceRoot)){
  for(const file of fs.readdirSync(sourceRoot,{recursive:true}).filter(n=>/\.(png|mp4|mov)$/i.test(n))){
   assert(localFiles.includes(`${dir}/${file.replaceAll('\\','/')}`),`Original missing from galleries: ${file}`);
  }
 }
}
for(const logo of ['premiere-pro','photoshop','capcut','canva','figma']) assert(fs.existsSync(`public/logos/${logo}.svg`));
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk('public');
for(const file of files) assert(fs.statSync(file).size<25*1024*1024,`Asset too large: ${file}`);
assert(files.length<20000);
console.log(`PASS: ${projects.length} projects, 18 unique originals, all captions, complete HLS streams, all assets within hosting limits.`);
