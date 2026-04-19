# Licensing

## Project License

**MIT** — open source, forkable, others can use and build on it.

**Action required:** `package.json` currently declares `"license": "ISC"`. This should be corrected to `"license": "MIT"` to match the README and the `LICENSE` file (if one exists; add one if not).

## Key Dependency Licenses

| Package | License | Notes |
|---------|---------|-------|
| `react`, `react-dom` | MIT | |
| `mixbox` | MIT | Core mixing engine |
| `tinycolor2` | MIT | |
| `@uiw/color-convert` et al. | MIT | |
| `color-name-list` | MIT | Bundled — no runtime network call |
| `react-color` | MIT | |
| `chance` | MIT | |
| `use-debounce` | MIT | |
| `react-icons` | MIT | |
| `react-transition-group` | BSD-3-Clause | Compatible with MIT project |

No GPL or copyleft dependencies detected. The project is safe to distribute under MIT.

## Future Dependency Review

Before adding any new dependency, check its license for compatibility with MIT. Avoid AGPL or GPL dependencies — they would impose restrictions on distribution.

## Commercial Paint Database (Future — V2+)

If a commercial paint database is built by crawling paint manufacturer or retailer sites, review the terms of service of each source before scraping. Some sites explicitly prohibit automated access or commercial use of their data.
