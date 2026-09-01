# Getting a signed, Play-Store-ready APK/AAB

The debug APK from the GitHub Actions workflow already works — real,
installable, works offline, nothing more needed for that. This doc is only
for the extra step of getting a **release** build, signed with your own key,
which is what the Play Store actually requires.

## Part 1 — you: generate a signing key (one time, ever)

Android requires every app to be signed, and — important — **every future
update must be signed with this exact same key forever**. If you lose it,
you can never update the app again under the same listing; you'd have to
publish it as a brand new app. Save the `.jks` file somewhere safe (a
password manager's file storage, a private cloud folder — not just your
Downloads folder).

You need Java installed to run this (you almost certainly already have it if
you've ever installed anything Android-related; if not, any JDK works).
Open a terminal and run:

```
keytool -genkeypair -v -keystore release.jks -alias queryacademy -keyalg RSA -keysize 2048 -validity 10000
```

It'll ask for:
- A keystore password (this becomes `ANDROID_KEYSTORE_PASSWORD` below)
- Your name/organization details (can be anything reasonable, it's not
  verified)
- A key password (can be the same as the keystore password, or different —
  this becomes `ANDROID_KEY_PASSWORD` below)

This creates a `release.jks` file in whatever folder you ran the command
from. That file, plus the two passwords, plus the alias you chose
(`queryacademy` above — change it if you want, just remember what you used)
is everything Android needs to sign the app.

## Part 2 — you: add it to GitHub as secrets

Secrets are how you give the build access to your signing key **without**
it ever being visible in the code, the repo, or to anyone browsing it —
GitHub encrypts them and only decrypts them inside the build run itself.

1. Convert the keystore file to base64 (a text-safe format, since GitHub
   secrets are text fields, not file uploads):
   - Mac/Linux: `base64 -i release.jks | pbcopy` (Mac) or
     `base64 -w0 release.jks` (Linux, then copy the output)
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks")) | Set-Clipboard`
2. In your GitHub repo: **Settings → Secrets and variables → Actions → New
   repository secret**, and add all four of these:

   | Secret name | Value |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | the long base64 text from step 1 |
   | `ANDROID_KEYSTORE_PASSWORD` | the keystore password you chose |
   | `ANDROID_KEY_ALIAS` | the alias you chose (`queryacademy` if you used the example above) |
   | `ANDROID_KEY_PASSWORD` | the key password you chose |

3. Push anything to `main` (or go to the **Actions** tab and click **Run
   workflow** on "Build Android app") — the workflow now also builds a
   signed release APK and AAB, listed as separate downloadable artifacts
   alongside the debug one.

## Part 3 — you: get the file

GitHub → your repo → **Actions** tab → click the latest successful run →
scroll to **Artifacts** at the bottom → download
`query-academy-release-aab` (this is the file the Play Store wants) or
`query-academy-release-apk` (if you just want to install it directly on a
phone to test the exact release build before submitting).

## Part 4 — you: the actual Play Store submission

This part genuinely can't be done by me — it needs your own identity and a
payment method, since Google requires that for every developer account.

1. Go to **play.google.com/console**, sign up as a developer (**one-time
   $25 fee**, needs ID verification which can take anywhere from a few
   hours to a couple of days)
2. **Create app** → fill in the name, description, category
3. Upload the `.aab` from Part 3 under **Production → Create new release**
4. Fill in the store listing: screenshots (take a few from your phone once
   the app's installed), the icon (already in `assets/icon.png` in this
   project, 1024×1024, ready to use), a short and full description
5. **Privacy policy URL** — required, since the app collects an email and
   name at registration. Ask me to write one if you don't already have a
   page for this; it just needs to be hosted somewhere with a real URL
6. Fill out the **Data safety** section honestly — you collect name, email,
   and a hashed password for account creation; no ads, no third-party
   analytics or trackers in this app as built
7. Submit for review — Google's review typically takes anywhere from a few
   hours to a few days for a first submission
