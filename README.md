# Galeria — Horizon (Make it)

Galeria de imagens e plantas para injeção via script no 3DVista, hospedada no AWS S3.
**Paleta:** vinho `#8A122B` · vermelho `#A6122B` · creme `#FFFCF2` (degradês e detalhes).
**Tipografia:** Fraunces (títulos, eixo SOFT) + Manrope (texto), via Google Fonts.

## URLs de produção

Base: `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/makeit/horizon/ferramentas/galeria/`
(`index.html` · `inject.js`) — S3: `s3://skylineip/Tour Virtual/makeit/horizon/ferramentas/galeria/`

## Estrutura

```
index.html          galeria (?mode=imagens | plantas | all)
inject.js           loader para o 3DVista
deploy.ps1          deploy para o S3
build_assets.py     gera assets/ (WebP) a partir de _originais/  (Pillow)
assets-map.tsv      arquivo entregue → nome final
_originais/         material entregue, FORA do git e do deploy
assets/             brand/ · fachada/ · areas-comuns/ · apartamento/ · plantas/ · miniaturas/
```

Nomes publicados: minúsculos, sem espaços nem acentos (S3 é case-sensitive); os
nomes de exibição ficam em `ITEMS` no `index.html`.

## Conteúdo

| Modo | Categorias |
|------|-----------|
| imagens | Fachada (4) · Áreas Comuns (6) · Apartamento (7) |
| plantas | **Entorno 3D (destaque)** · Implantação · Plantas (Meio, Ponta) |

Cada categoria tem um mosaico próprio com cartões retangulares de tamanhos diferentes
(`c`/`r` em `ITEMS`). Plantas e 3D mantêm a transparência e ficam sobre papel creme.

## Acrescentar imagens

Original em `_originais/` → linha em `assets-map.tsv` → `python build_assets.py` →
item em `ITEMS` (com `w`,`h` do arquivo gerado e `c`,`r` do mosaico).

## Deploy

```powershell
./deploy.ps1             # sync + cache-control
./deploy.ps1 -QuickHtml  # só HTML/JS
```

## 3DVista

Trechos prontos em `3dvista-snippets.md`: `GaleriaImagens(1|0)` e `GaleriaPlantas(1|0)`.

## Pendências

- Sem vídeo e sem áreas (m²) das plantas: não foram entregues.
- Legendas das imagens descrevem o que se vê; revisar com o cliente se necessário.
