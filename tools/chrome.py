# -*- coding: utf-8 -*-
"""Cabecera, pie y <head> comunes (usado por build_fichas.py)."""
import os
SPRITE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sprite.txt'), encoding='utf8').read()
SOBRE_MI = 'https://tuamigoinversor.com/sobre-mi/'


def head(title, desc, base, scripts, og_title=None, ld=''):
    scripts_html = '\n'.join('<script defer src="%sassets/js/%s"></script>' % (base, s) for s in scripts)
    return '''<!DOCTYPE html>
<html lang="es" data-theme="dark" data-base="%(base)s">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#0a0f1e" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

<!-- Open Graph / Twitter -->
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="Tu Amigo Inversor">
<meta property="og:title" content="%(og)s">
<meta property="og:description" content="%(desc)s">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%(og)s">
<meta name="twitter:description" content="%(desc)s">

<!-- Tema sin parpadeo: se aplica antes de pintar -->
<script>
(function(){try{var t=localStorage.getItem('tai-theme-v3');if(!t){t='light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();
</script>

<link rel="stylesheet" href="%(base)sassets/css/fonts.css">
<link rel="stylesheet" href="%(base)sassets/css/site.css">
<link rel="icon" href="%(base)sfavicon.svg" type="image/svg+xml">

<!-- Única librería externa: Chart.js (diferida) -->
<script defer src="%(base)sassets/js/chart.umd.js"></script>
%(scripts)s
%(ld)s
</head>
''' % dict(base=base, title=title, desc=desc, og=og_title or title, scripts=scripts_html, ld=ld)


def nav_links(base, home, current):
    def a(anchor):
        return ('#%s' % anchor) if home else ('%sindex.html#%s' % (base, anchor))
    items = [
        ('estrategias', a('estrategias'), 'Estrategias', ''),
        ('sobre-mi', base + 'sobre-mi/index.html', 'Sobre mí', ''),
        ('test', a('test'), 'Test de perfil', ' data-quiz'),
        ('comparador', base + 'comparador/index.html', 'Comparador', ''),
        ('simulador', base + 'simulador/index.html', 'Simulador', ''),
        ('metodologia', base + 'metodologia/index.html', 'Metodología', ''),
        ('blog', base + 'blog/index.html', 'Blog', ''),
    ]
    out = []
    for key, href, label, extra in items:
        cur = ' aria-current="page"' if key == current else ''
        out.append('      <li><a href="%s"%s%s>%s</a></li>' % (href, extra, cur, label))
    return '\n'.join(out)


def body_open(base, home, current):
    sub = '#suscripcion' if home else base + 'index.html#suscripcion'
    logo = '#main' if home else base + 'index.html'
    links = nav_links(base, home, current)
    return '''<body>
<a class="skip" href="#main">Saltar al contenido</a>
<div class="progress" id="progress" aria-hidden="true"></div>

<!-- SVG sprite (iconos estilo Lucide) -->
%(sprite)s

<!-- =========================== CABECERA =========================== -->
<header class="site-header" id="header">
  <nav class="container nav" aria-label="Navegación principal">
    <a href="%(logo)s" class="logo" aria-label="Tu Amigo Inversor, inicio"><span class="logo-mark" aria-hidden="true">TA</span>Tu Amigo Inversor</a>
    <ul class="nav-links">
%(links)s
    </ul>
    <div class="nav-actions">
      <button class="icon-btn" id="themeToggle" type="button" aria-label="Cambiar a modo claro">
        <svg class="icon i-sun"><use href="#i-sun"/></svg><svg class="icon i-moon"><use href="#i-moon"/></svg>
      </button>
      <a href="%(sub)s" class="btn btn-primary btn-sm nav-cta magnetic">Empieza gratis</a>
      <button class="icon-btn burger" id="burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu"><svg class="icon"><use href="#i-menu"/></svg></button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <ul>
%(links)s
      <li><a href="%(sub)s" class="btn btn-primary" style="margin-top:.5rem">Empieza gratis · 3 meses</a></li>
    </ul>
  </div>
</header>
''' % dict(sprite=SPRITE, logo=logo, links=links, sub=sub)


def footer_and_floating(base, home):
    sub = '#suscripcion' if home else base + 'index.html#suscripcion'
    test = '#test' if home else base + 'index.html#test'
    return '''
<!-- =========================== PIE =========================== -->
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a href="%(logo)s" class="logo" style="margin-bottom:1rem"><span class="logo-mark" aria-hidden="true">TA</span>Tu Amigo Inversor</a>
        <p>Comparto las estrategias que utilizo para gestionar mi propio dinero, basadas en reglas claras y sin predicciones.</p>
        <p style="margin-top:.8rem"><a href="mailto:info@tuamigoinversor.com">info@tuamigoinversor.com</a></p>
      </div>
      <nav aria-label="Carteras permanentes"><h2>Cartera permanente</h2><ul><li><a href="%(base)scartera-permanente-conservadora-roca/index.html">ROCA</a></li><li><a href="%(base)scartera-inversion-crecimiento-impulso/index.html">IMPULSO</a></li><li><a href="%(base)splan-pensiones-moderado-horizonte/index.html">HORIZONTE</a></li></ul></nav>
      <nav aria-label="Asignación táctica"><h2>Asignación táctica</h2><ul><li><a href="%(base)sinversion-tactica-geda/index.html">GEDA</a></li><li><a href="%(base)sinversion-tematica-gen-z/index.html">GEN-Z</a></li><li><a href="%(base)sinversion-criptomonedas-crypto/index.html">CRYPTO</a></li></ul></nav>
      <nav aria-label="Herramientas y proyecto"><h2>Herramientas</h2><ul><li><a href="%(test)s" data-quiz>Test de perfil</a></li><li><a href="%(base)scomparador/index.html">Comparador</a></li><li><a href="%(base)ssimulador/index.html">Simulador</a></li><li><a href="%(base)smetodologia/index.html">Metodología</a></li><li><a href="%(base)sblog/index.html">Blog</a></li><li><a href="%(base)ssobre-mi/index.html">Sobre mí</a></li></ul></nav>
      <nav aria-label="Legal"><h2>Legal</h2><ul><li><a href="#">Aviso legal <span class="ph">[PLACEHOLDER]</span></a></li><li><a href="#">Política de privacidad <span class="ph">[PLACEHOLDER]</span></a></li><li><a href="#" id="cookieSettings">Configurar cookies</a></li></ul></nav>
    </div>
    <div class="legal">
      <p><strong>Aviso:</strong> la información publicada en esta web tiene carácter meramente informativo y no constituye asesoramiento financiero ni una recomendación personalizada de inversión. Las inversiones conllevan riesgo y pueden implicar la pérdida total o parcial del capital. Las rentabilidades pasadas no garantizan rentabilidades futuras. Cada inversor debe realizar su propio análisis y tomar decisiones en función de su situación personal.</p>
      <p style="margin-top:.8rem">© 2026 Tu Amigo Inversor.</p>
    </div>
  </div>
</footer>

<!-- Test de perfil (ventana emergente) -->
<div class="modal" id="quizModal" aria-hidden="true">
  <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="quizTitle">
    <button class="icon-btn modal-close" type="button" aria-label="Cerrar test"><svg class="icon"><use href="#i-x"/></svg></button>
    <div class="modal-content">
      <span class="eyebrow">Test de perfil</span>
      <h2 id="quizTitle" style="font-size:var(--fs-xl);margin:.3rem 0 .4rem">¿Qué estrategia encaja contigo?</h2>
      <p style="color:var(--muted);margin-bottom:1.4rem">Cinco preguntas, un minuto. Te propongo una estrategia o una combinación orientativa.</p>
      <div class="quiz" id="quiz" aria-live="polite"></div>
    </div>
  </div>
</div>
@@EXTRA_MODAL@@
<!-- Cookies -->
<div class="cookie" id="cookie" role="dialog" aria-labelledby="ckTitle" aria-describedby="ckText">
  <strong id="ckTitle">Tu privacidad</strong>
  <p id="ckText">Uso solo cookies técnicas necesarias. Con tu consentimiento, usaría cookies analíticas para mejorar la web. Puedes cambiar tu elección en cualquier momento desde el pie de página.</p>
  <div class="cta-row">
    <button class="btn btn-ghost btn-sm" type="button" id="ckReject">Rechazar</button>
    <button class="btn btn-primary btn-sm" type="button" id="ckAccept">Aceptar</button>
  </div>
</div>

<button class="icon-btn to-top" id="toTop" type="button" aria-label="Volver arriba"><svg class="icon"><use href="#i-up"/></svg></button>
<div class="sticky-cta" id="stickyCta"><small><strong>3 meses gratis</strong><br>Acceso a las 6 estrategias</small><a href="%(sub)s" class="btn btn-primary btn-sm">Empezar</a></div>
</body>
</html>
''' % dict(base=base, logo=('#main' if home else base + 'index.html'), test=test, sub=sub, sobre=SOBRE_MI)
