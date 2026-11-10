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

## Source

The app's source code is the Saling Jaga repository plus `app/make-zerolink.sh`, under AGPL-3.0-or-later.
