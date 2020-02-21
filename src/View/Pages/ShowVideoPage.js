import React, {PureComponent} from "react"
import axios from "axios"
import api, {REST_URL} from "../../Functions/api"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"

class ShowVideoPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            video: null,
            subtitle: null,
            selected: null,
            loading: false,
            loadingPercent: null,
        }
        this.canecl = null
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const request = indexedDB.open("videoDb", 1)
        request.onupgradeneeded = event =>
        {
            const db = event.target.result
            const objectStore = db.createObjectStore("videos", {keyPath: "name"})
            objectStore.createIndex("name", "name", {unique: true})
            objectStore.createIndex("blob", "blob", {unique: true})
            objectStore.transaction.oncomplete = event => console.log("store created", event)
            const objectStoreSubtitle = db.createObjectStore("subtitles", {keyPath: "name"})
            objectStoreSubtitle.createIndex("name", "name", {unique: true})
            objectStoreSubtitle.createIndex("blob", "blob", {unique: true})
            objectStoreSubtitle.transaction.oncomplete = event => console.log("store created", event)
        }

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "مجموعه فیلم‌های آموزشی سر و گردن کنهاب"}).catch(err => console.log(err))

        document.addEventListener("contextmenu", this.osContextMenu)
        document.addEventListener("keydown", this.onKeyDown)
    }

    osContextMenu = (e) => process.env.NODE_ENV === "production" && e.preventDefault()

    onKeyDown = (e) => e.keyCode === 123 && process.env.NODE_ENV === "production" && e.preventDefault()

    componentWillUnmount()
    {
        document.removeEventListener("contextmenu", this.osContextMenu)
        document.removeEventListener("keydown", this.onKeyDown)
    }

    getSubtitle(name)
    {
        return new Promise((resolve) =>
        {
            if (this.props.user)
            {
                const request = indexedDB.open("videoDb", 1)
                request.onsuccess = event =>
                {
                    const db = event.target.result
                    const transactionSubtitle = db.transaction(["subtitles"])
                    const objectStoreSubtitle = transactionSubtitle.objectStore("subtitles")
                    const requestGetSubtitle = objectStoreSubtitle.get(`${REST_URL}/subtitles/${name}`)

                    requestGetSubtitle.onerror = _ => this.getSubtitleFromServerAndSave(`${REST_URL}/subtitles/${name}`, resolve)

                    requestGetSubtitle.onsuccess = _ =>
                    {
                        if (requestGetSubtitle.result && requestGetSubtitle.result.blob)
                        {
                            requestGetSubtitle.result.blob.arrayBuffer()
                                .then((buffer) => this.setState({...this.state, subtitle: URL.createObjectURL(new Blob([buffer]))}, () => resolve(true)))
                                .catch(() => this.getSubtitleFromServerAndSave(`${REST_URL}/subtitles/${name}`, resolve))
                        }
                        else this.getSubtitleFromServerAndSave(`${REST_URL}/subtitles/${name}`, resolve)
                    }
                }
                request.onerror = _ => this.getSubtitleFromServerAndSave(`${REST_URL}/subtitles/${name}`, resolve)
            }
            else
            {
                this.setState({...this.state, loading: false}, () =>
                {
                    if (document.getElementById("header-login")) document.getElementById("header-login").click()
                    NotificationManager.error("برای استفاده از فیلم ها، در سایت ثبت نام و یا وارد شوید.")
                })
            }
        })
    }

    getSubtitleFromServerAndSave(url, resolve)
    {
        axios.get(`${url}?time=${new Date().toISOString()}`, {
            headers: {"Authorization": JSON.parse(localStorage.getItem("user")).token},
            responseType: "blob",
            onDownloadProgress: e => this.setState({...this.state, loadingPercent: `در حال دانلود زیرنویس ${Math.floor((e.loaded * 100) / e.total)} %`}),
        })
            .then((res) =>
            {
                this.setState({...this.state, subtitle: URL.createObjectURL(res.data)}, () =>
                {
                    resolve(res.status === 200)
                    if (res.status === 200)
                    {
                        const request = indexedDB.open("videoDb", 1)
                        request.onsuccess = e =>
                        {
                            const db = e.target.result
                            const transaction = db.transaction(["subtitles"], "readwrite")
                            const objectStore = transaction.objectStore("subtitles")
                            const requestSave = objectStore.add({name: url, blob: res.data})
                            requestSave.onsuccess = event => console.log("saved", event)
                            requestSave.onerror = err => console.log("error", err)
                        }
                    }
                })
            })
            .catch((err) =>
            {
                this.setState({...this.state, loading: false, loadingPercent: null}, () =>
                    NotificationManager.warning(err.message === "Request failed with status code 401" ? "شما به این محتوا دسترسی ندارید! برای خرید به کانال تلگرامی KRED مراجعه کنید! KRED_co@" : "دانلود فایل با مشکل مواجه شد!"),
                )
            })
    }

    getVideo(name, save)
    {
        const request = indexedDB.open("videoDb", 1)
        request.onsuccess = event =>
        {
            const db = event.target.result
            const transactionVideo = db.transaction(["videos"])
            const objectStoreVideo = transactionVideo.objectStore("videos")
            const requestGetVideo = objectStoreVideo.get(`${REST_URL}/videos/${name}`)

            requestGetVideo.onerror = _ => this.setState({...this.state, video: `${REST_URL}/videos/${name}`, loading: false, loadingPercent: null, selected: name}, () => this.getVideoFromServerAndSave(`${REST_URL}/videos/${name}`, save))

            requestGetVideo.onsuccess = _ =>
            {
                if (requestGetVideo.result && requestGetVideo.result.blob)
                {
                    requestGetVideo.result.blob.arrayBuffer()
                        .then((buffer) => this.setState({...this.state, video: URL.createObjectURL(new Blob([buffer])), loading: false, loadingPercent: null, selected: name}))
                        .catch(() => this.setState({...this.state, video: `${REST_URL}/videos/${name}`, loading: false, loadingPercent: null, selected: name}, () => this.getVideoFromServerAndSave(`${REST_URL}/videos/${name}`, save)))
                }
                else this.setState({...this.state, video: `${REST_URL}/videos/${name}`, loading: false, loadingPercent: null, selected: name}, () => this.getVideoFromServerAndSave(`${REST_URL}/videos/${name}`, save))
            }
        }
        request.onerror = _ => this.setState({...this.state, video: `${REST_URL}/videos/${name}`, loading: false, loadingPercent: null, selected: name}, () => this.getVideoFromServerAndSave(`${REST_URL}/videos/${name}`, save))

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "video", content: name}).catch(err => console.log(err))
    }

    getVideoFromServerAndSave(url, save)
    {
        if (save)
        {
            if (this.canecl)
            {
                this.canecl()
                this.canecl = null
            }

            clearTimeout(this.getVideoTimeout)
            this.getVideoTimeout = setTimeout(() =>
            {
                axios.get(
                    url,
                    {
                        responseType: "blob",
                        onDownloadProgress: e => console.log(`در حال دانلود ${Math.floor((e.loaded * 100) / e.total)} %`),
                        cancelToken: new axios.CancelToken(c => this.canecl = c),
                    },
                )
                    .then((res) =>
                    {
                        const request = indexedDB.open("videoDb", 1)
                        request.onsuccess = e =>
                        {
                            const db = e.target.result
                            const transaction = db.transaction(["videos"], "readwrite")
                            const objectStore = transaction.objectStore("videos")
                            const requestSave = objectStore.add({name: url, blob: res.data})
                            requestSave.onsuccess = _ => NotificationManager.warning("ویدیو برای پخش آفلاین ذخیره شد!")
                            requestSave.onerror = err => console.log("error", err)
                        }
                    })
            }, 5000)
        }
    }

    showVideo(name)
    {
        this.setState({...this.state, selected: null, subtitle: null, loading: true, loadingPercent: null, video: null}, () => this.getSubtitle(name).then((save) => this.getVideo(name, save)))
    }

    render()
    {
        const {video, subtitle, loading, loadingPercent, selected} = this.state
        return (
            <div className="video-page-cont">
                <div className={`video-page-loading-dark ${loading ? "show" : ""}`}>
                    {loadingPercent && <div className="video-page-loading-dark-text">{loadingPercent}</div>}
                </div>
                {
                    video ?
                        <div className="video-page-video-container">
                            <video className="video-page-video" controls controlsList="nodownload" autoPlay>
                                <source src={video}/>
                                {subtitle && <track label="Farsi" kind="subtitles" srcLang="en" src={subtitle} default/>}
                            </video>
                            {selected}
                        </div>
                        :
                        <div className="video-page-video-container pre">
                            لطفا یک ویدئو انتخاب کنید
                        </div>
                }
                <div className="video-page-aside">
                    <div className="video-page-aside-title">List of videos</div>
                    <div className="video-page-aside-videos">
                        <div className="video-page-aside-videos-title">Skull</div>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Superior view of base of the skull")}>
                            Superior view of base of the skull
                            <div className="video-page-aside-videos-free">Free</div>
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Inferior view of base of the skull")}>
                            Inferior view of base of the skull
                            <div className="video-page-aside-videos-free">Free</div>
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Anterior and lateral views of the skull")}>
                            Anterior and lateral views of the skull
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Posterior and lateral views of the skull")}>
                            Posterior and lateral views of the skull
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Midsagittal skull")}>
                            Midsagittal skull
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Calvaria")}>
                            Calvaria
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Ethmoid bone")}>
                            Ethmoid bone
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Mandible")}>
                            Mandible
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Sphenoid bone")}>
                            Sphenoid bone
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Temporal bone")}>
                            Temporal bone
                        </Material>

                        <div className="video-page-aside-videos-title">Head</div>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Muscles of facial expression")}>
                            Muscles of facial expression
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Maxillary artery")}>
                            Maxillary artery
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Salivary glands")}>
                            Salivary glands
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Superficial nerves of the head")}>
                            Superficial nerves of the head
                            <div className="video-page-aside-videos-free">Free</div>
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Superficial blood vessels of the head")}>
                            Superficial blood vessels of the head
                        </Material>

                        <div className="video-page-aside-videos-title">Neck</div>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Suprahyoid muscles")}>
                            Suprahyoid muscles
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Infrahyoid muscles")}>
                            Infrahyoid muscles
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Muscles of anterior neck")}>
                            Muscles of anterior neck
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Scalene muscles")}>
                            Scalene muscles
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Triangles of the neck")}>
                            Triangles of the neck
                        </Material>

                        <div className="video-page-aside-videos-title">Nasal region</div>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Lateral wall of nasal cavity")}>
                            Lateral wall of nasal cavity
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Medial wall of nasal cavity")}>
                            Medial wall of nasal cavity
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Blood vessels of the nasal cavity")}>
                            Blood vessels of the nasal cavity
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Nerves of the nasal cavity")}>
                            Nerves of the nasal cavity
                        </Material>

                        <div className="video-page-aside-videos-title">Neurovasculature of head and neck</div>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Cervical plexus")}>
                            Cervical plexus
                            <div className="video-page-aside-videos-free">Free</div>
                        </Material>
                        <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Neurovasculature of head and neck")}>
                            Neurovasculature of head and neck
                        </Material>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowVideoPage