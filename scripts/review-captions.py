"""Apply conservative spelling/terminology corrections; retain automatic labels.

Does not claim a complete listening review. Unclear names stay explicitly unclear.
"""
from pathlib import Path
import json, re, textwrap
root=Path(__file__).resolve().parents[1]
corrections={
 'pricing-strategy':{
  'nupansin':'napansin','allergic kang IKEA':'allergic ang IKEA','pampamiliar':'pa familiar',
  'They are no further modern':'They are known for their modern','tanoko kanina':'tanong ko kanina',
  'Wala ang exacta price':'walang exact na price','pinakamang teknik':'pinakakilalang technique',
  'Kun saan':'Kung saan','tignan':'tingnan','indifference':'ang difference',
  'halos po ang katag':'halos buong catalog','Genito':'Ganito',
  'Apag mas mo ron tig na ng pre-show':'Kapag mas murang tingnan ang presyo',
  'mas na-a-chock mo nila':'mas naa-attract nila','costumers':'customers',
  'nagpapago':'nagbabago','pre-show':'presyo','nagpapabila':'nagpapabili',
  'ang bilang consumers':'bilang consumers,','purket':'porket','bibel hill':'bibilhin',
  'mga akita':'makakita','basa-basang':'basta-bastang','pras ya':'presyo','prasya':'presyo',
 },
 'documentary':{
  'BSVA':'BSBA','Santa Cruzan':'Santacruzan','Santa Cruzand':'Santacruzan','santa cruzad':'Santacruzan',
  'Santa Cruzian':'Santacruzan','Santapulan':'Santacruzan','wearing counts':'wearing gowns',
  'Dorena Elena':'Reyna Elena','museness':'muses','ibang arena':'ibang reyna',
  'Tell dito':'Dahil dito','ka final look':'the final look','dandling':'dangling',
  'what time look like':'what I look like','ma-board':'ma-bore','Kery':'Keri',
  'madyo':'medyo','uhulami':'uulan','yung donk':'yung gown','yung gawon':'yung gown',
  'kababalig':'kababalik','malakimbaga':'malaking bagay','my down, hair':'my gown, hair',
  'must-lose hierarchy':'Maslow’s hierarchy','mahiaing':'mahiyain','over all':'overall',
  'Mix emotions':'Mixed emotions','mas nakalala ko ngayong sarili ko':'mas nakilala ko ngayon yung sarili ko',
  'Neat Colossy Loader Veil':'[Name unclear]',
 },
 'ethics':{'packets and games':'back-to-back games','shoving the product':'showing the product'},
 'antiklo':{'Anti-Clo Flexi Light':'Antiklo Flexi Light'},
}
def timestamp(t):
 ms=round(t*1000)
 return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'
for key,replacements in corrections.items():
 p=root/'public/captions'/f'{key}.json'
 data=json.loads(p.read_text(encoding='utf-8'))
 changed=0
 for segment in data['segments']:
  original=segment['text']
  for old,new in replacements.items():segment['text']=segment['text'].replace(old,new)
  changed+=segment['text']!=original
 data['reviewNotes']='Spelling and clear terminology corrections applied. Automatic transcription still needs a final listening review.'
 p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
 vtt='WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{timestamp(s["start"])} --> {timestamp(s["end"])}\n'+textwrap.fill(s['text'],width=46,break_long_words=False) for i,s in enumerate(data['segments']))+'\n'
 (p.with_suffix('.vtt')).write_text(vtt,encoding='utf-8')
 print(key,changed,'segments corrected')
