"""Assemble index.html from src/template.html, src/profiles.js, data.js and the 50m world map.
Usage: python scripts/assemble.py data.js world-50m.json > index.html"""
import sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
t = (root / 'src/template.html').read_text()
t = t.replace('/*PROFILES*/', (root / 'src/profiles.js').read_text())
t = t.replace('/*DATA*/', pathlib.Path(sys.argv[1]).read_text())
t = t.replace('/*WORLD*/', pathlib.Path(sys.argv[2]).read_text())
sys.stdout.write(t)
