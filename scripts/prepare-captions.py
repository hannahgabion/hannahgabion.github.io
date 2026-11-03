"""Transcribe actual audio into timed WebVTT and readable transcripts.

Caption files are marked as machine drafts until individually reviewed.
"""
from pathlib import Path
import os, sys, json, time, wave
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools/python'))
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
os.environ['HF_HUB_DISABLE_XET'] = '1'
from faster_whisper import WhisperModel
import numpy as np

def timestamp(t):
 ms = round(t * 1000)
 return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'

print('Loading multilingual speech model...', flush=True)
model = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4, download_root=str(ROOT / '.tools/models'))
keys = ['pricing-strategy','ethics','documentary','freelance-01','freelance-02','antiklo']
dest = ROOT / 'public' / 'captions'
dest.mkdir(parents=True, exist_ok=True)
for key in keys:
 if (dest / f'{key}.json').exists(): continue
 audio = ROOT / '.tools/audio' / f'{key}.wav'
 for _ in range(300):
  if audio.exists() and audio.stat().st_size > 44: break
  time.sleep(2)
 else: raise RuntimeError(f'Missing audio: {key}')
 print('TRANSCRIBING', key, flush=True)
 with wave.open(str(audio), 'rb') as wav:
  samples = np.frombuffer(wav.readframes(wav.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
 segments, info = model.transcribe(samples, beam_size=5, vad_filter=True, condition_on_previous_text=False, word_timestamps=False)
 rows = []
 for seg in segments:
  text = seg.text.strip()
  if text:
   rows.append({'start':round(seg.start,3),'end':round(seg.end,3),'text':text})
   print(f'  {seg.start:.1f}: {text}', flush=True)
 vtt = 'WEBVTT\n\n' + '\n\n'.join(f'{i+1}\n{timestamp(s["start"])} --> {timestamp(s["end"])}\n{s["text"]}' for i,s in enumerate(rows)) + '\n'
 (dest / f'{key}.vtt').write_text(vtt, encoding='utf-8')
 (dest / f'{key}.json').write_text(json.dumps({'language':info.language, 'reviewStatus':'machine-draft', 'segments':rows},ensure_ascii=False,indent=2),encoding='utf-8')
 print('CAPTIONS READY', key, info.language, len(rows), flush=True)
