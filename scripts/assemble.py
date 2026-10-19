"""Assemble index.html (GitHub Pages) from src/.
Usage: python scripts/assemble.py data.js world-50m.json > index.html"""
import sys, pathlib
src = pathlib.Path(__file__).resolve().parent.parent / 'src'
head = (src / 'head.html').read_text()
js = (src / 'script.js').read_text()
js = js.replace('/*PROFILES*/', (src / 'profiles.js').read_text()).replace('/*PROFILES_TR*/', (src / 'profiles_tr.js').read_text()).replace('/*MAPCODE*/', (src / 'mapcode.js').read_text())
cdn = ('<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>\n'
       '<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>\n')
art = head + cdn + '<script>' + pathlib.Path(sys.argv[1]).read_text() + '</script>\n<script>window.WORLD=' + pathlib.Path(sys.argv[2]).read_text() + ';</script>\n<script>\n' + js + '\n</script>\n'
i = art.index('</style>') + len('</style>')
sys.stdout.write('<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
                 + art[:i] + '\n</head>\n<body>\n' + art[i:] + '\n</body>\n</html>\n')
