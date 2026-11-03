import { readFile, writeFile } from 'node:fs/promises';
const siteBase = process.env.PORTFOLIO_SITE_URL ? new URL(process.env.PORTFOLIO_SITE_URL.replace(/\/?$/, '/')) : null;
if (siteBase && !['https:', 'http:'].includes(siteBase.protocol)) throw new Error('PORTFOLIO_SITE_URL must be an HTTP URL');
const html = await readFile('dist/index.html', 'utf8');
function metadata(document, page) {
  if (!siteBase) return document;
  const url = new URL(page, siteBase).href;
  return document.replace(/(<meta property="og:image" content=")[^"]+("\s*\/>)/, `$1${new URL('media/share.jpg', siteBase).href}$2`)
    .replace('</head>', `<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" /></head>`);
}
await writeFile('dist/index.html', metadata(html, ''));
await writeFile('dist/more-work.html', metadata(html.replace('<title>Hannah Gabion — Marketing & Multimedia</title>', '<title>More Work — Hannah Gabion</title>'), 'more-work.html'));
await writeFile('dist/.nojekyll', '');
