# Post PWA

### What is a PWA
PWA is an enhanced web app that looks and feels like a native app.

### Core features of a PWA
- [ ] Installable to home screen
- [ ] Precahing - cache core files (html, css, js) on browser, so all can be loaded from browsers cahce
- [ ] Push notifications
- [ ] Background sync - allows app to work offline and keeps user data synchronised when offline

### PWA key terms
- Web app manifest file (manifest.json) - JSON file which provides information about app, e.g. name of app, home screen icon, name under icon etc. Browser uses this information to display when app is downloaded to home screen. (More on manifest https://web.dev/add-manifest/ &@ https://developer.mozilla.org/en-US/docs/Web/Manifest)
- Service worker - Javascript file that runs in the background (even when app is closed) listening to certain event allowing:
  1. Loading of content offline, by caching resources of webapp (html, css & js) and requests. 
  2. Background sync -> When user performs action offline that requires data, it will perform action in background when connection is reestablished.
  3. Use of push nofifications & send even if app is closed.
- Useful reading https://developers.google.com/web/ilt/pwa/introduction-to-service-worker [Introduction to service workers]
- Workbox - Google tool that makes working with a service worker easier. Workbox makes the following easier:
  - Precaching & caching strategies
  - Background sync
- Push subscription - accociates users browser to the browsers push notification server

## Building a PWA with quasar

- Start app in pwa dev mode using ```quasar dev -m pwa```
- Quasar generates manifest.json file and links it automatically to the html file. You can edit manifest.json in the quasar.config.js file.
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

- Without workbox we will have to listen for service worker install event and specify all files to cache 1 by 1. But using workbox, workbox automatically generates list of files to store in cache. All files are then stored in a workbox manifest file. https://developers.google.com/web/tools/workbox/guides/get-started#precaching [workbox - precaching]. The lines below cache the core app files (html, css, js)
```
import { precacheAndRoute } from 'workbox-precaching';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);
```

### Caching strategies

- We may not just want to cache the core app files but also data from external requests. Caching strategies can help us achieve this.
- There are several different caching stratergies; useful reading material https://developers.google.com/web/tools/workbox/modules/workbox-strategies [Workbox Strategies]

### Strategies used in this build:

- Stale-While-Revalidate - Pattern allows you to respond to the request as quickly as possible with a cached response if available. Common strategy where having the most up-to-date resource is not vital to the application. SW -> Cache -> Page -> Network -> Cache
- Cache First - Some network requests can be stored in cache. When app is always used, the data will always be fetch from cache unless cache is cleared or empty (cache miss). This is useful for font families.
- Network First - Service worker makes request to network to store in cache. If nerwork request fails, then most recent data in cache is returned. Ideal if alot of network request will be made.

## Background sync

- Background sync helps keep app functional and its data synchronised when offline.
  - If user makes http post request, request will be stored in a queue.
    1. With internet connection, request will be sent to endpoint.
    2. Without internet connection, request will stay in queue and sent to endpoint once internet connection is available
- Not all browsers support background sync, hence detect if background sync available in service worker, before creating and adding a request to the queue.

### Check if background sync supported in browser
```
backgroundSyncSupported() {
  // Check if browser support service workers & background sync
  return 'serviceWorker' in navigator && 'SyncManager' in window
}
```

### Check if background sync supported in workbox service worker
```
let backgroundSyncSupported = 'sync' in self.registration ? true: false
```
- Reading https://developers.google.com/web/tools/workbox/modules/workbox-background-sync [Workbox Background Sync]

## Push notifications
- A push notification main purpose is to increase user engangement even when app is closed. Push notifications rely on service workers to listen out for push messages.

### How to get push notifications working
- We need to create a push subscription for each user
- Then store the user subscription in a database. Subscription contains keys and push server url
  - We need to secure our push subscription, ensuring push notification can only be sent by authenticated backends
- We will then send a request to the server url, the server will respond with message to the users browser
- Finally we need to listen out for message sent, with service worker to be displayed onto the browser

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
