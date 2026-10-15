/* =========================================================
   SIMULADOR · interés compuesto con dos estrategias
   Admite ?a=GEDA&b=ROCA&w=70 para llegar con una combinación preparada.
   ========================================================= */
(function () {
'use strict';
const T = window.TAI, { $, $$, STRATEGIES, byId, pct, eur, cls, css, alpha, hasChart, charts } = T;

const sA = $('#sA'), sB = $('#sB');
const opts = STRATEGIES.map(s => `<option value="${s.id}">${s.id} · ${pct(s.avg)} media</option>`).join('');
sA.innerHTML = opts; sB.innerHTML = opts;

/* Valores iniciales (por defecto o desde la dirección) */
let a0 = 'IMPULSO', b0 = 'GEDA', w0 = 70;
try {
  const p = new URLSearchParams(location.search);
  const A = (p.get('a') || '').toUpperCase(), B = (p.get('b') || '').toUpperCase(), W = parseInt(p.get('w'), 10);
  if (byId(A)) { a0 = A; if (!byId(B)) b0 = (A === 'GEDA' ? 'IMPULSO' : 'GEDA'); }
  if (byId(B)) b0 = B;
  if (!isNaN(W) && W >= 0 && W <= 100) w0 = Math.round(W / 5) * 5;
} catch (e) {}
sA.value = a0; sB.value = b0; $('#sMix').value = w0;

let scenario = .75, lastSim = [];
$$('#scSeg .chip').forEach(b => b.addEventListener('click', () => {
  scenario = +b.dataset.sc; $$('#scSeg .chip').forEach(x => x.setAttribute('aria-checked', x === b)); runSim();
}));
$('#scSeg').addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return; e.preventDefault();
  const bs = $$('#scSeg .chip'), i = bs.findIndex(b => b.getAttribute('aria-checked') === 'true'), n = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + 3) % 3]; n.click(); n.focus();
});
['sA', 'sB', 'sMix', 'sCap', 'sMon', 'sYrs'].forEach(id => $('#' + id).addEventListener('input', runSim));

function runSim() {
  const a = byId(sA.value), b = byId(sB.value), w = +$('#sMix').value / 100;
  const cap = +$('#sCap').value, mon = +$('#sMon').value, yrs = +$('#sYrs').value;
  $('#oMix').textContent = `${Math.round(w * 100)}% ${a.id} / ${Math.round((1 - w) * 100)}% ${b.id}`;
  $('#oCap').textContent = eur(cap); $('#oMon').textContent = eur(mon); $('#oYrs').textContent = yrs + (yrs > 1 ? ' años' : ' año');
  const annual = (w * a.avg + (1 - w) * b.avg) * scenario;
  const r = Math.pow(1 + annual / 100, 1 / 12) - 1;
  let v = cap, inv = cap; lastSim = [{y: 0, inv, val: v}];
  for (let m = 1; m <= yrs * 12; m++) { v = v * (1 + r) + mon; inv += mon; if (m % 12 === 0) lastSim.push({y: m / 12, inv, val: v}); }
  $('#rIn').textContent = eur(inv); $('#rOut').textContent = eur(v);
  const g = $('#rGain'); g.textContent = eur(v - inv); g.className = 'mono ' + cls(v - inv);
  $('#rRate').textContent = pct(+annual.toFixed(1));
  $('#simTable').innerHTML = '<caption class="sr-only">Evolución año a año</caption><thead><tr><th scope="col">Año</th><th scope="col">Aportado</th><th scope="col">Rendimiento</th><th scope="col">Valor</th></tr></thead><tbody>' +
    lastSim.map(r => `<tr><th scope="row">${r.y}</th><td class="mono">${eur(r.inv)}</td><td class="mono ${cls(r.val - r.inv)}">${eur(r.val - r.inv)}</td><td class="mono">${eur(r.val)}</td></tr>`).join('') + '</tbody>';
  if (!hasChart) return;
  const labels = lastSim.map(r => 'Año ' + r.y), dInv = lastSim.map(r => Math.round(r.inv)), dGain = lastSim.map(r => Math.round(r.val - r.inv));
  if (charts.sim) { const c = charts.sim; c.data.labels = labels; c.data.datasets[0].data = dInv; c.data.datasets[1].data = dGain; c.data.datasets[1].borderColor = a.color; c.data.datasets[1].backgroundColor = alpha(a.color, .35); c.update(); return; }
  charts.sim = new Chart($('#simChart'), {type: 'line',
    data: {labels, datasets: [
      {label: 'Capital aportado', data: dInv, fill: 'origin', borderColor: css('--accent'), backgroundColor: alpha(css('--accent'), .3), pointRadius: 0, tension: .3, borderWidth: 2},
      {label: 'Rendimiento acumulado', data: dGain, fill: '-1', borderColor: a.color, backgroundColor: alpha(a.color, .35), pointRadius: 0, tension: .3, borderWidth: 2}
    ]},
    options: {responsive: true, maintainAspectRatio: false, interaction: {mode: 'index', intersect: false},
      scales: {x: {grid: {display: false}, ticks: {maxTicksLimit: 8}}, y: {stacked: true, grid: {color: alpha('#8899bb', .12)}, ticks: {callback: v => new Intl.NumberFormat('es-ES', {notation: 'compact'}).format(v) + ' €'}}},
      plugins: {legend: {position: 'bottom', labels: {usePointStyle: true, boxWidth: 10}},
        tooltip: {...T.tooltipStyle(), callbacks: {label: c => ` ${c.dataset.label}: ${eur(c.parsed.y)}`, footer: it => 'Valor total: ' + eur(it.reduce((a, b) => a + b.parsed.y, 0))}}}}});
}
$('#csvBtn').addEventListener('click', () => {
  const a = sA.value, b = sB.value, w = $('#sMix').value;
  const head = `# Simulación ilustrativa Tu Amigo Inversor;${a} ${w}% / ${b} ${100 - w}%;escenario ${scenario * 100}%\nAño;Aportado (EUR);Rendimiento (EUR);Valor (EUR)\n`;
  const body = lastSim.map(r => [r.y, r.inv.toFixed(2), (r.val - r.inv).toFixed(2), r.val.toFixed(2)].join(';')).join('\n');
  const blob = new Blob(['\ufeff' + head + body], {type: 'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob), l = document.createElement('a'); l.href = url; l.download = 'simulacion_tu_amigo_inversor.csv'; document.body.appendChild(l); l.click(); l.remove(); URL.revokeObjectURL(url);
});
runSim();
})();
