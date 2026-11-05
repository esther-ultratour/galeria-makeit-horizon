(function (w, d) {
  'use strict';

  var BASE = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/makeit/horizon/ferramentas/galeria/';
  var GALLERY_URL       = BASE + 'index.html';

  var BG = '#8A122B';   // vinho do empreendimento — aparece enquanto o iframe carrega

  var overlay    = null;
  var msgHandler = null;

  function _injectStyles() {
    if (d.getElementById('_gc_styles')) return;
    var s = d.createElement('style');
    s.id = '_gc_styles';
    s.textContent =
      '@keyframes _gcIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes _gcOut{to{opacity:0}}';
    d.head.appendChild(s);
  }

  function _mount(iframeSrc, allow) {
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:' + BG + ';';
    iframe.setAttribute('allow', allow || 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  }

  function _open(mode) {
    _mount(GALLERY_URL + '?mode=' + encodeURIComponent(mode || 'imagens') + '&v=' + Date.now());
  }

  function _close() {
    if (!overlay) return;
    overlay.style.animation = '_gcOut 0.25s ease forwards';
    var ref = overlay;
    setTimeout(function () {
      if (ref.parentNode) ref.parentNode.removeChild(ref);
    }, 260);
    overlay = null;
    if (msgHandler) {
      w.removeEventListener('message', msgHandler);
      msgHandler = null;
    }
  }

  // ── API pública ──────────────────────────────────────────────
  // GaleriaImagens(1) → abre galeria de imagens · GaleriaImagens(0) → fecha
  w.GaleriaImagens = function (show) {
    if (show === 1) _open('imagens'); else _close();
  };

  // GaleriaPlantas(1) → abre galeria de plantas · GaleriaPlantas(0) → fecha
  w.GaleriaPlantas = function (show) {
    if (show === 1) _open('plantas'); else _close();
  };

  // ── Cortina de transição (troca de período: diurno ↔ entardecer etc.) ──
  // FadePeriodo(1)  → escurece a tela (≈ 0,5 s)
  // FadePeriodo(0)  → revela a tela de novo (≈ 0,8 s)
  // Parâmetros opcionais: FadePeriodo(show, ms, cor)  · cor padrão #000
  var curtain = null;
  w.FadePeriodo = function (show, ms, cor) {
    if (!curtain) {
      curtain = d.createElement('div');
      curtain.style.cssText =
        'position:fixed;inset:0;z-index:2147483645;pointer-events:none;opacity:0;' +
        'transition-property:opacity;transition-timing-function:cubic-bezier(0.22,0.8,0.24,1);';
      d.body.appendChild(curtain);
    }
    curtain.style.background = cor || '#000';
    curtain.style.transitionDuration = (ms || (show ? 500 : 800)) + 'ms';
    curtain.style.pointerEvents = show ? 'all' : 'none';   // bloqueia cliques durante a troca
    void curtain.offsetWidth;
    curtain.style.opacity = show ? '1' : '0';
  };

}(window, document));
