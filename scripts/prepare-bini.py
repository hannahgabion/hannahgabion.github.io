"""Prepare a browsable copy of Hannah's HTML/CSS project; preserve the ZIP."""
from pathlib import Path
import zipfile, re, urllib.request, hashlib, json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = Path(r'C:\Users\Hannah Gabion\Downloads\GABION MIDTERMS-20261103T192042Z-1-001.zip')
DEST = ROOT / 'public/projects/bini'
DEST.mkdir(parents=True, exist_ok=True)
original_hash = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
members = ['Aiah','Colet','Gwen','Maloi','Jhoanna','Mikha','Sheena','Stacey']
footer = '''<footer><p>This is for educational purposes only.</p><p>Photos: <a href="https://www.abs-cbn.com/bini" target="_blank" rel="noopener noreferrer">ABS-CBN / BINI<span class="sr-only"> (opens in a new tab)</span></a> · Website by Hannah Michelle Gabion</p><a href="../../index.html#web-projects">Return to Hannah’s portfolio</a></footer>'''

with zipfile.ZipFile(ARCHIVE) as archive:
 for item in archive.infolist():
  relative = Path(*Path(item.filename).parts[1:])
  if not relative.parts or item.is_dir(): continue
  target = (DEST / relative).resolve()
  if not target.is_relative_to(DEST.resolve()): raise ValueError('Unsafe ZIP entry')
  target.parent.mkdir(parents=True, exist_ok=True)
  raw = archive.read(item)
  if target.suffix.lower() not in ['.html','.css']:
   target.write_bytes(raw); continue
  content = raw.decode('utf-8').replace('\r','')
  if target.suffix == '.html' and target.name != 'login.html':
   member = target.stem if target.stem in members else None
   content = content.replace('Media/favicon.png','images/favicon.png')
   content = content.replace('src="images/Logo.png"Logo"','src="images/Logo.png" alt="BINI logo"')
   content = content.replace('alt="Logo"','alt="BINI logo"')
   content = re.sub(r'(<img\s+src=")https:[^"]+("[^>]*>)', lambda m:m[1]+f'images/{member.lower() if member else "group"}.webp'+m[2],content)
   if member:
    content = content.replace('<body>', '<body class="member-page">')
    content = content.replace('alt="Bini Aiah"', f'alt="BINI {member}"')
    content = content.replace('<h2>','<h1>',1).replace('</h2>','</h1>',1)
    content = content.replace('<title>Bini: Top Ph Girl Group</title>',f'<title>{member} — BINI | Hannah Gabion</title>')
   else:content=content.replace('<title>Bini: Top Ph Girl Group</title>','<title>BINI — HTML &amp; CSS Website | Hannah Gabion</title>')
   content = re.sub(r'<a href="login.html" class="button">.*?</a>', '<div class="button"><a class="portfolio-return" href="../../index.html#web-projects">Return to Hannah’s portfolio</a></div>',content,flags=re.S)
   content = re.sub(r'<footer>.*?</footer>',footer,content,flags=re.S)
   content = re.sub(r'(?:<br>\s*){2,}', '',content)
   content = content.replace('<nav>','<nav aria-label="BINI pages">')
   content = content.replace(' class="active"','')
   content = content.replace(f'href="{target.name}"',f'href="{target.name}" aria-current="page"')
   # The logo is a home link, not a second current-page indicator.
   content = content.replace('href="index.html" aria-current="page" class="logo"','href="index.html" class="logo"')
   content = content.replace('<div class="content">','<main id="main" class="content">').replace('    </div> \n   ', '    </main> \n   ')
   # Close the main element directly before the return link, including home markup.
   content = re.sub(r'</div>\s*<br>\s*(?=<div class="button">)', '</main>',content)
   content = re.sub(r'</div>\s*(?=<div class="button">)', '</main>',content)
   content = re.sub(r'<body([^>]*)>', r'<body\1>\n<a class="skip-link" href="#main">Skip to content</a>',content)
   content = content.replace('</head>','<link rel="stylesheet" href="repair.css">\n</head>')
  target.write_text('\n'.join(line.rstrip() for line in content.splitlines()).rstrip()+'\n',encoding='utf-8')

(DEST/'login.html').write_text('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to BINI | Hannah Gabion</title><link rel="icon" href="images/favicon.png"><link rel="stylesheet" href="login.css"><link rel="stylesheet" href="repair.css"></head>
<body class="welcome-page"><main class="welcome-card"><img src="images/Logo.png" alt="BINI logo" width="180"><h1>Welcome, BLOOM!</h1><p>Get to know BINI and the eight members behind the music.</p><a class="portfolio-return" href="index.html">Explore BINI</a><a class="welcome-back" href="../../index.html#web-projects">Return to Hannah’s portfolio</a></main></body></html>''',encoding='utf-8')

credits = {}
for name in ['group'] + [m.lower() for m in members]:
 source = 'Bini_OG_Image.png' if name == 'group' else next(m for m in members if m.lower()==name)+'.jpg'
 url = f'https://od2-image-api.abs-cbn.com/prod/{source}'
 if (DEST/'images'/f'{name}.webp').exists():
  credits[name] = url
  continue
 request = urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 import io
 with Image.open(io.BytesIO(urllib.request.urlopen(request,timeout=30).read())) as im:
  im = im.convert('RGB');im.thumbnail((1600,1400),Image.Resampling.LANCZOS)
  im.save(DEST/'images'/f'{name}.webp','WEBP',quality=88,method=6)
 credits[name] = url
(DEST/'image-sources.json').write_text(json.dumps(credits,indent=2),encoding='utf-8')
assert hashlib.sha256(ARCHIVE.read_bytes()).hexdigest() == original_hash
print('BINI project prepared; original ZIP unchanged:',original_hash)
