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


## Installing to home screen
- Usefule article https://web.dev/customize-install/ [How to provide your own in-app install experience]
- From above link: 'If your Progressive Web App meets the required installation criteria, the browser fires a ```beforeinstallprompt``` event. Save a reference to the event, and update your user interface to indicate that the user can install your PWA. This is highlighted below.'

### Lets show a button if the beforeinstallprompt event fires

```
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

### Trigerring the installation process if user selects YES

```
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
```

### Hide button when app installed to home screen

```
window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  this.showInstallBanner = false;
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
```

## Install the dependencies
```bash
npm i
```

### Start the app in development mode || pwa mode
```bash
quasar dev || quasar dev -m pwa
```

Quasar generates manifest.json file and links automatically. You can edit manifest.json in the quasar.config.js file.

### Build the app for production
```bash
quasar build
```
