/* =========================================================
   TAI · código común de todas las páginas
   Datos de las estrategias, utilidades, tema claro/oscuro, navegación,
   test de perfil (ventana emergente), cookies, FAQ y formulario.
   Se carga con defer, después de Chart.js.
   ========================================================= */
(function () {
'use strict';
const T = window.TAI = {};
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const BASE = document.documentElement.dataset.base || '';   // '' en la home, '../' en subcarpetas
Object.assign(T, { $, $$, BASE });

/* ---------- 1. FUENTE DE VERDAD: ESTRATEGIAS (no modificar cifras) ---------- */
const IMG = id => ({ src: `${BASE}assets/img/estrategias/${id}-card.webp` });
T.STRATEGIES = [
  {id:'ROCA',     slug:'roca',     type:'permanente', profile:'Perfil conservador',  color:'#0ea5e9', risk:1, review:'Semestral',
   desc:'Cartera permanente conservadora diseñada para proteger el capital en cualquier entorno de mercado.',
   feats:['Baja volatilidad','Diversificación','Rebalanceo semestral'], avg:7.5, dd:-9.2, y25:5.6, y26:4.7,
   img:IMG('roca'), alt:'Cima rocosa con montañas nevadas al amanecer, símbolo de solidez y calma',
   url:BASE+'cartera-permanente-conservadora-roca/index.html'},
  {id:'IMPULSO',  slug:'impulso',  type:'permanente', profile:'Perfil tolerante',    color:'#10b981', risk:2, review:'Semestral',
   desc:'Cartera permanente de crecimiento moderado que combina estabilidad y exposición a mercado.',
   feats:['Riesgo medio','Elimina renta fija','Rebalanceo semestral'], avg:13.6, dd:-16.5, y25:22.6, y26:8.2,
   img:IMG('impulso'), alt:'Carretera junto al mar al atardecer con estelas de luz, símbolo de avance constante',
   url:BASE+'cartera-inversion-crecimiento-impulso/index.html'},
  {id:'HORIZONTE',slug:'horizonte',type:'permanente', profile:'Plan de pensiones',   color:'#7c3aed', risk:2, review:'Semestral',
   desc:'Enfoque a largo plazo orientado a la acumulación de capital con reglas simples y consistentes.',
   feats:['Muy largo plazo','Baja rotación','Simplicidad operativa'], avg:12.1, dd:-19.3, y25:17.4, y26:17.6,
   img:IMG('horizonte'), alt:'Piscina infinita frente al mar al amanecer, símbolo de largo plazo',
   url:BASE+'plan-pensiones-moderado-horizonte/index.html'},
  {id:'GEDA',     slug:'geda',     type:'tactica',    profile:'Perfil agresivo',     color:'#f59e00', risk:4, review:'Mensual',
   desc:'Estrategia táctica de inversión momentum que rota entre activos buscando maximizar la rentabilidad.',
   feats:['Alta rotación','Señales cuantitativas','Enfoque dinámico'], avg:40.3, dd:-19.6, y25:56.6, y26:100.2,
   img:IMG('geda'), alt:'Pantallas con gráficos de cotización sobre un escritorio, símbolo del análisis de tendencias',
   url:BASE+'inversion-tactica-geda/index.html'},
  {id:'GEN-Z',    slug:'genz',     type:'tactica',    profile:'Perfil muy agresivo', color:'#ec4899', risk:5, review:'Mensual',
   desc:'Inversión temática en sectores disruptivos y tendencias de futuro con alto potencial de crecimiento.',
   feats:['Alta volatilidad','Temáticas innovadoras','Largo plazo'], avg:68.1, dd:-44.9, y25:159.2, y26:16.2,
   img:IMG('genz'), alt:'Placa de circuitos electrónicos vista de cerca, símbolo de tecnología disruptiva',
   url:BASE+'inversion-tematica-gen-z/index.html'},
  {id:'CRYPTO',   slug:'crypto',   type:'tactica',    profile:'Perfil especulativo', color:'#ef4444', risk:5, review:'Mensual',
   desc:'Estrategia de alto riesgo en criptomonedas, con fuerte volatilidad y potencial de revalorización.',
   feats:['Volatilidad extrema','Ciclos de mercado','Alto riesgo'], avg:44.5, dd:-73, y25:-23.6, y26:20.8,
   img:IMG('crypto'), alt:'Moneda dorada de Bitcoin frente a gráficos de mercado, símbolo del mundo cripto',
   url:BASE+'inversion-criptomonedas-crypto/index.html'}
];
T.byId = id => T.STRATEGIES.find(s => s.id === id);

/* ---------- 2. UTILIDADES ---------- */
T.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
T.pct = v => (v > 0 ? '+' : '') + String(v).replace('.', ',') + '%';
T.eur = v => new Intl.NumberFormat('es-ES', {style:'currency', currency:'EUR', maximumFractionDigits:0}).format(v);
T.cls = v => v < 0 ? 'neg' : 'pos';
T.css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
T.debounce = (fn, ms = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
T.alpha = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
T.hasChart = typeof window.Chart !== 'undefined';
if (!T.hasChart) document.documentElement.classList.add('no-chart');
const reduced = T.reduced;

/* ---------- 3. GRÁFICOS: ajustes globales y tema ---------- */
T.charts = {};
T.chartDefaults = function () {
  if (!T.hasChart) return;
  Chart.defaults.font.family = "Inter, system-ui, sans-serif";
  Chart.defaults.color = T.css('--muted');
  Chart.defaults.borderColor = T.css('--line');
  Chart.defaults.animation.duration = reduced ? 0 : 900;
};
T.tooltipStyle = () => ({backgroundColor:T.css('--surface'), titleColor:T.css('--text'), bodyColor:T.css('--text'), borderColor:T.css('--line-2'), borderWidth:1, padding:10, cornerRadius:10, boxPadding:4});
T.refreshChartsTheme = function () {
  if (!T.hasChart) return; T.chartDefaults();
  Object.values(T.charts).forEach(c => {
    if (c.options.plugins.tooltip) Object.assign(c.options.plugins.tooltip, T.tooltipStyle());
    if (c.options.scales.r) c.options.scales.r.pointLabels.color = T.css('--muted');
    Object.values(c.options.scales).forEach(s => { if (s.ticks) s.ticks.color = T.css('--muted'); });
    if (c.options.plugins.legend && c.options.plugins.legend.labels) c.options.plugins.legend.labels.color = T.css('--muted');
    c.update('none');
  });
};
T.chartDefaults();
addEventListener('resize', T.debounce(() => Object.values(T.charts).forEach(c => c.resize()), 200));

/* ---------- 4. TEMA CLARO / OSCURO ---------- */
const themeBtn = $('#themeToggle');
function setThemeLabel() {
  const t = document.documentElement.dataset.theme;
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
setThemeLabel();
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('tai-theme-v3', next); } catch (e) {}
  setThemeLabel(); T.refreshChartsTheme();
});

/* ---------- 5. NAVEGACIÓN, PROGRESO, FLOTANTES ---------- */
const header = $('#header'), progress = $('#progress'), toTop = $('#toTop'), sticky = $('#stickyCta');
const subSection = $('#suscripcion');
const onScroll = () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('scrolled', y > 10);
  progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  toTop.classList.toggle('show', y > 900);
  let inSub = false;
  if (subSection) { const r = subSection.getBoundingClientRect(); inSub = r.top < innerHeight && r.bottom > 0; }
  sticky.classList.toggle('show', y > 600 && !inSub);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();
toTop.addEventListener('click', () => { scrollTo({top:0, behavior:reduced ? 'auto' : 'smooth'}); $('#main').focus({preventScroll:true}); });

const burger = $('#burger'), mm = $('#mobileMenu');
burger.addEventListener('click', () => { const o = mm.classList.toggle('open'); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú'); });
$$('#mobileMenu a').forEach(a => a.addEventListener('click', () => { mm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mm.classList.contains('open')) { mm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); } });

/* ---------- 6. MICROINTERACCIONES ---------- */
if (!reduced && matchMedia('(hover:hover)').matches) {
  $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .18) + 'px'); b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .25) + 'px'); });
    b.addEventListener('mouseleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
  });
  document.addEventListener('pointermove', e => { const el = e.target.closest('.spot'); if (!el) return; const r = el.getBoundingClientRect(); el.style.setProperty('--x', (e.clientX - r.left) + 'px'); el.style.setProperty('--y', (e.clientY - r.top) + 'px'); }, {passive:true});
}

/* ---------- 7. REVEAL AL HACER SCROLL ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), {threshold:.12, rootMargin:'0px 0px -40px 0px'});
T.observeReveal = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));

/* ---------- 8. VENTANAS EMERGENTES (accesibles: foco atrapado + ESC) ---------- */
T.openModal = function (m, trigger, focusEl) {
  m._last = trigger || document.activeElement;
  m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  (focusEl || $('.modal-close', m)).focus({preventScroll:true});
};
T.closeModal = function (m) {
  m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  if (m._last && m._last.focus) m._last.focus({preventScroll:true});
  if (m.id === 'quizModal' && location.hash === '#test') history.replaceState(null, '', location.pathname + location.search);
};
document.addEventListener('click', e => {
  const m = e.target.closest('.modal'); if (!m) return;
  if (e.target === m || e.target.closest('.modal-close') || e.target.closest('[data-close]')) T.closeModal(m);
});
document.addEventListener('keydown', e => {
  const m = $('.modal.open'); if (!m) return;
  if (e.key === 'Escape') { T.closeModal(m); return; }
  if (e.key === 'Tab') {
    const f = $$('a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])', $('.modal-box', m)).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- 9. TEST DE PERFIL (ventana emergente) ---------- */
const QUIZ = [
  {a:'A · Tu situación', q:'¿Cuándo prevés necesitar este dinero?', o:['En menos de 2 años','Entre 2 y 5 años','Entre 5 y 10 años','En más de 10 años'], p:[1,2,3,4]},
  {q:'¿Qué parte de tus ahorros totales representa el dinero que vas a invertir?', o:['Más del 75%','Entre el 50% y el 75%','Entre el 25% y el 50%','Menos del 25%'], p:[1,2,3,4]},
  {q:'Al margen de este dinero, ¿cuántos meses de gastos puedes cubrir con ahorros disponibles de inmediato?', o:['Ninguno','Entre 1 y 3 meses','Entre 3 y 6 meses','Más de 6 meses'], p:[1,2,3,4]},
  {a:'B · Conocimientos y experiencia', q:'¿Cuál es el producto más complejo que has contratado?', o:['Ninguno, o solo depósitos y cuentas remuneradas','Fondos monetarios o de renta fija','Fondos de renta variable o mixtos, ETF o planes de pensiones','Acciones individuales, derivados, criptomonedas u otros productos complejos'], p:[1,2,3,4]},
  {q:'¿Cuánto tiempo llevas invirtiendo?', o:['Nunca he invertido','Menos de 2 años','Entre 2 y 5 años','Más de 5 años'], p:[1,2,3,4]},
  {q:'Un fondo de renta variable mundial puede perder más del 30% de su valor en un año.', o:['Verdadero','Falso','No lo sé'], p:[4,2,1]},
  {a:'C · Riesgo y objetivos', q:'Tu cartera cae un 20% en tres meses. ¿Qué haces?', o:['Vendo todo para no perder más','Vendo una parte','Mantengo y espero','Aprovecho para invertir más'], p:[1,2,3,4]},
  {q:'¿Qué escenario a un año preferirías?', o:['Entre 0% y +3%, sin posibilidad de pérdida','Entre −5% y +8%','Entre −15% y +20%','Entre −30% y +40%'], p:[1,2,3,4]},
  {q:'¿Qué pérdida temporal máxima podrías aceptar sin cambiar tus planes?', o:['Un 5%','Un 10%','Un 20%','Un 30% o más'], p:[1,2,3,4]},
  {q:'¿Cuál es tu objetivo principal?', o:['Conservar el capital','Superar algo la inflación sin sobresaltos','Crecer de forma moderada aceptando altibajos','Maximizar el crecimiento aceptando pérdidas importantes'], p:[1,2,3,4]}
];
const answers = new Array(QUIZ.length).fill(null); let qi = 0;
const quizModal = $('#quizModal'), quizEl = $('#quiz');
function renderQuiz() {
  if (qi >= QUIZ.length) return renderResult();
  const q = QUIZ[qi];
  const area = q.a || [...QUIZ.slice(0, qi)].reverse().find(x => x.a).a;
  quizEl.innerHTML = `
    <div class="q-meta"><span>Pregunta ${qi + 1} de ${QUIZ.length} · ${area}</span><span>${Math.round(qi / QUIZ.length * 100)}%</span></div>
    <div class="q-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${QUIZ.length}" aria-valuenow="${qi}" aria-label="Progreso del test"><div style="width:${qi / QUIZ.length * 100}%"></div></div>
    <h3 class="q-title" id="qT">${q.q}</h3>
    <div class="q-opts" role="radiogroup" aria-labelledby="qT">
      ${q.o.map((t, i) => `<button type="button" class="q-opt" role="radio" aria-checked="${answers[qi] === i}" data-i="${i}"><span class="rd" aria-hidden="true"></span>${t}</button>`).join('')}
    </div>
    <div class="q-nav">
      <button type="button" class="btn btn-ghost btn-sm" id="qBack" ${qi === 0 ? 'disabled' : ''}><svg class="icon"><use href="#i-left"/></svg>Atrás</button>
      <button type="button" class="btn btn-primary btn-sm" id="qNext" ${answers[qi] === null ? 'disabled' : ''}>${qi === QUIZ.length - 1 ? 'Ver resultado' : 'Siguiente'}<svg class="icon"><use href="#i-arrow"/></svg></button>
    </div>`;
  $$('.q-opt', quizEl).forEach(b => b.addEventListener('click', () => { answers[qi] = +b.dataset.i; $$('.q-opt', quizEl).forEach(x => x.setAttribute('aria-checked', x === b)); $('#qNext').disabled = false; }));
  $('#qBack').addEventListener('click', () => { qi--; renderQuiz(); $('.q-opt', quizEl).focus(); });
  $('#qNext').addEventListener('click', () => { qi++; renderQuiz(); const f = $('.q-opt', quizEl) || $('h3', quizEl); if (f) f.focus(); });
}

/* ---- Resultado: perfil + explicación en lenguaje natural + estrategias que encajan (sin porcentajes) ---- */
const PROFILES = ['Conservador', 'Moderado', 'Dinámico', 'Agresivo'];
const PROFILE_TXT = [
  'priorizas proteger tu dinero frente a hacerlo crecer. Aceptas rentabilidades más modestas a cambio de ver pocas caídas.',
  'buscas un equilibrio entre proteger tu dinero y hacerlo crecer. Aceptas algunas caídas temporales a cambio de una rentabilidad algo mayor.',
  'buscas hacer crecer tu dinero y aceptas caídas importantes por el camino, siempre que tengas tiempo para recuperarte.',
  'priorizas el crecimiento por encima de todo y aceptas pérdidas elevadas y largos periodos de caída.'
];
const STRAT_WHY = {
  'ROCA': 'Cartera permanente diversificada pensada para proteger el capital. Es la que menos ha caído en su historia.',
  'IMPULSO': 'Cartera permanente con más peso en bolsa y oro que ROCA: busca más crecimiento con caídas todavía contenidas.',
  'HORIZONTE': 'Plan de pensiones con una estrategia de tendencia. Sirve para dinero a largo plazo, porque un plan de pensiones no se puede rescatar libremente.',
  'GEDA': 'Estrategia táctica de momentum: rota entre activos y compañías buscando fortaleza. Puede crecer mucho, pero exige aguantar los malos meses.',
  'GEN-Z': 'Pocas posiciones en sectores disruptivos. Muy volátil: solo para quien acepta caídas muy grandes sin cambiar de plan.',
  'CRYPTO': 'Criptomonedas con reglas de momentum. Es la más especulativa: solo con dinero que puedas permitirte perder.'
};
function evaluate() {
  const L = 'abcd'.split('');
  const a = answers.map(i => L[i]);                         // letras a-d de cada pregunta
  const p = answers.map((i, k) => QUIZ[k].p[i]);            // puntos
  const sum = (x, y) => p.slice(x, y).reduce((u, v) => u + v, 0);
  const cap = sum(0, 3), con = sum(3, 6), tol = sum(6, 10), tot = cap + con + tol;
  const base = tot <= 18 ? 0 : tot <= 26 ? 1 : tot <= 34 ? 2 : 3;
  // Reglas de prudencia: el perfil final no puede superar estos límites
  const caps = [
    [a[0] === 'a', 0, 'vas a necesitar este dinero en menos de 2 años y, en plazos tan cortos, una caída puede no dar tiempo a recuperarse'],
    [a[8] === 'a', 0, 'solo aceptarías una pérdida temporal muy pequeña (un 5%)'],
    [a[1] === 'a', 1, 'este dinero supone más del 75% de tus ahorros'],
    [a[2] === 'a', 1, 'no cuentas con un colchón de ahorros para imprevistos'],
    [a[6] === 'a', 1, 'ante una caída del 20% venderías todo, y eso convertiría una pérdida temporal en definitiva'],
    [con <= 4, 1, 'tus conocimientos sobre inversión son todavía básicos y conviene empezar por productos que se entiendan bien']
  ].filter(r => r[0]);
  const final = Math.min(base, ...caps.map(r => r[1]));
  const reasons = caps.filter(r => r[1] === final).map(r => r[2]);
  // Avisos de coherencia
  const warn = [];
  if (tol / 4 - cap / 3 > 1) warn.push('Tu disposición a asumir riesgo es mayor que lo que tu situación actual permite. Conviene que lo tengas presente antes de invertir.');
  if (cap / 3 - tol / 4 > 1) warn.push('Tu situación te permitiría asumir más riesgo del que te resulta cómodo. Prevalece lo que te resulta cómodo: invertir de forma que puedas dormir tranquilo es lo que te permitirá mantener el plan.');
  if (p[6] <= 2 && a[8] === 'd') warn.push('Has dicho que aceptarías perder un 30% o más, pero que ante una caída del 20% venderías. Piensa cuál de las dos reacciones sería la real: es lo que más importa cuando llegan las caídas.');
  // Estrategias que encajan
  const fit = [];
  if (final === 0) fit.push('ROCA');
  if (final === 1) fit.push('ROCA', 'IMPULSO', 'HORIZONTE');
  if (final === 2) fit.push('IMPULSO', 'HORIZONTE', 'GEDA');
  if (final === 3) fit.push('HORIZONTE', 'GEDA', 'GEN-Z', 'CRYPTO');
  const out = [], why = {};
  fit.forEach(id => {
    if (id === 'HORIZONTE' && (a[0] === 'a' || a[0] === 'b')) { out.push([id, 'es un plan de pensiones y tu dinero lo necesitarás en menos de 5 años']); return; }
    if (id === 'GEDA' && a[8] < 'c') { out.push([id, 'sus caídas históricas se acercan al 20% y has dicho que aceptarías menos']); return; }
    if (id === 'GEN-Z' && a[8] < 'c') { out.push([id, 'sus caídas históricas superan el 40% y has dicho que aceptarías menos']); return; }
    if (id === 'CRYPTO' && a[8] !== 'd') { out.push([id, 'sus caídas históricas llegan al 73% y has dicho que aceptarías menos']); return; }
    why[id] = 1;
  });
  const ok = fit.filter(id => why[id]);
  const notFit = T.STRATEGIES.map(s => s.id).filter(id => !ok.includes(id));
  return { cap, con, tol, tot, base, final, reasons, warn, ok, left: out, notFit, a };
}
function renderResult() {
  const r = evaluate();
  const lv = (x, t, lo, hi) => t[x <= lo ? 0 : x <= hi ? 1 : 2];
  const capT = lv(r.cap, ['limitada: tu situación actual deja poco margen para asumir pérdidas', 'intermedia: tu situación permite asumir algo de riesgo', 'amplia: tu situación te permite asumir más riesgo'], 6, 9);
  const conT = lv(r.con, ['básicos', 'intermedios', 'avanzados'], 6, 9);
  const tolT = lv(r.tol, ['prefieres evitar las caídas aunque eso suponga renunciar a rentabilidad', 'aceptas algunas caídas a cambio de más rentabilidad', 'estás dispuesto a aceptar caídas importantes buscando crecimiento'], 8, 12);
  const lvl = (x, lo, hi) => x <= lo ? 'Baja' : x <= hi ? 'Media' : 'Alta';
  let porque = `Has sumado <strong>${r.tot} puntos de 40</strong>. Esa puntuación corresponde a un perfil <strong>${PROFILES[r.base]}</strong>: ${PROFILE_TXT[r.base]}`;
  porque += ` Por áreas, tu capacidad para asumir riesgo es ${capT}; tus conocimientos son ${conT}; y ${tolT}.`;
  let final = '';
  if (r.final < r.base) final = `Aun así, tu perfil final es <strong>${PROFILES[r.final]}</strong> porque ${r.reasons.join(', y porque ')}. No es un juicio sobre ti: es una regla de prudencia, ya que el riesgo que conviene asumir depende no solo de cuánto riesgo te sientes capaz de aceptar, sino también de lo que tu situación te permite. Si cambian tus circunstancias, puedes repetir el test.`;
  else final = `Tu perfil final coincide con esa puntuación: <strong>${PROFILES[r.final]}</strong>.`;
  const card = id => { const s = T.byId(id); return `<li class="fit-card" style="--c:${s.color}"><div><strong><i style="background:${s.color}"></i>${id}</strong> <span class="fit-tag">${s.profile}</span></div><p>${STRAT_WHY[id]}</p><p class="fit-dd">Mayor caída histórica: <b class="mono neg">${T.pct(s.dd)}</b> · <a href="${s.url}">Ver ficha</a></p></li>`; };
  const cmpUrl = `${BASE}comparador/index.html?s=${r.ok.map(encodeURIComponent).join(',')}`;
  const noFit = r.left.length || r.notFit.length;
  const worst = Math.max(...r.notFit.map(id => Math.abs(T.byId(id).dd)), 0);
  let excl = '';
  if (r.left.length) excl += r.left.map(([id, m]) => `<li><strong>${id}</strong>: ${m}.</li>`).join('');
  const rest = r.notFit.filter(id => !r.left.some(l => l[0] === id));
  if (rest.length) excl += `<li><strong>${rest.join(', ')}</strong>: asumen más riesgo del que encaja con tu perfil (caídas históricas de hasta el ${String(worst).replace('.', ',')}%).</li>`;
  quizEl.innerHTML = `<div class="q-result long">
    <div class="q-progress" aria-hidden="true"><div style="width:100%"></div></div>
    <span class="eyebrow">Tu resultado</span>
    <h3 style="font-size:var(--fs-2xl);margin:.4rem 0 .2rem" id="qRes">Tu perfil: ${PROFILES[r.final]}</h3>
    <div class="q-areas">
      <div><span>Capacidad</span><b>${lvl(r.cap, 6, 9)}</b></div>
      <div><span>Conocimientos</span><b>${lvl(r.con, 6, 9)}</b></div>
      <div><span>Tolerancia</span><b>${lvl(r.tol, 8, 12)}</b></div>
    </div>
    <h4>Por qué sale este perfil</h4>
    <p>${porque}</p><p>${final}</p>
    ${r.warn.length ? `<div class="q-warn"><strong>A tener en cuenta</strong>${r.warn.map(w => `<p>${w}</p>`).join('')}</div>` : ''}
    <h4>Estrategias que encajan con tu perfil</h4>
    <ul class="fit-list">${r.ok.map(card).join('')}</ul>
    <p class="q-hint">Puedes quedarte con una o combinar varias: cuántas y en qué medida es una decisión tuya. <a href="${BASE}aprende/combinar-estrategias-inversion/index.html">Cómo combinar las estrategias</a>.</p>
    ${noFit ? `<h4>Y las que, por ahora, no encajan</h4><ul class="fit-no">${excl}</ul>` : ''}
    <div class="cta-row" style="margin-top:1.4rem">
      <a class="btn btn-primary" href="${cmpUrl}">Comparar mis estrategias</a>
      <button type="button" class="btn btn-ghost" id="qRetry"><svg class="icon"><use href="#i-refresh"/></svg>Repetir test</button>
    </div>
    <p style="margin-top:1rem;font-size:var(--fs-sm)"><a class="more" href="${$('#suscripcion') ? '#suscripcion' : BASE + 'index.html#suscripcion'}" data-close>Probar 3 meses gratis <svg class="icon"><use href="#i-arrow"/></svg></a></p>
    <p class="fineprint">Resultado orientativo y educativo, calculado en tu navegador (tus respuestas no se envían a ningún sitio). No es un test de idoneidad regulado (MiFID) ni asesoramiento financiero personalizado. Las rentabilidades pasadas no garantizan rentabilidades futuras.</p>
  </div>`;
  $('#qRetry').addEventListener('click', () => { answers.fill(null); qi = 0; renderQuiz(); $('.q-opt', quizEl).focus(); });
  const h = $('h3', quizEl); h.setAttribute('tabindex', '-1'); h.focus();
}
T.openQuiz = function (trigger) {
  answers.fill(null); qi = 0; renderQuiz();
  T.openModal(quizModal, trigger, $('.q-opt', quizEl));
};
document.addEventListener('click', e => {
  const a = e.target.closest('[data-quiz]'); if (!a) return;
  e.preventDefault();
  const mm2 = $('#mobileMenu'); if (mm2) { mm2.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  T.openQuiz(a);
});
/* Cierra la ventana al pulsar un enlace interno de la misma página (p. ej. #suscripcion) */
quizModal.addEventListener('click', e => {
  const a = e.target.closest('a[href]'); if (!a) return;
  const h = a.getAttribute('href');
  if (h.startsWith('#')) T.closeModal(quizModal);
});

/* ---------- 10. FAQ (acordeón) ---------- */
T.renderFaq = function (el, list) {
  el.innerHTML = list.map((f, i) => `<div class="qa reveal"><h3><button type="button" aria-expanded="false" aria-controls="fa${i}" id="fq${i}">${f[0]}<svg class="icon"><use href="#i-plus"/></svg></button></h3><div class="ans" id="fa${i}" role="region" aria-labelledby="fq${i}"><div><p>${f[1]}</p></div></div></div>`).join('');
  $$('.qa button', el).forEach(b => b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o); b.closest('.qa').classList.toggle('open', o); }));
};

/* ---------- 11. FORMULARIO DE SUSCRIPCIÓN (solo si la página lo tiene) ---------- */
T.initForm = function () {
  const form = $('#subForm'); if (!form) return;
  const fName = $('#fName'), fEmail = $('#fEmail'), fConsent = $('#fConsent');
  const rules = {
    fName: v => v.trim().length >= 2 ? '' : 'Introduce tu nombre (mínimo 2 caracteres).',
    fEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Introduce un correo electrónico válido.'
  };
  function validate(el) {
    const msg = rules[el.id](el.value);
    $('#e' + el.id.slice(1)).textContent = msg; el.setAttribute('aria-invalid', !!msg); el.classList.toggle('valid', !msg); return !msg;
  }
  [fName, fEmail].forEach(el => { el.addEventListener('input', () => { if (el.value) validate(el); }); el.addEventListener('blur', () => validate(el)); });
  fConsent.addEventListener('change', () => $('#eConsent').textContent = '');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = [validate(fName), validate(fEmail)].every(Boolean);
    if (!fConsent.checked) { $('#eConsent').textContent = 'Necesito tu consentimiento para enviarte el informe.'; }
    if (!ok || !fConsent.checked) { (form.querySelector('[aria-invalid="true"]') || fConsent).focus(); return; }
    const btn = $('#fBtn'), st = $('#fStatus');
    btn.classList.add('loading'); btn.disabled = true; $('#fBtnTxt').textContent = 'Enviando…'; st.className = 'form-status'; st.textContent = '';
    try {
      /* ===== CONECTAR PROVEEDOR DE EMAIL =====
         BREVO (recomendado: usar un endpoint propio/serverless para NO exponer la API key):
           await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},
             body:JSON.stringify({email:fEmail.value,attributes:{FIRSTNAME:fName.value},listIds:[ID_LISTA]})});
           // El endpoint llama a https://api.brevo.com/v3/contacts con la cabecera 'api-key'.
         MAILCHIMP: sustituye este bloque por el <form action> del formulario embebido de Mailchimp
           (https://<dc>.list-manage.com/subscribe/post?u=XXXX&id=YYYY) o llama a tu endpoint que use /3.0/lists/{list_id}/members.
         ======================================== */
      await new Promise(r => setTimeout(r, 1200)); // Simulación: NO envía datos
      st.classList.add('ok'); st.textContent = '¡Listo! Revisa tu correo para confirmar la suscripción.'; form.reset(); $$('.valid', form).forEach(x => x.classList.remove('valid'));
    } catch (err) {
      st.classList.add('ko'); st.textContent = 'No he podido completar la suscripción. Inténtalo de nuevo o escríbeme a info@tuamigoinversor.com.';
    } finally {
      btn.classList.remove('loading'); btn.disabled = false; $('#fBtnTxt').textContent = 'Quiero empezar gratis';
    }
  });
};

/* ---------- 12. COOKIES (RGPD) ---------- */
const ck = $('#cookie');
let consent = null; try { consent = localStorage.getItem('tai-cookies'); } catch (e) {}
if (!consent) setTimeout(() => ck.classList.add('show'), 800);
function setConsent(v) { try { localStorage.setItem('tai-cookies', v); } catch (e) {} ck.classList.remove('show');
  if (v === 'accepted') { /* Si se añade analítica, cargarla aquí y solo tras el consentimiento */ } }
$('#ckAccept').addEventListener('click', () => setConsent('accepted'));
$('#ckReject').addEventListener('click', () => setConsent('rejected'));
$('#cookieSettings').addEventListener('click', e => { e.preventDefault(); ck.classList.add('show'); $('#ckAccept').focus(); });

/* ---------- 13. INICIO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  T.observeReveal();
  if (location.hash === '#test') setTimeout(() => T.openQuiz(), 250);   // enlace directo al test desde otras páginas
});
if (document.readyState !== 'loading') { T.observeReveal(); }
})();
