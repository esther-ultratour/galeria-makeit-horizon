"""build_assets.py — gera assets/ a partir do material entregue em `_originais/`.

  assets/<destino>.webp              imagem do lightbox  (lado maior <= 2600 px; plantas <= 4300 px)
  assets/miniaturas/<destino>.webp   miniatura da grade  (lado maior <=  900 px; plantas <= 1400 px)

O de-para (arquivo entregue -> nome final) fica em `assets-map.tsv` (TAB).
Plantas e o 3D do entorno vem em PNG com transparencia: o canal alfa e mantido
(WebP com alfa) e o desenho e recortado na propria caixa, com uma margem.

Uso:  python build_assets.py          # so o que falta
      python build_assets.py --force  # tudo
Requisito: Pillow  (pip install pillow)
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / '_originais'
OUT = ROOT / 'assets'
FORCE = '--force' in sys.argv


def fresh(src, dst):
    return not FORCE and dst.exists() and dst.stat().st_mtime > src.stat().st_mtime


def fit(im, longest):
    w, h = im.size
    k = min(1.0, longest / max(w, h))
    return im if k == 1 else im.resize((round(w * k), round(h * k)), Image.LANCZOS)


def trim(im):
    """Recorta na caixa do que nao e transparente, com 3,5 % de margem."""
    box = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        return im
    im = im.crop(box)
    pad = round(max(im.size) * 0.035)
    out = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    out.paste(im, (pad, pad))
    return out


def save(im, path, quality):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, 'WEBP', quality=quality, method=6)


done = skipped = 0
for line in (ROOT / 'assets-map.tsv').read_text(encoding='utf-8').splitlines():
    if not line.strip():
        continue
    rel, dst = line.split('\t')
    src = SRC / rel
    full, thumb = OUT / f'{dst}.webp', OUT / 'miniaturas' / f'{dst}.webp'
    if not src.exists():
        print(f'  falta: {rel}')
        continue
    if fresh(src, full) and fresh(src, thumb):
        skipped += 1
        continue
    plan = dst.startswith('plantas/')
    im = Image.open(src)
    if plan:
        im = trim(im.convert('RGBA'))
        save(fit(im, 4300), full, 97)
        save(fit(im, 1400), thumb, 80)
    else:
        im = im.convert('RGB')
        save(fit(im, 2600), full, 84)
        save(fit(im, 900), thumb, 76)
    done += 1
    print(f'  {dst}')
print(f'Imagens: {done} geradas, {skipped} ja atualizadas.')
