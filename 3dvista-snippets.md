# Trechos para colar no 3DVista — Horizon

## 1. Loader — cole no **JavaScript global do projeto** (roda uma vez)

```js
(function(){
  var s = document.createElement('script');
  s.src = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/makeit/horizon/ferramentas/galeria/inject.js?v=' + Date.now();
  document.head.appendChild(s);
})();
```

## 2. Botões — cole na **action** do hotspot/botão

```js
GaleriaImagens(1);   // abre a galeria de imagens   · GaleriaImagens(0) fecha
GaleriaPlantas(1);   // abre plantas + entorno 3D   · GaleriaPlantas(0) fecha
```

## 3. Fade global na troca de período (diurno ↔ entardecer)

No botão de troca, monte a sequência de ações nesta ordem:

1. **JavaScript:** `FadePeriodo(1);`        (tela escurece)
2. **Wait / Delay:** 500 ms                  (espera o fade terminar)
3. *Ação original de troca de período*
4. **Wait / Delay:** 300 ms                  (deixa o novo período carregar)
5. **JavaScript:** `FadePeriodo(0);`        (tela revela)

Opcional: `FadePeriodo(1, 700, '#8A122B')` muda duração e cor da cortina.
