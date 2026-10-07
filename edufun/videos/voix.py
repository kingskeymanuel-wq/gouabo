#!/usr/bin/env python3
"""EduFun — voix off ElevenLabs pour une vidéo de leçon.

Usage :
    ELEVENLABS_API_KEY=... python3 voix.py CM1-HG-02 --voice Dan
    python3 voix.py CM1-HG-02 --dry-run          # essai hors ligne (bips à la place de la voix)

Étapes :
  1. lit le texte minuté de la voix off (<dossier>/voix-off.srt) ;
  2. fait dire chaque phrase par la voix ElevenLabs choisie (modèle multilingue, français) ;
  3. cale l'animation sur la voix : chaque phrase garde ses images, le temps est étiré ou
     resserré autour d'elle (timing.json, lu par render.js) ;
  4. assemble la piste voix.m4a (volume normalisé) et met à jour les points de vérification
     dans src/main/resources/static/videos/catalogue.txt.
Ensuite : node render.js <dossier> produit la vidéo finale avec la voix.
"""
import argparse, json, os, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

API = 'https://api.elevenlabs.io/v1'
MODEL = 'eleven_multilingual_v2'
GAP_MIN = 0.35        # silence minimal entre deux phrases (s)
TAIL = 0.4            # temps laissé après chaque phrase (s)
# Voix choisies pour EduFun : Dan (primaire, chaleureux), Robert (collège et lycée, calme et clair).
DEFAULT_VOICE = {'KIDS': 'Dan', 'PRESENTER': 'Robert'}


def srt(path):
    out = []
    for block in re.split(r'\n\s*\n', path.read_text(encoding='utf-8').strip()):
        lines = block.strip().splitlines()
        if len(lines) < 3:
            continue
        a, b = [sum(float(x) * m for x, m in zip(t.replace(',', '.').split(':'), (3600, 60, 1))) for t in lines[1].split(' --> ')]
        out.append([a, b, ' '.join(lines[2:])])
    return out


def api(path, key, body=None, accept='application/json'):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': accept})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    return data if accept != 'application/json' else json.loads(data)


def voice_id(name, key):
    """Identifiant de la voix : d'abord « Mes voix », sinon la bibliothèque partagée (ajoutée au compte)."""
    if re.fullmatch(r'[A-Za-z0-9]{20}', name):
        return name
    for v in api('/voices', key)['voices']:
        if v['name'].split(' ')[0].lower() == name.lower():
            return v['voice_id']
    shared = api('/shared-voices?' + urllib.parse.urlencode({'search': name, 'page_size': 20}), key)['voices']
    match = [v for v in shared if v['name'].split(' ')[0].lower() == name.lower()]
    if not match:
        sys.exit(f'Voix « {name} » introuvable sur ElevenLabs. Donnez son identifiant avec --voice.')
    v = match[0]
    api(f"/voices/add/{v['public_owner_id']}/{v['voice_id']}", key, {'new_name': v['name']})
    return v['voice_id']


def duration(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)]).decode())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dossier')
    ap.add_argument('--voice', help='Nom (Dan, Robert…) ou identifiant ElevenLabs de la voix')
    ap.add_argument('--style', default='KIDS', choices=['KIDS', 'PRESENTER'])
    ap.add_argument('--dry-run', action='store_true', help='Sans ElevenLabs : bips de la durée estimée, pour tester le calage')
    a = ap.parse_args()
    d = Path(a.dossier).resolve()
    caps = srt(d / 'voix-off.srt')
    vdir = d / 'voix'
    vdir.mkdir(exist_ok=True)

    # 1-2. Une phrase = un fichier audio
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not a.dry_run and not key:
        sys.exit('ELEVENLABS_API_KEY absente : ajoutez la clé dans les réglages de l\'environnement.')
    vid = None if a.dry_run else voice_id(a.voice or DEFAULT_VOICE[a.style], key)
    for i, (_, _, text) in enumerate(caps):
        f = vdir / f'{i + 1:02d}.mp3'
        if a.dry_run:
            est = max(1.0, len(text.split()) / 2.4)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', f'sine=frequency=330:duration={est:.2f}', '-b:a', '64k', str(f)], check=True)
            continue
        if f.exists() and f.stat().st_size > 0:
            continue
        body = {'text': text, 'model_id': MODEL, 'language_code': 'fr',
                'voice_settings': {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.35 if a.style == 'KIDS' else 0.15, 'use_speaker_boost': True},
                'previous_text': caps[i - 1][2] if i else None, 'next_text': caps[i + 1][2] if i + 1 < len(caps) else None}
        f.write_bytes(api(f'/text-to-speech/{vid}?output_format=mp3_44100_128', key, body, accept='audio/mpeg'))
        print(f'  {i + 1:02d}/{len(caps)} {text[:60]}')

    # 3. Calage : correspondances (temps final ↔ temps de l'animation)
    total_orig = float(re.search(r'const DURATION = ([\d.]+)', (d / 'animation.html').read_text(encoding='utf-8')).group(1))
    anchors, t_new, prev_orig_end, new_caps = [[0.0, 0.0]], 0.0, 0.0, []
    for i, (oa, ob, text) in enumerate(caps):
        dur = duration(vdir / f'{i + 1:02d}.mp3')
        gap = max(GAP_MIN if i else 0.0, oa - prev_orig_end)
        na = t_new + gap
        nb = na + dur + TAIL
        anchors += [[round(na, 3), oa], [round(nb, 3), ob]]
        new_caps.append([round(na, 3), round(nb, 3), text, round(dur, 3)])
        t_new, prev_orig_end = nb, ob
    total_new = t_new + (total_orig - prev_orig_end)
    anchors.append([round(total_new, 3), total_orig])
    (d / 'timing.json').write_text(json.dumps({'duration': round(total_new, 3), 'anchors': anchors, 'captions': new_caps}, ensure_ascii=False, indent=1), encoding='utf-8')

    # 4. Piste voix : chaque phrase posée à son instant, volume normalisé
    inputs, filt = [], []
    for i, c in enumerate(new_caps):
        inputs += ['-i', str(vdir / f'{i + 1:02d}.mp3')]
        filt.append(f'[{i}]adelay={int(c[0] * 1000)}:all=1[a{i}]')
    filt.append(''.join(f'[a{i}]' for i in range(len(new_caps))) + f'amix=inputs={len(new_caps)}:normalize=0,apad=whole_dur={total_new:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[out]')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[out]', '-c:a', 'aac', '-b:a', '160k', str(d / 'voix.m4a')], check=True)

    # Points de vérification : mêmes instants de l'animation, convertis en temps final
    def to_new(o):
        for (n0, o0), (n1, o1) in zip(anchors, anchors[1:]):
            if o0 <= o <= o1:
                return n0 + (n1 - n0) * ((o - o0) / (o1 - o0) if o1 > o0 else 0)
        return o
    cat = d.parent.parent / 'src/main/resources/static/videos/catalogue.txt'
    if cat.exists():
        lines = cat.read_text(encoding='utf-8').splitlines()
        for k, line in enumerate(lines):
            f = [x.strip() for x in line.split('|')]
            if f and f[0] == d.name and len(f) >= 6:
                olds = [sum(int(x) * m for x, m in zip(reversed(p.split(':')), (1, 60, 3600))) for p in re.split(r'[,\s]+', f[4]) if p]
                f[4] = ', '.join(f'{s // 60}:{s % 60:02d}' for s in (int(to_new(o)) for o in olds))
                if not a.dry_run:
                    f[3] = f'Voix : {a.voice or DEFAULT_VOICE[a.style]} (ElevenLabs)'
                lines[k] = ' | '.join(f)
                print('Points de vérification :', f[4])
        if not a.dry_run:
            cat.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Durée : {total_orig:.0f} s → {total_new:.1f} s. Lancer ensuite : node render.js {d.name}')


if __name__ == '__main__':
    main()
