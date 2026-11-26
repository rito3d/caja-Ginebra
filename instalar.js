// =============================================================
//  Aviso para instalar la Caja como app (Android, iPhone y iPad)
// =============================================================
(function () {
  const instalada = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (instalada) return;

  const leer = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const poner = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  if (leer('caja-instalar-cerrado')) return;

  const css = document.createElement('style');
  css.textContent = `
    #instalar{position:fixed;left:10px;right:10px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:60;
      max-width:560px;margin:0 auto;background:#fff;color:#1b2333;border:2px solid #1d3a6e;border-radius:16px;
      padding:12px 14px;display:flex;gap:12px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.25);
      font:15px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
    #instalar img{width:46px;height:46px;border-radius:11px;flex:none}
    #instalar .t{flex:1}
    #instalar .g{color:#6b7588}
    #instalar .si{background:#1d3a6e;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:700}
    #instalar .no{background:none;border:0;color:#6b7588;font-size:24px;padding:2px 6px}
    #instalar svg{vertical-align:-3px}`;
  document.head.appendChild(css);

  function mostrar(html, boton) {
    document.getElementById('instalar')?.remove();
    const d = document.createElement('div');
    d.id = 'instalar';
    d.innerHTML = `<img src="icon-192.png" alt=""><div class="t">${html}</div>` +
      (boton ? '<button class="si">Instalar</button>' : '') + '<button class="no" aria-label="Cerrar">×</button>';
    document.body.appendChild(d);
    d.querySelector('.no').onclick = () => { poner('caja-instalar-cerrado', '1'); d.remove(); };
    return d;
  }

  // Android / tablets Android (Chrome, Edge, Samsung Internet)
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    const d = mostrar('<b>Instala la Caja</b><br><span class="g">Así funciona sin internet desde su icono.</span>', true);
    d.querySelector('.si').onclick = () => { d.remove(); e.prompt(); };
  });

  // iPhone / iPad
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) {
    const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|GSA|FBAN|FBAV|Instagram|WhatsApp/.test(ua);
    const ico = '<svg width="16" height="18" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 13V1M4 5l4-4 4 4"/><path d="M5 8H2v11h12V8h-3"/></svg>';
    window.addEventListener('load', () => setTimeout(() => mostrar(safari
      ? `<b>Instálala en este ${/iPad/.test(ua) || navigator.maxTouchPoints > 1 && !/iPhone/.test(ua) ? 'iPad' : 'iPhone'}</b><br><span class="g">Toca ${ico} <b>Compartir</b> → <b>“Añadir a pantalla de inicio”</b>.</span>`
      : `<b>Para instalarla</b><br><span class="g">Abre esta página en <b>Safari</b> y toca ${ico} Compartir → “Añadir a pantalla de inicio”.</span>`
    ), 1500));
  }
})();
