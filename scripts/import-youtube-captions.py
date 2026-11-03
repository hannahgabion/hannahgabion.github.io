"""Import caption tracks checked on the six included YouTube videos.

Uses creator captions for Bite the Beach and labelled automatic captions for
the other videos. Soundtrack lyrics are represented as music cues.
"""
from pathlib import Path
import json, re
ROOT = Path(__file__).resolve().parents[1]
mapping = {'AKGZ4RsqTAw':'save-me-a-drink','IxjIiXCaXZA':'barbershop','c9GAk21ThUQ':'bite-the-beach','NmcSOrDYlUo':'understanding-ourselves','QJyWCqNArBw':'lara-navigation','yPJe4zwgHf0':'oblicon'}
out = ROOT / 'public/captions'
out.mkdir(exist_ok=True, parents=True)
for youtube_id, key in mapping.items():
 raw = json.loads((ROOT / '.tools' / f'{youtube_id}-captions.json').read_text(encoding='utf-8'))
 rows = []
 for event in raw.get('events',[]):
  text = ''.join(s.get('utf8','') for s in event.get('segs',[])).replace('\ufffd','')
  text = re.sub(r'\s+', ' ',text.replace('>>','')).strip()
  if not text: continue
  start = event.get('tStartMs',0) / 1000
  end = start + event.get('dDurationMs',3000) / 1000
  if key == 'save-me-a-drink' and 48 <= start <= 53: text = '[Music]'
  if key == 'barbershop' and start < 75: text = '[Music]'
  if key == 'bite-the-beach':
   for bad,good in [('Kinalaw','Kinilaw'),('calamani','calamansi'),('scotch bonet','Scotch bonnet'),('Poké Ball','poke bowl'),('pokey means','poke means')]: text=text.replace(bad,good)
  if rows and text == '[Music]' and rows[-1]['text'] == '[Music]':
   rows[-1]['end'] = round(end,3)
  else:rows.append({'start':round(start,3),'end':round(end,3),'text':text})
 for i,row in enumerate(rows[:-1]):row['end']=min(row['end'],rows[i+1]['start'])
 status='creator-captions' if key == 'bite-the-beach' else 'machine-draft'
 language='fil' if key in ['understanding-ourselves','oblicon'] else 'en'
 rows=[row for row in rows if row['end']>row['start']]
 (out / f'{key}.json').write_text(json.dumps({'language':language,'reviewStatus':status,'source':f'https://www.youtube.com/watch?v={youtube_id}','segments':rows},ensure_ascii=False,indent=2),encoding='utf-8')
 print(key,len(rows),'segments',status)
