"""Package the tested build for hosting, keeping tooling and originals out."""
from pathlib import Path
import zipfile, json, shutil
root=Path(__file__).resolve().parents[1]
out=root.parent/'DELIVERY'
out.mkdir(exist_ok=True)
asset_dir=(out/'site/assets').resolve()
if asset_dir.is_relative_to((out/'site').resolve()) and asset_dir.exists():
 for stale in asset_dir.iterdir():
  if stale.is_file() and stale.suffix in ['.js','.css'] and not (root/'dist/assets'/stale.name).exists():
   stale.unlink()
shutil.copytree(root/'dist',out/'site',dirs_exist_ok=True)
with zipfile.ZipFile(out/'Hannah-Gabion-Website.zip','w',zipfile.ZIP_DEFLATED,compresslevel=2) as z:
 for file in (root/'dist').rglob('*'):
  if file.is_file():z.write(file,file.relative_to(root/'dist').as_posix())
print(json.dumps({'ready_folder':str(out/'site'),'static_zip':str(out/'Hannah-Gabion-Website.zip'),'zip_mb':round((out/'Hannah-Gabion-Website.zip').stat().st_size/1024**2,1)}))
