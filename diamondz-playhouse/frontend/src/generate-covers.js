const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

// Comic cover designs
const comics = [
  {
    id: '1',
    title: 'The Velvet Touch',
    subtitle: 'Episode 1',
    filename: 'velvet-touch-cover.jpg',
    gradient: ['#8B008B', '#FF1493'], // Purple to Pink
    theme: 'heist',
    icon: '💎'
  },
  {
    id: '2',
    title: "Don't Hate the Player",
    subtitle: 'Episode 2',
    filename: 'dont-hate-player-cover.jpg',
    gradient: ['#FF6B00', '#FFD700'], // Orange to Gold
    theme: 'arcade',
    icon: '🎰'
  },
  {
    id: '3',
    title: 'The Getaway Glitch',
    subtitle: 'Episode 3',
    filename: 'getaway-glitch-cover.jpg',
    gradient: ['#00CED1', '#1E90FF'], // Turquoise to Blue
    theme: 'action',
    icon: '🏎️'
  },
  {
    id: '4',
    title: 'The Trap Card',
    subtitle: 'Episode 4',
    filename: 'trap-card-cover.jpg',
    gradient: ['#8B0000', '#DC143C'], // Dark Red to Crimson
    theme: 'tech',
    icon: '👁️'
  },
  {
    id: '5',
    title: 'Respect the Hustle',
    subtitle: 'Episode 5 - King Pimpin POV',
    filename: 'respect-hustle-cover.jpg',
    gradient: ['#4B0082', '#9400D3'], // Indigo to Violet
    theme: 'kingpin',
    icon: '👑'
  },
  {
    id: '6',
    title: 'The Chase Begins',
    subtitle: 'Episode 6 - Season Finale',
    filename: 'chase-begins-cover.jpg',
    gradient: ['#000000', '#FFD700'], // Black to Gold
    theme: 'finale',
    icon: '✨'
  },
  {
    id: 'bonus-yago',
    title: "Yago's Redemption",
    subtitle: 'Bonus Story',
    filename: 'yago-redemption-cover.jpg',
    gradient: ['#00FF00', '#00FFFF'], // Green to Cyan
    theme: 'ai',
    icon: '🤖'
  }
];

// Create cover art
const outputDir = path.join(__dirname, '../public/assets/comics');

// Make sure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

comics.forEach((comic) => {
  const width = 600;
  const height = 900;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, comic.gradient[0]);
  gradient.addColorStop(1, comic.gradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add diagonal pattern overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  for (let i = -height; i < width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // Add dark vignette
  const vignette = ctx.createRadialGradient(width / 2, height / 2, height / 4, width / 2, height / 2, height);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Add frame border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Add inner frame
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Series branding at top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('THE PIMPIRE CHRONICLES', width / 2, 80);

  // Diamond separator
  ctx.font = '32px Arial';
  ctx.fillText('◆', width / 2, 120);

  // Main title
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  // Split title into multiple lines if too long
  const words = comic.title.split(' ');
  const maxWidth = width - 100;
  let line = '';
  let y = height / 2 - 50;
  
  ctx.font = 'bold 60px Arial';
  
  words.forEach((word, index) => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line.trim(), width / 2, y);
      line = word + ' ';
      y += 70;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line.trim(), width / 2, y);

  // Subtitle
  ctx.shadowBlur = 10;
  ctx.font = 'italic 28px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.fillText(comic.subtitle, width / 2, y + 60);

  // Theme icon (large)
  ctx.shadowBlur = 20;
  ctx.font = '120px Arial';
  ctx.fillText(comic.icon, width / 2, height - 180);

  // Bottom tagline
  ctx.shadowBlur = 5;
  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('DIAMONDZ PLAYHOUSE', width / 2, height - 80);

  // Episode number badge
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
  ctx.beginPath();
  ctx.arc(width - 80, 80, 35, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(comic.id.toString().replace('bonus-', 'B'), width - 80, 90);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const outputPath = path.join(outputDir, comic.filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Created: ${comic.filename}`);
});

console.log('\n🎨 All cover art generated successfully!');
console.log(`📁 Location: ${outputDir}`);
