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
