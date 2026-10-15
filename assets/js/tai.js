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
const IMG = id => ({ src: `${BASE}assets/img/${id}.svg` });
T.STRATEGIES = [
  {id:'ROCA',     slug:'roca',     type:'permanente', profile:'Perfil conservador',  color:'#0ea5e9', risk:1, review:'Semestral',
   desc:'Cartera permanente conservadora diseñada para proteger el capital en cualquier entorno de mercado.',
   feats:['Baja volatilidad','Diversificación','Rebalanceo semestral'], avg:7.5, dd:-9.2, y25:5.6, y26:4.7,
   img:IMG('roca'), alt:'Ilustración de montañas azules bajo un sol brillante, símbolo de solidez y calma',
   url:BASE+'cartera-permanente-conservadora-roca/index.html'},
  {id:'IMPULSO',  slug:'impulso',  type:'permanente', profile:'Perfil tolerante',    color:'#10b981', risk:2, review:'Semestral',
   desc:'Cartera permanente de crecimiento moderado que combina estabilidad y exposición a mercado.',
   feats:['Riesgo medio','Elimina renta fija','Rebalanceo semestral'], avg:13.6, dd:-16.5, y25:22.6, y26:8.2,
   img:IMG('impulso'), alt:'Ilustración de barras que crecen con monedas y una línea ascendente, símbolo de crecimiento',
   url:BASE+'cartera-inversion-crecimiento-impulso/index.html'},
  {id:'HORIZONTE',slug:'horizonte',type:'permanente', profile:'Plan de pensiones',   color:'#7c3aed', risk:2, review:'Semestral',
   desc:'Enfoque a largo plazo orientado a la acumulación de capital con reglas simples y consistentes.',
   feats:['Muy largo plazo','Baja rotación','Simplicidad operativa'], avg:12.1, dd:-19.3, y25:17.4, y26:17.6,
   img:IMG('horizonte'), alt:'Ilustración de un amanecer sobre colinas violetas, símbolo de largo plazo',
   url:BASE+'plan-pensiones-moderado-horizonte/index.html'},
  {id:'GEDA',     slug:'geda',     type:'tactica',    profile:'Perfil agresivo',     color:'#f59e00', risk:4, review:'Mensual',
   desc:'Estrategia táctica de inversión momentum que rota entre activos buscando maximizar la rentabilidad.',
   feats:['Alta rotación','Señales cuantitativas','Enfoque dinámico'], avg:40.3, dd:-19.6, y25:56.6, y26:100.2,
   img:IMG('geda'), alt:'Ilustración de velas de cotización y una línea de tendencia alcista',
   url:BASE+'inversion-tactica-geda/index.html'},
  {id:'GEN-Z',    slug:'genz',     type:'tactica',    profile:'Perfil muy agresivo', color:'#ec4899', risk:5, review:'Mensual',
   desc:'Inversión temática en sectores disruptivos y tendencias de futuro con alto potencial de crecimiento.',
   feats:['Alta volatilidad','Temáticas innovadoras','Largo plazo'], avg:68.1, dd:-44.9, y25:159.2, y26:16.2,
   img:IMG('genz'), alt:'Ilustración de un chip con circuitos, símbolo de tecnología disruptiva',
   url:BASE+'inversion-tematica-gen-z/index.html'},
  {id:'CRYPTO',   slug:'crypto',   type:'tactica',    profile:'Perfil especulativo', color:'#ef4444', risk:5, review:'Mensual',
   desc:'Estrategia de alto riesgo en criptomonedas, con fuerte volatilidad y potencial de revalorización.',
   feats:['Volatilidad extrema','Ciclos de mercado','Alto riesgo'], avg:44.5, dd:-73, y25:-23.6, y26:20.8,
   img:IMG('crypto'), alt:'Ilustración de una red de nodos conectados y hexágonos, símbolo del mundo cripto',
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
  {q:'¿Cuál es tu horizonte de inversión?', o:['Menos de 2 años','2 a 5 años','5 a 10 años','Más de 10 años']},
  {q:'Si tu cartera cayera un 25% en pocos meses, ¿qué harías?', o:['Vendería todo','Vendería una parte','Mantendría el sistema','Aprovecharía para aportar más']},
  {q:'¿Qué experiencia tienes invirtiendo?', o:['Ninguna','Algo: fondos o depósitos','Invierto de forma habitual','Mucha: acciones, ETF y estrategias']},
  {q:'¿Cuál es tu objetivo principal?', o:['Proteger mi capital','Crecer de forma estable','Ahorrar para la jubilación','Maximizar el crecimiento']},
  {q:'¿Qué parte de este dinero podrías necesitar a corto plazo?', o:['Buena parte','Una parte pequeña','Casi nada','Nada en absoluto']}
];
const answers = new Array(QUIZ.length).fill(null); let qi = 0;
const quizModal = $('#quizModal'), quizEl = $('#quiz');
function renderQuiz() {
  if (qi >= QUIZ.length) return renderResult();
  const q = QUIZ[qi];
  quizEl.innerHTML = `
    <div class="q-meta"><span>Pregunta ${qi + 1} de ${QUIZ.length}</span><span>${Math.round(qi / QUIZ.length * 100)}%</span></div>
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
function recommend() {
  const score = answers.reduce((a, b) => a + b, 0);   // 0 – 15
  const retirement = answers[3] === 2;
  if (answers[0] === 0 || answers[4] === 0) return {title:'Prudencia primero', mix:[['ROCA',100]], text:'Con un horizonte corto o necesidad de liquidez, lo más coherente es una cartera conservadora o no invertir aún ese dinero.'};
  if (score <= 4)  return {title:'Perfil conservador', mix:[['ROCA',100]], text:'Priorizas proteger el capital. ROCA está diseñada para baja volatilidad en cualquier entorno.'};
  if (retirement && score <= 11) return {title:'Perfil largo plazo', mix:[['HORIZONTE',70],['ROCA',30]], text:'Tu objetivo es la jubilación: HORIZONTE como núcleo, con ROCA como estabilizador.'};
  if (score <= 7)  return {title:'Perfil moderado', mix:[['ROCA',50],['IMPULSO',50]], text:'Equilibrio entre estabilidad y crecimiento combinando dos carteras permanentes.'};
  if (score <= 10) return {title:'Perfil tolerante', mix:[['IMPULSO',70],['GEDA',30]], text:'Núcleo de cartera permanente con un satélite de inversión momentum.'};
  if (score <= 13) return {title:'Perfil dinámico', mix:[['GEDA',60],['IMPULSO',40]], text:'Mayor peso en asignación táctica, manteniendo una base permanente.'};
  return {title:'Perfil agresivo', mix:[['GEDA',60],['GEN-Z',40]], text:'Buscas crecimiento y toleras caídas profundas. CRYPTO, si la usas, solo como satélite pequeño.'};
}
function renderResult() {
  const r = recommend();
  const avg = r.mix.reduce((a, [id, w]) => a + T.byId(id).avg * w / 100, 0);
  const a = r.mix[0][0], b = (r.mix[1] || r.mix[0])[0], w = r.mix[0][1];
  const simUrl = `${BASE}simulador/index.html?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&w=${w}`;
  const cmpUrl = `${BASE}comparador/index.html?s=${r.mix.map(m => encodeURIComponent(m[0])).join(',')}`;
  quizEl.innerHTML = `<div class="q-result">
    <div class="q-progress" aria-hidden="true"><div style="width:100%"></div></div>
    <span class="eyebrow">Tu resultado</span>
    <h3 style="font-size:var(--fs-2xl);margin:.4rem 0" id="qRes">${r.title}</h3>
    <p style="color:var(--muted);max-width:34rem;margin:0 auto">${r.text}</p>
    <div class="alloc" role="img" aria-label="Asignación propuesta: ${r.mix.map(([id, w]) => id + ' ' + w + '%').join(', ')}">${r.mix.map(([id, w]) => `<div style="width:0;background:${T.byId(id).color}" data-w="${w}"></div>`).join('')}</div>
    <div class="alloc-legend">${r.mix.map(([id, w]) => `<span><i style="background:${T.byId(id).color}"></i><strong>${id}</strong> ${w}%</span>`).join('')}</div>
    <p style="margin-top:1rem">Rentabilidad media ponderada histórica: <b class="mono pos">${T.pct(+avg.toFixed(1))}</b></p>
    <div class="cta-row" style="justify-content:center;margin-top:1.4rem">
      <a class="btn btn-primary" href="${simUrl}">Simular esta combinación</a>
      <a class="btn btn-ghost" href="${cmpUrl}">Comparar estrategias</a>
      <button type="button" class="btn btn-ghost" id="qRetry"><svg class="icon"><use href="#i-refresh"/></svg>Repetir test</button>
    </div>
    <p style="margin-top:1rem;font-size:var(--fs-sm)"><a class="more" href="${$('#suscripcion') ? '#suscripcion' : BASE + 'index.html#suscripcion'}" data-close>Probar 3 meses gratis <svg class="icon"><use href="#i-arrow"/></svg></a></p>
    <p class="fineprint">Resultado orientativo y educativo. No sustituye a un test de idoneidad (MiFID) ni constituye asesoramiento financiero.</p>
  </div>`;
  requestAnimationFrame(() => $$('.alloc div', quizEl).forEach(d => d.style.width = d.dataset.w + '%'));
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
  if (v === 'accepted') { /* Cargar aquí analítica solo tras consentimiento [PLACEHOLDER] */ } }
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
