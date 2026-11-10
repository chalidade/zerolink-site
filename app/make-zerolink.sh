#!/usr/bin/env bash
# Builds the ZeroLink by PUAS APK from a Saling Jaga checkout.
#
# ZeroLink is the Saling Jaga app (AGPL-3.0-or-later, https://github.com/chalidade/saling-jaga)
# with its own name, icon, colours and application ID, so both apps can sit on one phone.
# The network protocol is untouched: ZeroLink and Saling Jaga phones join the same groups.
#
# Usage:
#   app/make-zerolink.sh /path/to/saling-jaga [out.apk]
# Signing: set KEYSTORE, KS_PASS, KEY_ALIAS and KEY_PASS for a release; otherwise a debug key is used.
# Keep the release keystore out of git. Every update must be signed with the same key.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=${1:?usage: make-zerolink.sh /path/to/saling-jaga [out.apk]}
OUT=${2:-$HERE/../zerolink.apk}
APP_ID=com.puas.zerolink

WORK=${WORK:-$(mktemp -d)}
[ -n "${KEEP:-}" ] || trap 'rm -rf "$WORK"' EXIT
cp -a "$SRC"/. "$WORK"/
rm -rf "$WORK/.git" "$WORK/build"
cd "$WORK"

J=app/src/main/java/com/salingjaga/app
C=core/src/main/java/com/salingjaga/app

# 1. Name shown to people. Java class packages, preference keys and the wire protocol stay as they are.
sed -i 's/>Saling Jaga</>ZeroLink</' app/src/main/res/values/strings.xml
grep -rl 'Saling Jaga' "$J" "$C" web/static | xargs sed -i 's/Saling Jaga/ZeroLink/g'
sed -i 's/"SalingJaga.apk" : "SalingJaga-"/"ZeroLink.apk" : "ZeroLink-"/' "$J/ShareApp.java"
# Where to get the app; QR links (JoinQr) keep saling-jaga.com/j so both apps read each other's codes.
sed -i 's/dari saling-jaga\.com/dari zerolink.web.id/; s/from saling-jaga\.com/from zerolink.web.id/' "$J/MainActivity.java"
sed -i 's/dari saling-jaga\.com/dari zerolink.web.id/; s/at saling-jaga\.com/at zerolink.web.id/' "$C/Link.java"
sed -i 's#SUPPORT_URL = "https://teer.id/chalidade"#SUPPORT_URL = "https://zerolink.web.id/"#' "$J/MainActivity.java"
sed -i 's#Lang.t("Dukung ZeroLink", "Support ZeroLink")#Lang.t("Situs ZeroLink", "ZeroLink website")#' "$J/MainActivity.java"
sed -i 's#Lang.t("Bantu aplikasi ini tetap gratis", "Help keep this app free")#Lang.t("Info dan unduhan terbaru", "News and latest download")#' "$J/MainActivity.java"

# 2. Own application ID and file provider, so it installs next to Saling Jaga.
sed -i "s/com\.salingjaga\.app\.capture/$APP_ID.capture/" app/src/main/AndroidManifest.xml "$J/CaptureProvider.java"
sed -i "s#-I \"\$LEGACY_JAR\" \\\\#-I \"\$LEGACY_JAR\" --rename-manifest-package $APP_ID \\\\#" build.sh
sed -i "s#--manifest \"\$SRC/AndroidManifest.xml\" \\\\#--manifest \"\$SRC/AndroidManifest.xml\" --rename-manifest-package $APP_ID \\\\#" build.sh
grep -q -- "--rename-manifest-package $APP_ID" build.sh || { echo "could not set the application ID" >&2; exit 1; }

# 3. PUAS colours: deep teal with gold, instead of Saling Jaga green.
grep -rl '#FF1C5233' app/src/main/res/values | xargs -r sed -i 's/#FF1C5233/#FF0B3D36/'
for f in "$J"/*.java; do
  sed -i -e 's/Color.rgb(28, 82, 51)/Color.rgb(11, 61, 54)/g' \
         -e 's/Color.rgb(31, 122, 69)/Color.rgb(14, 96, 84)/g' \
         -e 's/Color.rgb(46, 168, 92)/Color.rgb(22, 150, 120)/g' \
         -e 's/Color.rgb(226, 242, 231)/Color.rgb(224, 240, 236)/g' \
         -e 's/Color.rgb(17, 82, 45)/Color.rgb(8, 48, 42)/g' \
         -e 's/Color.rgb(29, 160, 85)/Color.rgb(214, 140, 32)/g' "$f"
done

# 4. PUAS logo for the launcher icon, header and splash.
cp -r "$HERE/res/." app/src/main/res/

# Debian's old aapt cannot read fillType="evenOdd"; the Android SDK build keeps it.
if [ -z "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" ]; then
  sed -i 's/android:fillType="evenOdd"//' app/src/main/res/drawable/*.xml
fi

./build.sh
cp build/saling-jaga-debug.apk "$OUT"
echo "ZeroLink APK: $OUT"
