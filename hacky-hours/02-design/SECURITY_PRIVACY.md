# Security & Privacy

## Privacy Posture

Paint Mixer collects no user data. There are no accounts, no login, no analytics, and no server. The only persistence is localStorage in the user's own browser.

**Data inventory:**
| Data | Where stored | Transmitted? |
|------|-------------|-------------|
| User's palette (colors + names) | localStorage (`'savedPalette'`) | Never |

Nothing else is collected or stored.

## Attack Surface

The app is a static client-side SPA hosted on Netlify. There is no backend to attack, no database, no authentication system, and no API keys in the codebase.

**Trust boundaries:**
- User-entered color values (hex, RGB) are parsed by `tinycolor2` — no eval, no DOM injection risk
- No user-generated content is rendered as HTML
- No external API calls at runtime — color naming uses the bundled `color-name-list` library with local nearest-color matching (no network requests)

## Dependency Risk

The main risk surface is supply chain: the app has many npm dependencies. Key ones to keep updated:
- `mixbox` — core mixing engine
- `react` / `react-dom`
- `@uiw` color libraries
- `webpack` and build tooling

## Known Issues

- No Content Security Policy header configured (Netlify default)
- No Subresource Integrity on any loaded assets
- `package.json` lists `license: "ISC"` — should be corrected to `"MIT"` (see LICENSING.md)
