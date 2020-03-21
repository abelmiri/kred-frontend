import {REST_URL} from "./Functions/api"
import axios from "axios"

const isLocalhost = Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))

export default function register()
{
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
    {
        window.addEventListener("load", () =>
        {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
            if (!isLocalhost)
            {
                navigator.serviceWorker.register(swUrl).then(registration =>
                {
                    registration.update().then(() => console.log("going for update")).catch(() => console.log("can't going for update"))
                    registration.onupdatefound = () =>
                    {
                        const installingWorker = registration.installing
                        installingWorker.onstatechange = () =>
                        {
                            if (installingWorker.state === "installed")
                                if (navigator.serviceWorker.controller)
                                {
                                    console.log("New content is available.")
                                    window.location.reload(true)
                                }
                                else console.log("Content is cached for offline use.")
                        }
                    }
                    if (window.Notification && (localStorage.getItem("user") || sessionStorage.getItem("user")) && localStorage.getItem("push-notification") !== "generated")
                    {
                        const publicKey = "BCR59Mwd70-EuHv17gzqLS7QRT1ezhr3OALaEiFrRy-WAa-BLfqhYsB5qAtLPF1EB2ETvqXQFJmukN4QNGMVw-c"
                        registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey)}).then((subscription) =>
                        {
                            const token = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")).token
                            axios.post(
                                REST_URL + "/subscribe",
                                {token: subscription},
                                {headers: {"Authorization": `${token}`}},
                            )
                                .then(() =>
                                {
                                    localStorage.setItem("push-notification", "generated")
                                    console.log("push token generated")
                                })
                                .catch((err) => console.log(err))
                        })
                    }
                }).catch(error => console.error("Error during service worker registration:", error))
                navigator.serviceWorker.addEventListener("controllerchange", () =>
                {
                    console.log("New **controller** found.")
                    if (localStorage.getItem("user") || sessionStorage.getItem("user")) window.location.reload(true)
                })
            }
        })
    }
}

function urlBase64ToUint8Array(base64String)
{
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i)
    {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}