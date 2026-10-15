/* =========================================================
   HOME · gráfico del hero, tarjetas de estrategias, ficha emergente, FAQ y formulario
   ========================================================= */
(function () {
'use strict';
const T = window.TAI, { $, $$, STRATEGIES, byId, pct, cls, css, alpha, hasChart, charts } = T;

/* ---------- 1. TARJETAS DE ESTRATEGIA ---------- */
const cardsEl = $('#cards');
cardsEl.innerHTML = STRATEGIES.map(s => `
<article class="s-card spot reveal" data-type="${s.type}" style="--c:${s.color}" aria-labelledby="t-${s.slug}">
  <div class="s-media">
    <span class="s-pill"><i></i>${s.type === 'permanente' ? 'Cartera permanente' : 'Asignación táctica'}</span>
    <img src="${s.img.src}" width="800" height="400" loading="lazy" decoding="async" alt="${s.alt}">
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

/* ---------- 2. HERO: serie real con zona de caída ---------- */
const SERIES = window.TAI_SERIES;
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function realSeries(s) {
  const S = SERIES[s.id]; let [y, m] = S.from.split('-').map(Number); m -= 1;
  let yy = m === 0 ? y - 1 : y, mm = m === 0 ? 11 : m - 1;   // punto inicial = cierre del mes anterior (base 100)
  const labels = [MES[mm] + ' ' + yy], values = [100], rets = [null]; let v = 100;
  S.r.forEach(r => { mm++; if (mm > 11) { mm = 0; yy++; } v *= 1 + r / 100; labels.push(MES[mm] + ' ' + yy); values.push(+v.toFixed(2)); rets.push(r); });
  let p = -Infinity; const peaks = values.map(x => p = Math.max(p, x));
  return {labels, values, peaks, rets, from: labels[1], to: labels[labels.length - 1]};
}
let heroId = 'GEDA';
const hpTabs = $('#hpTabs');
hpTabs.innerHTML = STRATEGIES.map(s => `<button type="button" class="chip" role="radio" aria-checked="${s.id === heroId}" tabindex="${s.id === heroId ? 0 : -1}" data-id="${s.id}"><span class="sw" style="background:${s.color}"></span>${s.id}</button>`).join('');
hpTabs.addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (b) selectHero(b.dataset.id, true); });
hpTabs.addEventListener('keydown', e => {
  if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) return; e.preventDefault();
  const i = STRATEGIES.findIndex(s => s.id === heroId), d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
  selectHero(STRATEGIES[(i + d + STRATEGIES.length) % STRATEGIES.length].id, true);
});
function selectHero(id, focus) {
  heroId = id; const s = byId(id);
  $$('#hpTabs .chip').forEach(b => { const on = b.dataset.id === id; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
  $('#hpName').textContent = s.id; $('#hpValue').textContent = pct(s.avg);
  $('#hpDD').textContent = pct(s.dd);
  const a = $('#hp25'); a.textContent = pct(s.y25); a.className = 'mono ' + cls(s.y25);
  const b = $('#hp26'); b.textContent = pct(s.y26); b.className = 'mono ' + cls(s.y26);
  if (!hasChart) return;
  const d = realSeries(s), c = charts.hero;
  c.data.labels = d.labels;
  c.data.datasets[0].data = d.peaks;
  c.data.datasets[1].data = d.values;
  c.data.datasets[2].data = d.values; c.data.datasets[2].borderColor = s.color;
  c.data.datasets[2].backgroundColor = ctx => gradient(ctx, s.color);
  heroNote(d, s);
  c.update();
}
function heroNote(d, s) {
  $('#hpFrom').textContent = d.from; $('#hpTo').textContent = d.to;
  $('#heroChart').setAttribute('aria-label', 'Evolución acumulada de ' + s.id + ' (base 100) de ' + d.from + ' a ' + d.to + ', con la zona de caída sombreada');
}
function gradient(ctx, color) { const {chart} = ctx; const {ctx: c, chartArea: a} = chart; if (!a) return alpha(color, .15); const g = c.createLinearGradient(0, a.top, 0, a.bottom); g.addColorStop(0, alpha(color, .35)); g.addColorStop(1, alpha(color, 0)); return g; }
$('#heroTable').innerHTML = '<thead><tr><th scope="col">Estrategia</th><th scope="col">Rent. media</th><th scope="col">Máx. caída</th><th scope="col">2025</th><th scope="col">2026 (ene–sep)</th></tr></thead><tbody>' + STRATEGIES.map(s => `<tr><th scope="row">${s.id}</th><td>${pct(s.avg)}</td><td>${pct(s.dd)}</td><td>${pct(s.y25)}</td><td>${pct(s.y26)}</td></tr>`).join('') + '</tbody>';

if (hasChart) {
  const s = byId(heroId), d = realSeries(s);
  const fmtN = (v, dec = 1) => v.toLocaleString('es-ES', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  charts.hero = new Chart($('#heroChart'), {
    type: 'line',
    data: {labels: d.labels, datasets: [
      {label: 'Máximo previo', data: d.peaks, borderWidth: 0, pointRadius: 0, fill: false, borderColor: 'transparent'},
      {label: 'Zona de caída', data: d.values, borderWidth: 0, pointRadius: 0, borderColor: 'transparent', backgroundColor: `rgba(${css('--neg-rgb')},.28)`, fill: {target: 0, above: 'rgba(0,0,0,0)', below: `rgba(${css('--neg-rgb')},.28)`}},
      {label: 'Evolución acumulada (base 100)', data: d.values, borderColor: s.color, borderWidth: 2.25, tension: 0, pointHoverRadius: 5,
        pointRadius: ctx => ctx.dataIndex === ctx.dataset.data.length - 1 ? 4 : 0, pointBackgroundColor: ctx => byId(heroId).color,
        fill: 'start', backgroundColor: ctx => gradient(ctx, byId(heroId).color)}
    ]},
    options: {responsive: true, maintainAspectRatio: false, layout: {padding: {right: 8}}, interaction: {mode: 'index', intersect: false},
      scales: {
        x: {display: true, grid: {display: false}, ticks: {autoSkip: false, maxRotation: 0, font: {size: 11},
          callback: function (v) { const l = this.getLabelForValue(v); if (!l.startsWith('ene')) return '';
            const yr = +l.slice(-4), n = this.chart.data.labels.length, step = n > 84 ? 2 : 1; return yr % step === 0 ? String(yr) : ''; }}},
        y: {type: 'logarithmic', grid: {color: alpha('#8899bb', .12)},
          afterBuildTicks: ax => { const wide = ax.max / ax.min > 8;
            const nice = wide ? [10,20,50,100,200,500,1000,2000,5000,10000] : [50,70,100,150,200,300,500,700,1000];
            ax.ticks = ax.ticks.filter(t => nice.includes(Math.round(t.value))); },
          ticks: {callback: v => fmtN(v, 0)}}},
      plugins: {legend: {display: true, position: 'bottom', labels: {boxWidth: 10, boxHeight: 10, usePointStyle: true, filter: i => i.datasetIndex !== 0}},
        tooltip: {...T.tooltipStyle(), filter: i => i.datasetIndex === 2, callbacks: {
          title: c => c[0].label,
          label: c => ' Valor: ' + fmtN(c.parsed.y),
          afterLabel: c => { const dd = charts.hero.data, i = c.dataIndex, r = SERIES[heroId].r[i - 1], pk = dd.datasets[0].data[i], lines = [];
            if (r !== undefined) lines.push(' Mes: ' + (r > 0 ? '+' : '') + fmtN(r, 2) + '%');
            const cur = c.parsed.y / pk - 1; if (cur < -0.0005) lines.push(' Desde máximo: ' + fmtN(cur * 100) + '%'); return lines; }}}}}
  });
  heroNote(d, s);
}

/* ---------- 3. FAQ ---------- */
T.renderFaq($('#faqList'), [
  ['¿Necesito experiencia previa para seguir las estrategias?', 'No. Recibes las posiciones el día 1 de cada mes y decides si replicarlas en tu bróker. Todo se basa en reglas, sin decisiones discrecionales.'],
  ['¿Gestionas mi dinero?', 'No. Tu dinero permanece siempre en tu bróker y tú ejecutas las operaciones. Solo comparto las posiciones de cada estrategia.'],
  ['¿Es asesoramiento financiero?', 'No. La información es meramente informativa y no constituye asesoramiento financiero. Cada inversor debe hacer su propio análisis.'],
  ['¿Cuánto cuesta?', 'Con la oferta de lanzamiento tienes 3 meses gratis con acceso a todas las estrategias, sin compromiso. Precio posterior: [PLACEHOLDER].']
]);

T.initForm();
})();
