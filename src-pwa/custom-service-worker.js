/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching'

import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {CacheFirst} from 'workbox-strategies';
import {NetworkFirst} from 'workbox-strategies';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

/*

  - Caching strategies

  https://developers.google.com/web/tools/workbox/modules/workbox-strategies [Workbox caching strategies]

  - Stale-While-Revalidate - Pattern allows you to respond to the request as quickly as possible with a cached response if available. Common strategy where having the most up-to-date resource is not vital to the application. SW -> Cache -> Page -> Network -> Cache

  - Cache First - Some network requests can be stored in cache. When app is always used, the data will always be fetch from cache unless cache is cleared or empty (cache miss). This is useful for font families.

  - Network First - Service worker makes request to network to store in cache. If nerwork request fails, then most recent data in cache is returned. Ideal if alot of network request will be made.

  NOTE: ORDER OF STRATEGIES IS IMPORTANT

*/

// Cache First
registerRoute(
  ({url}) => url.host.startsWith('fonts.g'),
  new CacheFirst()
);

// Network First
registerRoute(
  ({url}) => url.pathname.startsWith('/posts'),
  new NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'posts'
  })
);

// Stale-While-Revalidate
registerRoute(
  ({url}) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
);
