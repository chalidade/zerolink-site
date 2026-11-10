# ZeroLink launch film (English, 32 s)

`media/zerolink-launch-en.mp4` is rendered with [Vigenco](https://github.com/chalidade/vigenco) from
`video/vigenco/films/zerolink-disaster-en`: an earthquake at 02:14, one family, no signal. It is the
Vigenco film "Saat bencana datang" (20261107-2032-zxdl) translated to English, with the ZeroLink palette and the PUAS mark.
The film uses Vigenco's shared motion library, so it renders only from inside a Vigenco checkout.

`video/vigenco/films/zerolink-launch-en` is the earlier, lighter cut (UI pieces and cursors), kept for reference.

To render again:

```bash
cp -r video/vigenco/films/zerolink-disaster-en <vigenco>/films/
cp video/vigenco/jobs/zerolink-disaster-en.json <vigenco>/jobs/
cd <vigenco> && node bin/vigenco.mjs render jobs/zerolink-disaster-en.json --out out/zerolink-launch-en.mp4
```

The music and sound effects are synthesized by Vigenco from the film's cues, so they carry no licence.

# Install guide film (40 s, vertical)

`media/zerolink-install-id.mp4` (Indonesian captions) and `media/zerolink-install-en.mp4` (English captions) come from
`video/vigenco/films/zerolink-install`, a self-contained Vigenco film: the site, the download, Chrome's permission,
"Allow apps from this source", Install, Play Protect scan, App installed, then ZeroLink opens. The language comes from
the job's `"lang"`. The six photos in `install/` are stills of the same film's phone screen.

```bash
cp -r video/vigenco/films/zerolink-install <vigenco>/films/
cp video/vigenco/jobs/zerolink-install-*.json <vigenco>/jobs/
cd <vigenco> && node bin/vigenco.mjs render jobs/zerolink-install-id.json --out out/zerolink-install-id.mp4
```

## Hands-on (English)

`films/zerolink-handson` walks through 13 app features in 53.6 s (vertical 1080x1920, 60 fps).
Render with `node bin/vigenco.mjs render jobs/zerolink-handson-en.json --out zerolink-handson-en.mp4`.
The screenshots in `assets/` show the Indonesian app UI; captions are English.

## Feature hands-on series (English, for pitching)

`films/zerolink-feature` renders eight landscape 1920x1080 videos, one per feature (connect, talk, coordinate,
sos, find, private, range, prepare). Steps and captions live in `features.js`; the screens are English-UI
Robolectric screenshots shown at true phone proportions, without zoom.
Render one with `node bin/vigenco.mjs render jobs/zerolink-feature-sos.json --out sos.mp4`.
