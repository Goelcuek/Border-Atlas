"""Assemble index.html (GitHub Pages) from the src/ files.
Usage: python scripts/assemble.py data.js world-50m.json > index.html"""
import sys, pathlib
src = pathlib.Path(__file__).resolve().parent.parent / 'src'
t = (src / 'template.html').read_text()
mc = (src / 'mapcode.js').read_text()
mc = mc.replace("  const k=Math.max(1,Math.min(MAXK,.7/Math.max((x1-x0)/cw,(y1-y0)/ch)));\n  const t=d3.zoomIdentity.translate(cw/2,ch/2)",
                "  const ph=matchMedia('(max-width:720px)').matches,vh=ph?ch*.32:ch,cy=ph?ch*.3:ch/2;\n  const k=Math.max(1,Math.min(MAXK,.7/Math.max((x1-x0)/cw,(y1-y0)/vh)));\n  const t=d3.zoomIdentity.translate(cw/2,cy)")
for key, f in [('PRELUDE', 'prelude.js'), ('HELPERS', 'helpers.js'), ('PROFILES', 'profiles.js')]:
    t = t.replace(f'/*{key}*/', (src / f).read_text())
t = t.replace('/*MAPCODE*/', mc)
t = t.replace('/*DATA*/', pathlib.Path(sys.argv[1]).read_text()).replace('/*WORLD*/', pathlib.Path(sys.argv[2]).read_text())
i = t.index('</style>') + len('</style>')
sys.stdout.write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
                 + t[:i] + '\n</head>\n<body>\n' + t[i:] + '\n</body>\n</html>\n')
