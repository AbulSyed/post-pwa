# Post PWA

### What is a PWA
PWA is an enhanced web app that looks and feels like a native app.

### Core features of a PWA
- [ ] Installable to home screen
- [ ] Precahing, cache core files of our app files (html, css, js) on browser, so all can be loaded from browsers cahce
- [ ] Push notifications
- [ ] Background sync, so app can work offline

### PWA key terms
- Web app manifest file (manifest.json) - JSON file which provides information about app, e.g. name of app, home screen icon, name under icon etc. Browser uses this information to be display when app is downloaded to home screen. (More on manifest https://web.dev/add-manifest/ &@ https://developer.mozilla.org/en-US/docs/Web/Manifest)
- Service worker - Javascript file that runs in the background (even when app is closed) listening to certain event allowing:
  1. Loading of content offline, by caching resources of webapp (html, css & js) and requests. 
  2. Background sync -> When user performs action offline that require data, it will perform actions in background when connection is reestablished.
  3. Use of push nofifications & send even if app is closed.
- Workbox - Google tool that makes working with a service worker easier. Workbox makes the following easier:
  - Precaching & caching strategies
  - Background sync

## Building a PWA with quasar

- Start app in pwa dev mode using ```quasar dev -m pwa```
- Quasar generates manifest.json file and links automatically to the html file. You can edit manifest.json in the quasar.config.js file.
- Quasar uses workbox framework to make it easier to manage our service worker. Quasar also generates a src-pwa folder with the following:
  - register-service-worker.js -> registers service worker listens to various events
  - custom-service-worker.js -> where all our service worker code lives (setup precaching, background sync and push notifications)

## Installing to home screen
- Useful article https://web.dev/customize-install/ [How to provide your own in-app install experience]
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

## Precaching

- Without workbox we will have to listen for service worker install event and specify all files to cache 1 by 1. But using workbox, workbox automatically generates list of files to store in cache. All files are then stored in a workbox manifest file. https://developers.google.com/web/tools/workbox/guides/get-started#precaching [workbox - precaching]. This can be implemented with the lines below:
```
import { precacheAndRoute } from 'workbox-precaching';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);
```

## Setting up a service worker [without quasar]

Useful reading material https://developers.google.com/web/ilt/pwa/introduction-to-service-worker [Introduction to service workers]

- Register service worker in javascript file
- We can listen for the install and active event (from sw.js file using self)

## Install the dependencies
```bash
npm i
```

### Start the app in development mode || pwa mode
```bash
quasar dev || quasar dev -m pwa
```

### Build the app for production
```bash
quasar build
```
