/* =========================================================
   HOME · tarjetas de estrategias, FAQ y formulario
   ========================================================= */
(function () {
'use strict';
const T = window.TAI, { $, $$, STRATEGIES, pct, cls } = T;

/* ---------- 1. TARJETAS DE ESTRATEGIA ---------- */
const cardsEl = $('#cards');
cardsEl.innerHTML = STRATEGIES.map(s => `
<article class="s-card spot reveal" data-type="${s.type}" style="--c:${s.color}" aria-labelledby="t-${s.slug}">
  <div class="s-media">
    <span class="s-pill"><i></i>${s.type === 'permanente' ? 'Cartera permanente' : 'Asignación táctica'}</span>
    <img src="${s.img.src}" width="600" height="450" loading="lazy" decoding="async" alt="${s.alt}">
  </div>
  <div class="s-body">
    <span class="s-profile">${s.profile}</span>
    <h3 id="t-${s.slug}"><a class="s-link" href="${s.url}">${s.id}</a>${s.note ? ` <span class="pp">${s.note.toLowerCase()}</span>` : ''}</h3>
    <p>${s.desc}</p>
    <div class="risk"><span>Riesgo</span><div class="risk-bars" role="img" aria-label="Nivel de riesgo ${s.risk} de 5">${[1,2,3,4,5].map(i => `<i class="${i <= s.risk ? 'on' : ''}"></i>`).join('')}</div><span class="mono">${s.risk}/5</span></div>
    <div class="metrics">
      <div class="metric"><span>Rent. anual media${{GEDA:1,'GEN-Z':1,IMPULSO:1,CRYPTO:1}[s.id]?'*':''}</span><b class="mono pos">${pct(s.avg)}</b></div>
      <div class="metric"><span>Máx. caída</span><b class="mono neg">${pct(s.dd)}</b></div>
      <div class="metric"><span>2025</span><b class="mono ${cls(s.y25)}">${pct(s.y25)}</b></div>
      <div class="metric"><span>2026 (ene–sep)</span><b class="mono ${cls(s.y26)}">${pct(s.y26)}</b></div>
    </div>
    <div class="s-actions">
      <a class="btn btn-primary btn-sm" href="${s.url}">Ver estrategia <svg class="icon"><use href="#i-arrow"/></svg><span class="sr-only"> ${s.id}</span></a>
    </div>
  </div>
</article>`).join('');

$$('.filters .chip').forEach(b => b.addEventListener('click', () => {
  $$('.filters .chip').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true');
  $$('.s-card').forEach(c => c.hidden = !(b.dataset.filter === 'all' || c.dataset.type === b.dataset.filter));
}));

/* ---------- 3. FAQ ---------- */
T.renderFaq($('#faqList'), [
  ['¿Necesito experiencia previa para seguir las estrategias?', 'No necesitas ser experto en mercados, pero sí saber comprar y vender en tu bróker. El informe usa términos técnicos (momentum, drawdown, rotación…) y algunas estrategias incluyen activos de alto riesgo, como acciones individuales o criptomonedas. Antes de aplicar cualquiera, revisa su ficha y la metodología.'],
  ['¿Tengo que operar todos los meses?', 'Depende de la estrategia. Las tácticas (GEDA, GEN-Z, CRYPTO y HORIZONTE, que es un plan de pensiones) se revisan cada mes y pueden cambiar posiciones. Las carteras permanentes (ROCA e IMPULSO) se revisan cada semestre. Si no hay cambios, el informe lo indica y no tienes que hacer nada.'],
  ['¿Las rentabilidades son reales?', 'En parte. Cada estrategia tiene años de operativa real y, en algunas, años de backtest (simulación de las reglas sobre datos pasados): GEDA hasta 2020, GEN-Z hasta 2023, IMPULSO en 2016-2017 y CRYPTO hasta 2022. En cada ficha los años aparecen marcados como «Real» o «Simulado».'],
  ['¿Para quién está pensado?', 'Para inversores particulares en España: las rentabilidades se expresan en euros y el contenido (fiscalidad, brókers, planes de pensiones) se refiere principalmente al mercado español.'],
  ['¿Gestionas mi dinero?', 'No. Tu dinero permanece siempre en tu bróker y tú ejecutas las operaciones. Solo comparto las posiciones de cada estrategia.'],
  ['¿Es asesoramiento financiero?', 'No. La información es meramente informativa y no constituye asesoramiento financiero ni una recomendación personalizada. Cada inversor debe hacer su propio análisis.'],
  ['¿Cuánto cuesta?', 'Puedes empezar gratis: solo necesitas tu nombre y tu correo electrónico y no se pide ningún dato de pago. En el futuro el servicio pasará a ser de pago, con una cuota mínima prevista de 5 € al mes, que se pagaría por semestre (30 €) o por año (50 €, con descuento). Antes de pasar a un servicio de pago te avisaré con 3 meses de antelación. No hay ningún pago automático: para el servicio de pago tendrás que darte de alta de forma explícita.']
]);

})();
