self.addEventListener("push", event => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    tag: data.sender,
    renotify: true,
    data: {sender: data.sender}
  })
})
self.onnotificationclick = event => {
  event.notification.close()
  event.waitUntil(clients.matchAll({type: "window"}).then(clientList => clients.openWindow && clients.openWindow(`/chat/${event.notification.data.sender}`)))
}
self.addEventListener('install', event => self.skipWaiting())