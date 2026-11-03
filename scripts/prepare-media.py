"""Build web copies without changing the original portfolio assets.

Run with the bundled Python; tooling packages live in .tools/python (not published).
"""
from pathlib import Path
import sys, json, subprocess, urllib.request, re, shutil
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools/python'))
from PIL import Image, ImageOps, ImageDraw, ImageFont
import imageio_ffmpeg, av

SOURCE = ROOT.parent
PUBLIC = ROOT / 'public'
MEDIA = PUBLIC / 'media'
MEDIA.mkdir(parents=True, exist_ok=True)

IMAGES = {
 'terr atrax'.replace(' ', ''): 'SCHOOL PROJECTS/POSTER_TERRATRAX.png',
 'terr atrax-banner'.replace(' ', ''): 'SCHOOL PROJECTS/TERRATRAX_TARP.png',
 'himala': 'SCHOOL PROJECTS/Gabion.png',
 'hey-babe': 'SCHOOL PROJECTS/Gabion (1).png',
 'mothers-day': 'FREELANCE WORKS/march 31.png',
 'alba-crossbody': 'FREELANCE WORKS/static.png',
 'leather-comparison': 'FREELANCE WORKS/static (1).png',
 'sunglasses-case': 'FREELANCE WORKS/Variation B - 3_4.png',
 'birth-chart-a': 'FREELANCE WORKS/Birth Chart/Varation A - 1_1.png',
 'birth-chart-b': 'FREELANCE WORKS/Birth Chart/Varation B - 1_1.png',
 'birth-chart-c': 'FREELANCE WORKS/Birth Chart/Varation C - 1_1.png',
 'birth-chart-d': 'FREELANCE WORKS/Birth Chart/Varation D - 1_1.png',
}
VIDEOS = {
 'pricing-strategy': 'SCHOOL PROJECTS/Gabion_Hannah_PricingStrategyVideo.MOV',
 'ethics': 'SCHOOL PROJECTS/GABION_ETHICS_FINALS.mp4',
 'documentary': 'SCHOOL PROJECTS/Gabion_Hannah Michelle_DM32_MidtermDocu.mp4',
 'freelance-01': 'FREELANCE WORKS/freelance work.mp4',
 'freelance-02': 'FREELANCE WORKS/freelance work 2.mp4',
 'antiklo': 'FREELANCE WORKS/Antiklo Flexi Light - Batch 30 - VSL Style - Lights to get rid of H1.mp4',
}
YOUTUBE = {'save-me-a-drink': 'AKGZ4RsqTAw', 'barbershop': 'IxjIiXCaXZA', 'bite-the-beach': 'c9GAk21ThUQ', 'understanding-ourselves': 'NmcSOrDYlUo', 'lara-navigation': 'QJyWCqNArBw', 'oblicon': 'yPJe4zwgHf0'}

def fetch(url, destination):
 destination.parent.mkdir(parents=True, exist_ok=True)
 if not destination.exists():
  request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
  destination.write_bytes(urllib.request.urlopen(request, timeout=60).read())

def image_versions(src, key):
 im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
 for width in (480, 960, 1600):
  out = MEDIA / f'{key}-{width}.webp'
  if not out.exists():
   resized = im.copy()
   resized.thumbnail((width, round(width * im.height / im.width)), Image.Resampling.LANCZOS)
   resized.save(out, 'WEBP', quality=86, method=6)
 full = im.copy()
 full.thumbnail((2400, 3200), Image.Resampling.LANCZOS)
 full.save(MEDIA / f'{key}-full.webp', 'WEBP', quality=92, method=6)
 return {'width': im.width, 'height': im.height, 'sourceFile': src.relative_to(SOURCE).as_posix() if src.is_relative_to(SOURCE) else src.name}

def main():
 index = {}
 for key, source in IMAGES.items():
  index[key] = image_versions(SOURCE / source, key)
 portrait = Path(r'C:\Users\HANNAH~1\AppData\Local\Temp\codex-clipboard-e3b44e10-c163-405a-8e20-0379d79d611c.png')
 index['hannah'] = image_versions(portrait, 'hannah')
 # Social preview uses supplied photography and the portfolio's actual identity.
 canvas = Image.new('RGB', (1200, 630), '#FAF2DD')
 photo = ImageOps.fit(Image.open(portrait).convert('RGB'), (450, 570), centering=(.55,.40))
 canvas.paste(photo, (720, 30))
 draw = ImageDraw.Draw(canvas)
 serif = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 80)
 sans = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 25)
 draw.text((65,120), 'Hannah\nGabion.', fill='#34212B', font=serif, spacing=4)
 draw.text((70,380), 'MARKETING & MULTIMEDIA', fill='#603645', font=sans)
 draw.line((70,445,630,445), fill='#E981A4', width=3)
 canvas.save(MEDIA / 'share.jpg', quality=90)
 shutil.copyfile(Path(r'C:\Users\Hannah Gabion\Documents\[RESUME] Hannah Michelle E. Gabion'), PUBLIC / 'Hannah-Michelle-Gabion-Resume.pdf')
 for key, yt in YOUTUBE.items():
  fetch(f'https://i.ytimg.com/vi/{yt}/hqdefault.jpg', MEDIA / f'{key}-youtube.jpg')
  image_versions(MEDIA / f'{key}-youtube.jpg', key)
 # Self-host fonts; visitor browsing does not depend on a font service.
 for family, filename in [('DM+Sans:wght@400..700','dm-sans-latin.woff2'), ('Cormorant+Garamond:wght@400..600','cormorant-garamond-latin.woff2'), ('Cormorant+Garamond:ital,wght@1,400..600','cormorant-garamond-italic-latin.woff2')]:
  dest = PUBLIC / 'fonts' / filename
  if not dest.exists():
   req = urllib.request.Request('https://fonts.googleapis.com/css2?family='+family+'&display=swap', headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
   css = urllib.request.urlopen(req).read().decode()
   urls = re.findall(r'url\((https://[^)]+\.woff2)\)', css)
   if not urls: raise RuntimeError('No woff2 font returned')
   fetch(urls[-1], dest)
 for name in ['premiere-pro','photoshop','capcut','canva','figma']:
  source_name = 'premiere' if name == 'premiere-pro' else name
  try:
   if name == 'capcut':
    import hashlib
    asset = 'Capcut-icon.svg'; digest = hashlib.md5(asset.encode()).hexdigest()
    fetch(f'https://upload.wikimedia.org/wikipedia/commons/{digest[0]}/{digest[:2]}/{asset}', PUBLIC / 'logos' / f'{name}.svg')
   else: fetch(f'https://raw.githubusercontent.com/pheralb/svgl/main/static/library/{source_name}.svg', PUBLIC / 'logos' / f'{name}.svg')
  except Exception as e: print('LOGO FETCH:', name, str(e), flush=True)
 ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
 for key, source in VIDEOS.items():
  path = SOURCE / source
  with av.open(str(path)) as container:
   video = container.streams.video[0]
   width, height = video.width, video.height
   duration = float(container.duration / av.time_base)
  dest = MEDIA / 'video' / key
  dest.mkdir(parents=True, exist_ok=True)
  index[key] = {'duration': round(duration, 2), 'width': width, 'height': height, 'sourceFile': source}
  if not (MEDIA / f'{key}-960.webp').exists():
   subprocess.run([ffmpeg,'-y','-ss',str(min(3,duration/4)),'-i',str(path),'-frames:v','1','-vf','scale=960:-2',str(MEDIA / f'{key}-960.webp')], check=True, capture_output=True)
  if not (dest / 'stream.m3u8').exists():
   max_w, max_h = (1280,720) if width >= height else (720,1280)
   scale = f'scale=w=min({max_w}\\,iw):h=min({max_h}\\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2'
   print('ENCODING', key, f'{duration:.1f}s', flush=True)
   subprocess.run([ffmpeg,'-y','-i',str(path),'-map','0:v:0','-map','0:a:0?','-vf',scale,'-c:v','libx264','-preset','fast','-crf','24','-maxrate','2200k','-bufsize','4400k','-pix_fmt','yuv420p','-threads','2','-force_key_frames','expr:gte(t,n_forced*6)','-c:a','aac','-b:a','96k','-ac','2','-sn','-f','hls','-hls_time','6','-hls_playlist_type','vod','-hls_flags','independent_segments','-hls_segment_filename',str(dest / 'segment-%04d.ts'),str(dest / 'stream.m3u8')], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
   print('DONE', key, flush=True)
  # Keep mono audio outside published assets for caption preparation.
  audio = ROOT / '.tools' / 'audio' / f'{key}.wav'
  audio.parent.mkdir(parents=True, exist_ok=True)
  if not audio.exists():
   subprocess.run([ffmpeg,'-y','-i',str(path),'-vn','-ar','16000','-ac','1',str(audio)], check=True, capture_output=True)
 (ROOT / 'src/media-index.json').write_text(json.dumps(index,indent=2), encoding='utf-8')
 (ROOT / '.tools/source-inventory.json').write_text(json.dumps({'images':IMAGES,'videos':VIDEOS,'youtube':YOUTUBE},indent=2), encoding='utf-8')
 print('MEDIA READY', flush=True)

if __name__ == '__main__': main()
