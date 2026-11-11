# ZeroLink by PUAS

Website for **zerolink.web.id** and the build script for the ZeroLink Android app.

ZeroLink is a rebrand of [Saling Jaga](https://github.com/chalidade/saling-jaga), an open-source
(AGPL-3.0-or-later) app for calls, chat and SOS between phones with no internet and no signal.
It keeps the same features and network protocol, so ZeroLink and Saling Jaga phones can join the
same groups, but has its own name, logo, colours and application ID (`com.puas.zerolink`), so both
can be installed on one phone.

## Layout

- `index.html`, `en/`, `laptop/`, `privacy.html`, `terms.html`: the website (GitHub Pages, `CNAME`).
- `zerolink.apk`, `zerolink.apk.sha256`: the current APK offered for download.
- `app/make-zerolink.sh`: builds the APK from a Saling Jaga checkout. `app/res/` holds the PUAS icons.

## Building the APK

```
git clone https://github.com/chalidade/saling-jaga
KEYSTORE=/path/zerolink-release.keystore KS_PASS=... KEY_ALIAS=zerolink KEY_PASS=... \
  app/make-zerolink.sh ../saling-jaga zerolink.apk
sha256sum zerolink.apk > zerolink.apk.sha256
```

The release keystore is kept outside this repository. Every update must be signed with the same key.

ZeroLink differs from Saling Jaga in one more way for now: Bluetooth "Nearby" is off and there is no chat
list, so the app opens straight into the group screen (find phones, then chat), like the first Saling Jaga.
`make-zerolink.sh` makes these changes and stops the build if the Saling Jaga code it patches has moved.

## Google Play

Google Play takes an App Bundle. Run **Actions > ZeroLink App Bundle > Run workflow** and download the
`zerolink-play` artifact (`zerolink.aab`, `zerolink.apk`). The workflow signs with the ZeroLink release key
from the `release` environment secrets `ZEROLINK_KEYSTORE_B64`, `ZEROLINK_KS_PASS`, `ZEROLINK_KEY_ALIAS` and
`ZEROLINK_KEY_PASS`. With the Android SDK installed, `BUNDLE=1 BUNDLETOOL=/path/bundletool.jar` does the same locally.

## Source

The app's source code is the Saling Jaga repository plus `app/make-zerolink.sh`, under AGPL-3.0-or-later.
