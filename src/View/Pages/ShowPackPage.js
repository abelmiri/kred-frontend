import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import axios from "axios"

class ShowPackPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            videoPack: null,
            video: null,
            subtitle: null,
            selected: null,
            loading: false,
            loadingPercent: null,
        }
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

        const {packId} = this.props
        api.get(`video-pack/${packId}`, `?limit=100&time=${new Date().toISOString()}`)
            .then(videoPack => this.setState({...this.state, videoPack}))

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "صفحه‌ی مجموعه ویدیوها", content_id: packId}).catch(err => console.log(err))

        document.addEventListener("contextmenu", this.osContextMenu)
        document.addEventListener("keydown", this.onKeyDown)
    }

    osContextMenu = (e) => process.env.NODE_ENV === "production" && e.preventDefault()

    onKeyDown = (e) => e.keyCode === 123 && process.env.NODE_ENV === "production" && e.preventDefault()

    componentWillUnmount()
    {
        if (this.canecl)
        {
            this.canecl()
            this.canecl = null
        }

        clearTimeout(this.getVideoTimeout)

        document.removeEventListener("contextmenu", this.osContextMenu)
        document.removeEventListener("keydown", this.onKeyDown)
    }

    getSubtitle(url)
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
                    const requestGetSubtitle = objectStoreSubtitle.get(`${REST_URL}${url}`)

                    requestGetSubtitle.onerror = _ => this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)

                    requestGetSubtitle.onsuccess = _ =>
                    {
                        if (requestGetSubtitle.result && requestGetSubtitle.result.blob)
                        {
                            requestGetSubtitle.result.blob.arrayBuffer()
                                .then((buffer) => this.setState({...this.state, subtitle: URL.createObjectURL(new Blob([buffer]))}, () => resolve(true)))
                                .catch(() => this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve))
                        }
                        else this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)
                    }
                }
                request.onerror = _ => this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)
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
            .catch((e) =>
            {
                this.setState({...this.state, loading: false, loadingPercent: null}, () =>
                    NotificationManager.warning(e.response.status === 403 ? "شما به این محتوا دسترسی ندارید! برای خرید به کانال تلگرامی KRED مراجعه کنید! KRED_co@" : "دانلود فایل با مشکل مواجه شد!"),
                )
            })
    }

    getVideo(video, save)
    {
        const {video_url: url, title, _id} = video
        const request = indexedDB.open("videoDb", 1)
        request.onsuccess = event =>
        {
            const db = event.target.result
            const transactionVideo = db.transaction(["videos"])
            const objectStoreVideo = transactionVideo.objectStore("videos")
            const requestGetVideo = objectStoreVideo.get(`${REST_URL}${url}`)

            requestGetVideo.onerror = _ => this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: title}, () =>
                this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
            )

            requestGetVideo.onsuccess = _ =>
            {
                if (requestGetVideo.result && requestGetVideo.result.blob)
                {
                    requestGetVideo.result.blob.arrayBuffer()
                        .then((buffer) => this.setState({...this.state, video: URL.createObjectURL(new Blob([buffer])), loading: false, loadingPercent: null, selected: title}))
                        .catch(() => this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: title}, () =>
                            this.getVideoFromServerAndSave(`${REST_URL}${url}`, save)),
                        )
                }
                else this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: title}, () =>
                    this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
                )
            }
        }
        request.onerror = _ => this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: title}, () =>
            this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
        )

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "video", content: title, content_id: _id}).catch(err => console.log(err))
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
            }, 10000)
        }
    }

    showVideo(video)
    {
        this.setState({...this.state, selected: null, subtitle: null, loading: true, loadingPercent: "0%", video: null}, () =>
            this.getSubtitle(video.subtitle_url)
                .then((save) => this.getVideo(video, save)),
        )
    }

    render()
    {
        const {videoPack, loading, loadingPercent, video, subtitle, selected} = this.state
        if (videoPack)
        {
            return (
                <div className="video-page-cont">
                    <div className={`video-page-loading-dark ${loading ? "show" : ""}`}>
                        {loadingPercent && <div className="video-page-loading-dark-text">{loadingPercent}</div>}
                    </div>
                    <h1 className="video-page-h1">
                        {videoPack.title}
                    </h1>
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
                        <div className="video-page-aside-videos">
                            {
                                videoPack.categories.map(category =>
                                    <React.Fragment key={"cat" + category._id}>
                                        <div className="video-page-aside-videos-title">{category.title}</div>
                                        {
                                            category.videos.map(video =>
                                                <Material key={"video" + video._id} className="video-page-aside-videos-item" onClick={() => this.showVideo(video)}>
                                                    {video.title}
                                                    {video.is_free && !videoPack.have_permission && <div className="video-page-aside-videos-free">Free</div>}
                                                </Material>,
                                            )
                                        }
                                    </React.Fragment>,
                                )
                            }
                        </div>
                    </div>
                </div>
            )
        }
        else return (
            <div className="exchange-show-cont">
                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
            </div>
        )
    }
}

export default ShowPackPage