import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0d1530"/>
      <stop offset="100%" stop-color="#0a0e1a"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#00f5ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>

  <!-- グロー背景 -->
  <circle cx="256" cy="256" r="220" fill="url(#glow)"/>

  <!-- 外リング（薄め） -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.25"/>

  <!-- メインリング -->
  <circle cx="256" cy="256" r="175" fill="none" stroke="#1e2d50" stroke-width="18"/>

  <!-- プログレスアーク（約75% = 270deg） -->
  <circle cx="256" cy="256" r="175"
    fill="none"
    stroke="url(#arcGrad)"
    stroke-width="18"
    stroke-linecap="round"
    stroke-dasharray="824 275"
    stroke-dashoffset="275"
    transform="rotate(-90 256 256)"
  />

  <defs>
    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bf00ff"/>
      <stop offset="100%" stop-color="#00f5ff"/>
    </linearGradient>
  </defs>

  <!-- グロードット（先端） -->
  <circle cx="256" cy="81" r="12" fill="#00f5ff" filter="url(#blur)" opacity="0.9"/>
  <circle cx="256" cy="81" r="6" fill="#ffffff"/>

  <!-- 内側の装飾リング -->
  <circle cx="256" cy="256" r="140" fill="none" stroke="#00f5ff" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="4 8"/>

  <!-- 時計の目盛り（12個） -->
  ${Array.from({length: 12}, (_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180
    const r1 = 152, r2 = i % 3 === 0 ? 168 : 160
    const x1 = 256 + r1 * Math.cos(angle)
    const y1 = 256 + r1 * Math.sin(angle)
    const x2 = 256 + r2 * Math.cos(angle)
    const y2 = 256 + r2 * Math.sin(angle)
    const w = i % 3 === 0 ? 3 : 1.5
    const op = i % 3 === 0 ? 0.6 : 0.3
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#00f5ff" stroke-width="${w}" stroke-opacity="${op}"/>`
  }).join('\n  ')}

  <!-- 中央：時計の針 -->
  <!-- 分針 -->
  <line x1="256" y1="256" x2="256" y2="120"
    stroke="#00f5ff" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
  <!-- 時針 -->
  <line x1="256" y1="256" x2="320" y2="210"
    stroke="#bf00ff" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
  <!-- 秒針 -->
  <line x1="256" y1="280" x2="256" y2="108"
    stroke="#ff2d78" stroke-width="2" stroke-linecap="round" opacity="0.8"/>

  <!-- 中心ドット -->
  <circle cx="256" cy="256" r="10" fill="#0a0e1a" stroke="#00f5ff" stroke-width="3"/>
  <circle cx="256" cy="256" r="4" fill="#00f5ff"/>

  <!-- コーナー装飾 -->
  <line x1="32" y1="80" x2="80" y2="80" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="80" x2="32" y2="128" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="80" x2="432" y2="80" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="80" x2="480" y2="128" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="432" x2="80" y2="432" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="32" y1="432" x2="32" y2="384" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="432" x2="432" y2="432" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
  <line x1="480" y1="432" x2="480" y2="384" stroke="#00f5ff" stroke-width="2" stroke-opacity="0.4"/>
</svg>`

writeFileSync('./icon-source.svg', svg)

await sharp(Buffer.from(svg))
  .resize(512, 512)
  .png()
  .toFile('./icon-512.png')

console.log('icon-512.png generated!')
