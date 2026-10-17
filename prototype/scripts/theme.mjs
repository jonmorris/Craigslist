// Generates the Material 3 color scheme (light + dark) from the craigslist
// purple seed with Google's material-color-utilities — the same engine as
// Figma's Material Theme Builder and Android dynamic color — so these tokens
// map 1:1 to a Compose ColorScheme. Run: node scripts/theme.mjs
import { writeFileSync } from 'node:fs'
import {
  argbFromHex, hexFromArgb, Hct, SchemeFidelity, MaterialDynamicColors as C,
} from '@material/material-color-utilities'

export const SEED = '#9945C8' // purple sampled from the current app's buttons and peace sign

// Hand-tuned brand layer, pinned over the generated scheme (the original
// prototype palette: brighter neutral surfaces, softer pastel tiles).
// The generator still supplies every role not listed here.
const OVERRIDES = {
  light: {
    primary: '#6a2bb8', onPrimary: '#ffffff', primaryContainer: '#6a2bb8', onPrimaryContainer: '#ffffff',
    secondaryContainer: '#ebddfb', onSecondaryContainer: '#3f1673',
    surface: '#fcfafe', surfaceDim: '#ece8f1', surfaceContainerLowest: '#ffffff', surfaceContainerLow: '#f8f5fb',
    surfaceContainer: '#f3eef8', surfaceContainerHigh: '#efe9f5', surfaceContainerHighest: '#e7dff0',
    onSurface: '#1e1a24', onSurfaceVariant: '#5f576b', outline: '#817a8d', outlineVariant: '#dcd2e6',
  },
  dark: {
    primary: '#caa4ff', onPrimary: '#2a0b55', primaryContainer: '#caa4ff', onPrimaryContainer: '#2a0b55',
    secondaryContainer: '#3a2556', onSecondaryContainer: '#e8d8ff',
    surface: '#15121a', surfaceDim: '#0c0a10', surfaceContainerLowest: '#0f0d13', surfaceContainerLow: '#19161e',
    surfaceContainer: '#1f1a26', surfaceContainerHigh: '#241f2b', surfaceContainerHighest: '#2a2433',
    onSurface: '#ede7f4', onSurfaceVariant: '#aaa1b7', outline: '#7b7386', outlineVariant: '#342d3e',
  },
}

// Custom (extended) colors, hand-picked: [color, onColor, container, onContainer]
export const CUSTOM = {
  sale: { light: ['#5a2296', '#ffffff', '#efe4fb', '#5a2296'], dark: ['#d9bdff', '#2a0b55', '#2b1f3d', '#d9bdff'] },
  housing: { light: ['#14615a', '#ffffff', '#dbf0ec', '#14615a'], dark: ['#86d8cc', '#00332e', '#142e2c', '#86d8cc'] },
  jobs: { light: ['#744a04', '#ffffff', '#fbedd0', '#744a04'], dark: ['#f2c877', '#3d2800', '#352914', '#f2c877'] },
  services: { light: ['#234c93', '#ffffff', '#e0e9fb', '#234c93'], dark: ['#9dbef6', '#0a2a5c', '#182640', '#9dbef6'] },
  gigs: { light: ['#8c2f1e', '#ffffff', '#fbe2dc', '#8c2f1e'], dark: ['#f5a796', '#4f1409', '#3b1e19', '#f5a796'] },
  community: { light: ['#2f6219', '#ffffff', '#e2f0da', '#2f6219'], dark: ['#a9d98f', '#123400', '#1c2e17', '#a9d98f'] },
  good: { light: ['#1c7a43', '#ffffff', '#dcf2e3', '#14602f'], dark: ['#74d59b', '#003919', '#173b26', '#8ee0ae'] }, // free, below typical
  warn: { light: ['#a14a17', '#ffffff', '#fbe6d8', '#8a3d12'], dark: ['#f3b48e', '#4a1d00', '#42261a', '#f3b48e'] }, // above typical
}

// WCAG contrast, to verify every text/background pairing stays readable.
const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }

const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'surface', 'onSurface', 'onSurfaceVariant', 'surfaceDim', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'outline', 'outlineVariant', 'inverseSurface', 'inverseOnSurface', 'inversePrimary', 'scrim', 'shadow',
]
const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase())

const PAIRS = [
  ['onPrimary', 'primary'], ['onPrimaryContainer', 'primaryContainer'], ['onSecondaryContainer', 'secondaryContainer'],
  ['onSurface', 'surface'], ['onSurfaceVariant', 'surface'], ['onSurfaceVariant', 'surfaceContainerHigh'],
  ['primary', 'surface'], ['inverseOnSurface', 'inverseSurface'],
]
// WCAG 1.4.11: control boundaries (text fields, switches, radios, segmented) need 3:1
const UI_PAIRS = [['outline', 'surface'], ['outline', 'surfaceContainerLow'], ['outline', 'surfaceContainerHigh'], ['outline', 'surfaceContainerHighest']]
const failures = []

function block(isDark) {
  const mode = isDark ? 'dark' : 'light'
  const scheme = new SchemeFidelity(Hct.fromInt(argbFromHex(SEED)), isDark, 0)
  const role = {}
  for (const r of ROLES) role[r] = OVERRIDES[mode][r] ?? hexFromArgb(C[r].getArgb(scheme))
  const lines = ROLES.map(r => `  --md-sys-color-${kebab(r)}: ${role[r]};`)
  const check = (label, fg, bg, min) => { const c = contrast(fg, bg); if (c < min) failures.push(`${mode} ${label}: ${c.toFixed(2)}`) }
  for (const [fg, bg] of PAIRS) check(`${fg} on ${bg}`, role[fg], role[bg], 4.5)
  for (const [fg, bg] of UI_PAIRS) check(`${fg} on ${bg}`, role[fg], role[bg], 3)
  for (const [name, m] of Object.entries(CUSTOM)) {
    const [c, on, cont, onCont] = m[mode]
    lines.push(`  --md-ext-${name}: ${c};`, `  --md-ext-on-${name}: ${on};`,
      `  --md-ext-${name}-container: ${cont};`, `  --md-ext-on-${name}-container: ${onCont};`)
    check(`on-${name}-container`, onCont, cont, 4.5)
    check(`${name} on surface`, c, role.surface, 4.5)
  }
  return lines.join('\n')
}

const light = block(false)
const dark = block(true)
const css = `/* GENERATED by scripts/theme.mjs — do not edit by hand.
   Material 3 roles: generated from seed ${SEED} (SchemeFidelity), with the
   hand-tuned brand layer (OVERRIDES, CUSTOM) pinned on top. */
:root {
${light}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${dark.replace(/^/gm, '  ')}
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
${dark}
  color-scheme: dark;
}
`
writeFileSync('src/theme.css', css)
console.log('wrote src/theme.css')
console.log(failures.length ? 'CONTRAST TOO LOW\n  ' + failures.join('\n  ') : 'contrast: text pairs pass 4.5:1, control outlines pass 3:1')
