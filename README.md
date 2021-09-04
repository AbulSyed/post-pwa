# Post PWA

### What is a PWA
PWA is an enhanced web app that looks and feels like a native app.

### Core features of a PWA
- [ ] Push notifications
- [ ] Background sync, so app can work offline
- [ ] Installable to home screen

### PWA key terms
- Web app manifest file (manifest.json) - JSON file which provides information about app, e.g. name of app, home screen icon, name under icon etc. Browser uses this information to be display when app is downloaded to home screen. (More on manifest https://web.dev/add-manifest/ &@ https://developer.mozilla.org/en-US/docs/Web/Manifest)
- Service workers - Javascript files that runs in the background listening to certain event allowing 1. Loads content offline. 2. Background sync -> When user performs action offline that require data, it will perform actions in background when connection is reestablished. 3. Use push nofifications.

## Install the dependencies
```bash
npm i
```

### Start the app in development mode
```bash
quasar dev
```

### Start the app pwa mode
```bash
quasar dev -m pwa
```

Quasar generates manifest.json file and links automatically. You can edit manifest.json in the quasar.config.js file.

### Build the app for production
```bash
quasar build
```
