# Vidéos EduFun en motion illustration

Chaque leçon a son dossier (`CM1-HG-02/`…) :
- `animation.html` : l'animation (illustrations SVG + mouvements calculés image par image) ;
- `voix-off.srt` : le texte de la voix off, minuté ;
- `<CODE>.mp4` : la vidéo finale (copiée dans `src/main/resources/static/videos/`).

## Ajouter la voix off (ElevenLabs)
Prérequis : `api.elevenlabs.io` autorisé dans l'accès réseau et la clé dans la variable `ELEVENLABS_API_KEY`.
Voix retenues : **Dan** pour le primaire, **Robert** pour le collège et le lycée.

```bash
cd edufun/videos
python3 voix.py CM1-HG-02 --voice Dan            # génère chaque phrase, cale l'animation, met à jour les points de vérification
PLAYWRIGHT=/opt/node-tools/node_modules/playwright node render.js CM1-HG-02   # vidéo finale avec la voix
cp CM1-HG-02/CM1-HG-02.mp4 ../src/main/resources/static/videos/
```
`python3 voix.py <dossier> --dry-run` teste le calage sans ElevenLabs (bips à la place de la voix).
Vérifier que l'abonnement ElevenLabs autorise l'usage commercial des voix.
