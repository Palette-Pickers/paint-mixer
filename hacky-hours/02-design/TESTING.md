# Testing

## Stack

- **Jest** — test runner
- **React Testing Library** — component rendering and interaction
- **ts-jest** — TypeScript support in Jest
- **jest-environment-jsdom** — browser environment simulation

Run tests: `npm test` (with coverage) or `npm run unit` (watch mode).

## Coverage

Tests exist for:

| Area | File(s) |
|------|---------|
| Color conversion utilities | `src/utils/colorConversion.test.tsx` |
| Palette manager hook | `src/data/hooks/usePaletteManager.test.tsx` |
| AddColorUIComponent | `src/components/AddColorUIComponent/AddColorUIComponent.test.tsx` |
| ColorBoxUI | `src/components/ColorBoxUI/ColorBoxUI.test.tsx` |
| ColorPicker | `src/components/ColorPicker/ColorPicker.test.tsx` |
| ColorSwatches | `src/components/ColorSwatches/ColorSwatches.test.tsx` |
| MixedColorContainer | `src/components/MixedColorContainer/MixedColorContainer.test.tsx` |
| MixGraph | `src/components/MixGraph/MixGraph.test.tsx` |
| TargetColorContainer | `src/components/TargetColorContainer/TargetColorContainer.test.tsx` |

## Known Gaps

- [ ] `Mixer.tsx` (orchestrator) has no dedicated tests — the most logic-heavy component
- [ ] `isDark.ts` utility has no unit tests
- [ ] `useColorMatching`, `useColorName`, `useLocalStorage`, `useSwatchAdder` hooks have no tests
- [ ] No integration tests covering the full mix → save → reload flow
- [ ] No accessibility tests (axe-core or similar)

## Definition of Done

A task is considered complete when:
- [ ] Implementation matches the relevant design document
- [ ] No secrets or credentials in code or commit history
- [ ] User input that crosses a trust boundary is validated
- [ ] Error messages don't expose internal state
- [ ] Change has been manually tested against the relevant user journey
- [ ] Existing tests still pass (`npm test`)
- [ ] New logic has at least one test covering the happy path
