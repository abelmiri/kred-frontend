const isLocalhost = Boolean(
    window.location.hostname === "localhost" || window.location.hostname === "[::1]" ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
)

export default function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
      if (!isLocalhost) {
        navigator.serviceWorker
            .register(swUrl)
            .then(registration => {
              // if (localStorage.getItem("identityId")) {
              //   const publicKey = "BPAnD6orqwKDMUaBB-pHlnh3FwgcEBzrJPdGarY-oyOaHglrxPGSaYETOMn-dfvvIL0HgN6HDUqVi016081bP5k"
              //   registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey)}).then((subscription) => {
              //     fetch("https://chat.innowin.ir/subscribe", {
              //       method: "post",
              //       headers: {
              //         "Content-Type": "application/json",
              //         "Cache-Control": "no-cache",
              //       },
              //       body: JSON.stringify({subscription, userId: localStorage.getItem("identityId")}),
              //     })
              //         .then(() => console.log("generated"))
              //         .catch(err => console.log(err))
              //   })
              // }
              registration.onupdatefound = () => {
                const installingWorker = registration.installing
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed")
                    if (navigator.serviceWorker.controller) {
                      window.location.reload(true)
                      console.log("New content is available; please refresh.")
                    }
                    else console.log("Content is cached for offline use.")
                }
              }
            })
            .catch(error => console.error("Error during service worker registration:", error))
      }
    })
  }
}

// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - base64String.length % 4) % 4)
//   const base64 = (base64String + padding)
//       .replace(/-/g, "+")
//       .replace(/_/g, "/")
//   const rawData = window.atob(base64)
//   const outputArray = new Uint8Array(rawData.length)
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i)
//   }
//   return outputArray
// }