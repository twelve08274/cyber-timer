import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'

const THEMES = {
  cyber:     { primary: '#00f5ff', secondary: '#bf00ff', bg1: '#0d1530', bg2: '#0a0e1a' },
  matrix:    { primary: '#00ff41', secondary: '#00aa2a', bg1: '#041004', bg2: '#020c02' },
  synthwave: { primary: '#ff6ec7', secondary: '#f5c400', bg1: '#2a0d30', bg2: '#1a0a1a' },
  ghost:     { primary: '#e8f0ff', secondary: '#8899bb', bg1: '#111318', bg2: '#0e1015' },
  kawaii:    { primary: '#ff6eb4', secondary: '#c084fc', bg1: '#200a22', bg2: '#1a0818' },
  lofi:      { primary: '#e8a87c', secondary: '#f5c400', bg1: '#1a1008', bg2: '#120d08' },
  sakura:    { primary: '#ffb7c5', secondary: '#f9a8d4', bg1: '#160a12', bg2: '#0f0810' },
  forest:    { primary: '#4ade80', secondary: '#86efac', bg1: '#081408', bg2: '#061008' },
  arctic:    { primary: '#e0f2fe', secondary: '#7dd3fc', bg1: '#0a1220', bg2: '#080e14' },
}

function makeSvg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${t.bg1}"/>
      <stop offset="100%" stop-color="${t.bg2}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${t.primary}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${t.primary}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.secondary}"/>
      <stop offset="100%" stop-color="${t.primary}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="220" fill="url(#glow)"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.2"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="${t.bg1}" stroke-width="18"/>
  <circle cx="256" cy="256" r="175" fill="none" stroke="url(#arcGrad)" stroke-width="18"
    stroke-linecap="round" stroke-dasharray="824 275" stroke-dashoffset="275"
    transform="rotate(-90 256 256)"/>
  <circle cx="256" cy="81" r="12" fill="${t.primary}" filter="url(#blur)" opacity="0.9"/>
  <circle cx="256" cy="81" r="6" fill="#ffffff"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="${t.primary}" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="4 8"/>
  ${Array.from({length: 12}, (_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180
    const r1 = 152, r2 = i % 3 === 0 ? 168 : 160
    const x1 = (256 + r1 * Math.cos(angle)).toFixed(1)
    const y1 = (256 + r1 * Math.sin(angle)).toFixed(1)
    const x2 = (256 + r2 * Math.cos(angle)).toFixed(1)
    const y2 = (256 + r2 * Math.sin(angle)).toFixed(1)
    const w = i % 3 === 0 ? 3 : 1.5
    const op = i % 3 === 0 ? 0.6 : 0.3
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${t.primary}" stroke-width="${w}" stroke-opacity="${op}"/>`
  }).join('\n  ')}
  <line x1="256" y1="256" x2="256" y2="120" stroke="${t.primary}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
  <line x1="256" y1="256" x2="320" y2="210" stroke="${t.secondary}" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
  <line x1="256" y1="280" x2="256" y2="108" stroke="${t.primary}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  <circle cx="256" cy="256" r="10" fill="${t.bg2}" stroke="${t.primary}" stroke-width="3"/>
  <circle cx="256" cy="256" r="4" fill="${t.primary}"/>
  <line x1="32" y1="80" x2="80" y2="80" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="80" x2="32" y2="128" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="80" x2="432" y2="80" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="80" x2="480" y2="128" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="432" x2="80" y2="432" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="432" x2="32" y2="384" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="432" x2="432" y2="432" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="432" x2="480" y2="384" stroke="${t.primary}" stroke-width="2" stroke-opacity="0.4"/>
</svg>`
}

mkdirSync('./public/icons', { recursive: true })

for (const [name, theme] of Object.entries(THEMES)) {
  const svg = makeSvg(theme)
  const pngBuf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer()
  writeFileSync(`./public/icons/${name}.png`, pngBuf)
  console.log(`✓ ${name}.png`)
}

// デフォルト(cyber)をTauriアイコンとしても出力
const defaultSvg = makeSvg(THEMES.cyber)
await sharp(Buffer.from(defaultSvg)).resize(512, 512).png().toFile('./icon-512.png')
console.log('✓ icon-512.png (default)')
