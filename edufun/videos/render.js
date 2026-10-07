// EduFun — rendu image par image d'une animation (videos/<CODE>/animation.html) en MP4.
// Usage : node render.js <dossier> [--stills 3,20,40]   (nécessite Playwright et ffmpeg)
// Produit <dossier>/<CODE>.mp4 (muet, prêt pour la voix off) et <dossier>/voix-off.srt (texte minuté).
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const dir = path.resolve(process.argv[2]); const code = path.basename(dir);
const stills = (process.argv.find(a => a.startsWith('--stills=')) || '').slice(9);
const FPS = 25;
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + path.join(dir, 'animation.html'));
  await page.evaluate(() => document.fonts.ready);
  if (stills) {
    for (const s of stills.split(',')) { await page.evaluate(t => render(t), +s); await page.screenshot({ path: path.join(dir, `still-${s}.png`) }); }
    await browser.close(); return;
  }
  const duration = await page.evaluate(() => DURATION);
  const out = path.join(dir, code + '.mp4');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(duration * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => render(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 250 === 0) process.stdout.write(`${Math.round(i * 100 / frames)}% `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  // Texte de la voix off, minuté (SRT) : le professeur ou le comédien l'enregistre sur la vidéo.
  const caps = await page.evaluate(() => CAPTIONS);
  const ts = s => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  fs.writeFileSync(path.join(dir, 'voix-off.srt'), caps.map(([a, b, txt], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${txt}\n`).join('\n'));
  await browser.close(); console.log('\n' + out);
})();
