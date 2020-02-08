if (workbox) {
  workbox.routing.registerRoute(/^\//, new workbox.strategies.NetworkFirst())
  workbox.routing.registerRoute(/^\/static\//, new workbox.strategies.CacheFirst())
}
else console.log("scripts not loaded")
self.addEventListener("install", _ => self.skipWaiting())