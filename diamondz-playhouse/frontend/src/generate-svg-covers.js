// Simple SVG-based cover generator that runs in browser
const fs = require('fs');
const path = require('path');

const comics = [
  {
    id: '1',
    title: 'The Velvet Touch',
    subtitle: 'Episode 1',
    filename: 'velvet-touch-cover.svg',
    colors: { start: '#8B008B', end: '#FF1493' },
    icon: '💎'
  },
  {
    id: '2',
    title: "Don't Hate\nthe Player",
    subtitle: 'Episode 2',
    filename: 'dont-hate-player-cover.svg',
    colors: { start: '#FF6B00', end: '#FFD700' },
    icon: '🎰'
  },
  {
    id: '3',
    title: 'The Getaway\nGlitch',
    subtitle: 'Episode 3',
    filename: 'getaway-glitch-cover.svg',
    colors: { start: '#00CED1', end: '#1E90FF' },
    icon: '🏎️'
  },
  {
    id: '4',
    title: 'The Trap\nCard',
    subtitle: 'Episode 4',
    filename: 'trap-card-cover.svg',
    colors: { start: '#8B0000', end: '#DC143C' },
    icon: '👁️'
  },
  {
    id: '5',
    title: 'Respect the\nHustle',
    subtitle: 'Episode 5',
    filename: 'respect-hustle-cover.svg',
    colors: { start: '#4B0082', end: '#9400D3' },
    icon: '👑'
  },
  {
    id: '6',
    title: 'The Chase\nBegins',
    subtitle: 'Season Finale',
    filename: 'chase-begins-cover.svg',
    colors: { start: '#000000', end: '#FFD700' },
    icon: '✨'
  },
  {
    id: 'B',
    title: "Yago's\nRedemption",
    subtitle: 'Bonus Story',
    filename: 'yago-redemption-cover.svg',
    colors: { start: '#00FF00', end: '#00FFFF' },
    icon: '🤖'
  }
];

const outputDir = path.join(__dirname, '../public/assets/comics');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

comics.forEach((comic) => {
  const titleLines = comic.title.split('\n');
  const titleY = titleLines.length === 1 ? 420 : 390;
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${comic.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${comic.colors.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${comic.colors.end};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="vignette${comic.id}" cx="50%" cy="50%" r="80%">
      <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
      <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.7" />
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="8" flood-opacity="0.8"/>
    </filter>
  </defs>
  
  <!-- Background gradient -->
  <rect width="600" height="900" fill="url(#grad${comic.id})"/>
  
  <!-- Diagonal pattern -->
  <g opacity="0.1" stroke="white" stroke-width="2" fill="none">
    ${Array.from({length: 30}, (_, i) => {
      const x = -900 + (i * 40);
      return `<line x1="${x}" y1="0" x2="${x + 900}" y2="900"/>`;
    }).join('\n    ')}
  </g>
  
  <!-- Vignette overlay -->
  <rect width="600" height="900" fill="url(#vignette${comic.id})"/>
  
  <!-- Frame borders -->
  <rect x="20" y="20" width="560" height="860" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="8"/>
  <rect x="30" y="30" width="540" height="840" fill="none" stroke="rgba(255,215,0,0.5)" stroke-width="3"/>
  
  <!-- Series branding -->
  <text x="300" y="80" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="rgba(255,255,255,0.95)" text-anchor="middle">
    THE PIMPIRE CHRONICLES
  </text>
  <text x="300" y="120" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.95)" text-anchor="middle">
    ◆
  </text>
  
  <!-- Main title -->
  <g filter="url(#shadow)">
    ${titleLines.map((line, i) => 
      `<text x="300" y="${titleY + (i * 70)}" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${line}</text>`
    ).join('\n    ')}
  </g>
  
  <!-- Subtitle -->
  <text x="300" y="${titleY + (titleLines.length * 70) + 20}" font-family="Arial, sans-serif" font-size="28" font-style="italic" fill="#FFD700" text-anchor="middle" filter="url(#shadow)">
    ${comic.subtitle}
  </text>
  
  <!-- Theme icon -->
  <text x="300" y="720" font-family="Arial, sans-serif" font-size="120" fill="white" text-anchor="middle" filter="url(#shadow)">
    ${comic.icon}
  </text>
  
  <!-- Bottom tagline -->
  <text x="300" y="820" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="rgba(255,255,255,0.9)" text-anchor="middle" filter="url(#shadow)">
    DIAMONDZ PLAYHOUSE
  </text>
  
  <!-- Episode badge -->
  <circle cx="520" cy="80" r="35" fill="rgba(255,215,0,0.9)"/>
  <text x="520" y="90" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="black" text-anchor="middle">
    ${comic.id}
  </text>
</svg>`;

  const outputPath = path.join(outputDir, comic.filename);
  fs.writeFileSync(outputPath, svg);
  console.log(`✅ Created: ${comic.filename}`);
});

console.log('\n🎨 All SVG cover art generated successfully!');
console.log(`📁 Location: ${outputDir}`);
console.log('\n💡 Tip: SVG files work in browsers and can be converted to JPG/PNG later if needed');
