# Border Atlas

Interactive world map of visa and entry requirements. Pick a passport to see every destination coloured by what you need (visa-free, eTA, visa on arrival, e-Visa, visa required), or flip to "Travelling to" to see what every nationality needs to enter the selected country. Each country has an entry-requirements panel with passport validity, travel authorisations, arrival cards, fees and a link to the official source.

**Live site:** https://goelcuek.github.io/border-atlas/

## Files
- `index.html` – the complete site in one file (data and map geometry embedded; d3 and topojson load from cdnjs).
- `src/template.html` – page source with `/*DATA*/` and `/*WORLD*/` placeholders.
- `scripts/build_data.py` – builds the visa matrix from the Passport Index dataset and applies the 2025–2026 policy updates.

## Data
- Visa matrix: [Passport Index open dataset](https://github.com/ilyankou/passport-index-dataset) (January 2025), patched for: UK ETA for all visa-exempt nationals, Israel ETA-IL, Brazil visas for US/CA/AU, China's 30-day visa-free list (incl. UK, Canada, Russia).
- Country metadata: [mledoze/countries](https://github.com/mledoze/countries).
- Map: Natural Earth via [world-atlas](https://github.com/topojson/world-atlas).

Entry rules change often. Always confirm with the official source before travelling.
