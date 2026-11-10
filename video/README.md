# ZeroLink launch film (English, 32 s)

`media/zerolink-launch-en.mp4` is rendered with [Vigenco](https://github.com/chalidade/vigenco).
The film source lives in `video/vigenco/`. To render it again, copy both folders into a Vigenco checkout:

```bash
cp -r video/vigenco/films/zerolink-launch-en  <vigenco>/films/
cp video/vigenco/jobs/zerolink-launch-en.json <vigenco>/jobs/
cd <vigenco> && node bin/vigenco.mjs render jobs/zerolink-launch-en.json --out out/zerolink-launch-en.mp4
```

The music and sound effects are synthesized by Vigenco from the film's cues, so they carry no licence.
