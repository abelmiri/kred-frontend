self.addEventListener("fetch", (event) => {
  if (event.request.url === "/" || event.request.url === "/home" || event.request.url.includes("/event/")) {
    const NetworkFirst = new workbox.strategies.NetworkFirst()
    event.respondWith(NetworkFirst.handle({event}))
  }
})
self.addEventListener("install", _ => self.skipWaiting())
self.addEventListener("push", event => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    tag: data.sender,
    renotify: true,
    data: {sender: data.sender},
  })
})
self.onnotificationclick = event => {
  event.notification.close()
  event.waitUntil(clients.matchAll({type: "window"}).then(_ => clients.openWindow && clients.openWindow(`/chat/${event.notification.data.sender}`)))
}