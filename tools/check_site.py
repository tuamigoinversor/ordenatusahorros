# -*- coding: utf-8 -*-
"""Comprobación previa a publicar:  python3 tools/check_site.py
Revisa: enlaces y anclas internos, título y meta descripción, noindex, y que la rentabilidad anual media
de tai.js coincida con la de cada ficha."""
import re, glob, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
rd = lambda f: open(f, encoding='utf8', errors='ignore').read()
files = sorted(glob.glob('**/index.html', recursive=True)); ids = {f: set(re.findall(r'\bid="([^"]+)"', rd(f))) for f in files}
errs, warns = [], []
for f in files:
    s = rd(f)
    for m in re.finditer(r'(?:href|src)="([^"#][^"]*|#[^"]*)"', s):
        u = m.group(1)
        if re.match(r'(https?:|mailto:|data:|tel:)', u) or u == '#': continue
        p, _, frag = u.partition('#')
        tgt = f if p == '' else os.path.normpath(os.path.join(os.path.dirname(f), p))
        if tgt.endswith('/'): tgt += 'index.html'
        if not os.path.exists(tgt):
            (warns if 'jose.jpg' in u else errs).append('Enlace roto: %s -> %s' % (f, u)); continue
        if frag and frag != 'test' and tgt.endswith('.html') and frag not in ids.get(tgt, set()): errs.append('Ancla inexistente: %s -> %s' % (f, u))
    if 'http-equiv="refresh"' in s: continue
    if not re.search(r'<title>[^<]{5,}', s): errs.append('Sin <title>: ' + f)
    if not re.search(r'<meta name="description" content="[^"]{30,}', s): errs.append('Sin meta descripción: ' + f)
ni = [f for f in files if 'noindex' in rd(f)]
if ni: warns.append('%d páginas con noindex (correcto en pruebas; quítalo al lanzar) y robots.txt: %s' % (len(ni), 'bloquea todo' if re.search(r'Disallow:\s*/\s*$', rd('robots.txt'), re.M) else 'sin bloqueo total'))
# métricas: tai.js vs fichas
slugs = {'ROCA': 'cartera-permanente-conservadora-roca', 'IMPULSO': 'cartera-inversion-crecimiento-impulso', 'HORIZONTE': 'plan-pensiones-moderado-horizonte', 'GEDA': 'inversion-tactica-geda', 'GEN-Z': 'inversion-tematica-gen-z', 'CRYPTO': 'inversion-criptomonedas-crypto'}
tai = rd('assets/js/tai.js')
for k, sl in slugs.items():
    a = float(re.search(r"id:'%s'.*?avg:([\d.]+)" % re.escape(k), tai, re.S).group(1))
    t = re.sub(r'<[^>]+>', '|', rd(sl + '/index.html')); m = re.search(r'Rentabilidad anual media[^0-9+\-−]{0,60}\+?([\d,]+)\s?%', t)
    if m and abs(float(m.group(1).replace(',', '.')) - a) > 0.05: errs.append('Rent. media distinta en %s: tai.js %s vs ficha %s' % (k, a, m.group(1)))
print('\n'.join('ERROR  ' + e for e in errs) or 'Sin errores.'); print('\n'.join('AVISO  ' + w for w in warns))
sys.exit(1 if errs else 0)
