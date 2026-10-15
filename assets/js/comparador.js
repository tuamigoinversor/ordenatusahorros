/* =========================================================
   COMPARADOR · hasta 3 estrategias lado a lado (tabla + radar)
   Admite ?s=ROCA,GEDA para llegar con estrategias preseleccionadas.
   ========================================================= */
(function () {
'use strict';
const T = window.TAI, { $, $$, STRATEGIES, byId, pct, cls, css, alpha, hasChart, charts } = T;

const DEFAULTS = ['ROCA', 'IMPULSO', 'GEDA'];
let selected = [];
try {
  const q = new URLSearchParams(location.search).get('s');
  if (q) q.split(',').map(x => x.trim().toUpperCase()).forEach(id => { if (byId(id) && !selected.includes(id) && selected.length < 3) selected.push(id); });
} catch (e) {}
DEFAULTS.forEach(id => { if (selected.length < 3 && !selected.includes(id)) selected.push(id); });

const cmpSel = $('#cmpSelect');
cmpSel.innerHTML = STRATEGIES.map(s => `<button type="button" class="chip" aria-pressed="${selected.includes(s.id)}" data-id="${s.id}"><span class="sw" style="background:${s.color}"></span>${s.id}</button>`).join('');
cmpSel.addEventListener('click', e => {
  const b = e.target.closest('[data-id]'); if (!b) return; const id = b.dataset.id;
  if (selected.includes(id)) { if (selected.length <= 2) return flashHint('Mínimo 2 estrategias'); selected = selected.filter(x => x !== id); }
  else { if (selected.length >= 3) return flashHint('Máximo 3 estrategias: deselecciona una primero'); selected.push(id); }
  $$('.chip', cmpSel).forEach(c => c.setAttribute('aria-pressed', selected.includes(c.dataset.id)));
  renderCompare();
});
function flashHint(msg) { const h = $('#cmpHint'); h.textContent = msg; h.style.color = css('--warn'); setTimeout(() => { h.style.color = ''; h.textContent = `Seleccionadas: ${selected.length} de 3`; }, 1800); }

const radarAxes = ['Rentabilidad media', 'Control de caídas', 'Rentabilidad 2025', 'Frecuencia de revisión', 'Volatilidad (nivel)'];
const maxAvg = Math.max(...STRATEGIES.map(s => s.avg)), maxDD = Math.max(...STRATEGIES.map(s => Math.abs(s.dd)));
const min25 = Math.min(...STRATEGIES.map(s => s.y25)), max25 = Math.max(...STRATEGIES.map(s => s.y25));
const radarVals = s => [s.avg / maxAvg * 100, 100 - Math.abs(s.dd) / maxDD * 100 + 5, (s.y25 - min25) / (max25 - min25) * 100, s.review === 'Mensual' ? 100 : 35, s.risk * 20].map(v => +v.toFixed(0));

function renderCompare() {
  $('#cmpHint').textContent = `Seleccionadas: ${selected.length} de 3`;
  const list = selected.map(byId);
  const rows = [
    ['Perfil', s => s.profile, null],
    ['Rent. anual media', s => pct(s.avg), 'max', s => s.avg],
    ['Máx. caída', s => pct(s.dd), 'max', s => s.dd],
    ['Rentabilidad 2025', s => pct(s.y25), 'max', s => s.y25],
    ['Rentabilidad 2026 (ene–sep)', s => pct(s.y26), 'max', s => s.y26],
    ['Ratio rent. / caída', s => (s.avg / Math.abs(s.dd)).toFixed(2).replace('.', ',') + 'x', 'max', s => s.avg / Math.abs(s.dd)],
    ['Revisión', s => s.review, null],
    ['Riesgo', s => s.risk + '/5', null]
  ];
  $('#cmpTable').innerHTML = `<caption class="sr-only">Comparación de ${list.map(s => s.id).join(', ')}</caption><thead><tr><th scope="col">Métrica</th>${list.map(s => `<th scope="col" style="color:${s.color}">${s.id}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(([lab, f, mode, num]) => {
      const best = mode ? Math.max(...list.map(num)) : null;
      return `<tr><th scope="row">${lab}</th>${list.map(s => { const v = f(s), isBest = mode && num(s) === best; const c = /^[+-]/.test(v) ? cls(parseFloat(v)) : ''; return `<td class="mono ${c} ${isBest ? 'best' : ''}">${v}${isBest ? ' <span class="sr-only">(mejor)</span>' : ''}</td>`; }).join('')}</tr>`;
    }).join('') + '</tbody>';
  /* Enlaces a las fichas de las estrategias elegidas */
  $('#cmpLinks').innerHTML = list.map(s => `<a class="more" href="${s.url}" ${s.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>Ficha de ${s.id} <svg class="icon"><use href="#i-arrow"/></svg></a>`).join('');
  if (!hasChart) return;
  const ds = list.map(s => ({label: s.id, data: radarVals(s), borderColor: s.color, backgroundColor: alpha(s.color, .18), pointBackgroundColor: s.color, borderWidth: 2}));
  if (charts.radar) { charts.radar.data.datasets = ds; charts.radar.update(); return; }
  charts.radar = new Chart($('#radarChart'), {type: 'radar', data: {labels: radarAxes, datasets: ds},
    options: {responsive: true, maintainAspectRatio: false,
      scales: {r: {min: 0, max: 100, ticks: {display: false, stepSize: 25}, grid: {color: alpha('#8899bb', .2)}, angleLines: {color: alpha('#8899bb', .2)}, pointLabels: {color: css('--muted'), font: {size: 11, weight: '600'}}}},
      plugins: {legend: {position: 'bottom', labels: {usePointStyle: true, boxWidth: 10}}, tooltip: {...T.tooltipStyle(), callbacks: {label: c => ` ${c.dataset.label}: ${c.parsed.r}/100`}}}}});
}
renderCompare();
})();
