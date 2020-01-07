if (workbox) {
  workbox.routing.registerRoute(/^\/$/, new workbox.strategies.NetworkFirst())
}
else console.log("scripts not loaded")
self.addEventListener("install", _ => self.skipWaiting())