// EduFun — rendu image par image d'une animation (videos/<CODE>/animation.html) en MP4.
// Usage : node render.js <dossier> [--stills 3,20,40]   (nécessite Playwright et ffmpeg)
// Produit <dossier>/<CODE>.mp4 et <dossier>/voix-off.srt (texte minuté de la voix off).
// Si voix.py a été lancé (timing.json + voix.m4a), l'animation est calée sur la voix et la voix est ajoutée.
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
  const timingFile = path.join(dir, 'timing.json'), voice = path.join(dir, 'voix.m4a');
  const timing = fs.existsSync(timingFile) && fs.existsSync(voice) ? JSON.parse(fs.readFileSync(timingFile, 'utf8')) : null;
  // Temps final → temps de l'animation (interpolation entre les points de calage).
  const warp = T => { if (!timing) return T; const a = timing.anchors; for (let i = 1; i < a.length; i++) if (T <= a[i][0]) { const [n0, o0] = a[i - 1], [n1, o1] = a[i]; return o0 + (o1 - o0) * (n1 > n0 ? (T - n0) / (n1 - n0) : 0); } return a[a.length - 1][1]; };
  const duration = timing ? timing.duration : await page.evaluate(() => DURATION);
  const out = path.join(dir, code + '.mp4');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    ...(timing ? ['-i', voice, '-map', '0:v', '-map', '1:a', '-c:a', 'copy', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(duration * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => render(t), warp(i / FPS));
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 250 === 0) process.stdout.write(`${Math.round(i * 100 / frames)}% `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  // Texte de la voix off, minuté (SRT) : le professeur ou le comédien l'enregistre sur la vidéo.
  const caps = timing ? timing.captions.map(([a, b, txt]) => [a, b, txt]) : await page.evaluate(() => CAPTIONS);
  const ts = s => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  if (!timing) fs.writeFileSync(path.join(dir, 'voix-off.srt'), caps.map(([a, b, txt], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${txt}\n`).join('\n'));
  await browser.close(); console.log('\n' + out);
})();
