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
    <h3 id="t-${s.slug}"><a class="s-link" href="${s.url}">${s.id}</a></h3>
    <p>${s.desc}</p>
    <div class="risk"><span>Riesgo</span><div class="risk-bars" role="img" aria-label="Nivel de riesgo ${s.risk} de 5">${[1,2,3,4,5].map(i => `<i class="${i <= s.risk ? 'on' : ''}"></i>`).join('')}</div><span class="mono">${s.risk}/5</span></div>
    <div class="metrics">
      <div class="metric"><span>Rent. anual media</span><b class="mono pos">${pct(s.avg)}</b></div>
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
  ['¿Necesito experiencia previa para seguir las estrategias?', 'No. Recibes las posiciones el día 1 de cada mes y decides si replicarlas en tu bróker. Todo se basa en reglas, sin decisiones discrecionales.'],
  ['¿Gestionas mi dinero?', 'No. Tu dinero permanece siempre en tu bróker y tú ejecutas las operaciones. Solo comparto las posiciones de cada estrategia.'],
  ['¿Es asesoramiento financiero?', 'No. La información es meramente informativa y no constituye asesoramiento financiero. Cada inversor debe hacer su propio análisis.'],
  ['¿Cuánto cuesta?', 'Con la oferta de lanzamiento, el acceso a todas las estrategias es gratis hasta el 31 de diciembre de 2026, sin compromiso. Después, para seguir recibiendo el informe mensual con las posiciones actualizadas el día 1 de cada mes y poder replicar las estrategias: 30 € al semestre o 50 € al año.']
]);

T.initForm();
})();
