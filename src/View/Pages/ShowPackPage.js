import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import axios from "axios"
import Helmet from "react-helmet"
import CopySvg from "../../Media/Svgs/CopySvg"
import copyToClipboard from "../../Helpers/copyToClipboard"

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

        this.offsetTop = null
        this.staticWidth = null
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

        const {packId, videoId} = this.props
        api.get(`video-pack/${packId}`, `?limit=100&time=${new Date().toISOString()}`, true)
            .then(videoPack =>
            {
                this.setState({...this.state, videoPack}, () =>
                {
                    if (videoId)
                    {
                        for (let i = 0; i < videoPack.categories.length; i++)
                        {
                            for (let j = 0; j < videoPack.categories[i].videos.length; j++)
                            {
                                if (videoPack.categories[i].videos[j]._id === videoId)
                                {
                                    this.showVideo(videoPack.categories[i].videos[j])
                                    return
                                }
                            }
                        }
                    }

                    // statistics
                    process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `ویدیوها | ${videoPack.title}`, content_id: packId}).catch(err => console.log(err))

                    localStorage.setItem(packId, JSON.stringify(videoPack))
                })
            })
            .catch(() =>
            {
                const videoPack = localStorage.getItem(packId)
                if (videoPack)
                {
                    this.setState({...this.state, videoPack: JSON.parse(videoPack)}, () =>
                        NotificationManager.warning("عدم دسترسی به اینترنت، بارگزاری آفلاین..."),
                    )
                }
                else NotificationManager.error("سایت در گرفتن اطلاعات با خطا مواجه شد!")
            })

        if (process.env.NODE_ENV === "production")
        {
            document.addEventListener("contextmenu", this.osContextMenu)
        }

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        if (this.canecl)
        {
            this.canecl()
            this.canecl = null
        }

        clearTimeout(this.getVideoTimeout)

        if (process.env.NODE_ENV === "production")
        {
            document.removeEventListener("contextmenu", this.osContextMenu)
        }

        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        if (document.body.clientWidth <= 480 && this.video)
        {
            if (this.offsetTop === null)
            {
                this.staticWidth = this.video.clientWidth
                this.offsetTop = this.video.offsetTop
            }

            if (window.scrollY + 81 >= this.offsetTop)
            {
                if (this.video.style.position !== "fixed")
                {
                    this.cont.style.paddingTop = `${this.video.clientHeight}px`
                    this.video.style.border = "1px solid transparent"
                    this.video.style.width = document.body.clientWidth + "px"
                    this.video.style.marginLeft = "calc(-5% - 3px)"
                    this.video.style.position = "fixed"
                }
            }
            else
            {
                if (this.video.style.position !== "static")
                {
                    this.cont.style.paddingTop = "0"
                    this.video.style.border = "1px solid var(--secondary-color)"
                    this.video.style.width = this.staticWidth + "px"
                    this.video.style.marginLeft = "0"
                    this.video.style.position = "static"
                }
            }
        }
    }

    osContextMenu = (e) => e.preventDefault()

    getSubtitle(url)
    {
        return new Promise((resolve) =>
        {
            if (this.props.user)
            {
                const {videoPack} = this.state
                if (videoPack.price !== 0)
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
                                try
                                {
                                    requestGetSubtitle.result.blob.arrayBuffer()
                                        .then((buffer) => this.setState({...this.state, subtitle: URL.createObjectURL(new Blob([buffer]))}, () => resolve(true)))
                                        .catch(() => this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve))
                                }
                                catch (e)
                                {
                                    NotificationManager.error("مرورگر شما از پخش آفلاین ساپورت نمیکند، برای پخش آفلاین از Chrome استفاده کنید!")
                                    this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)
                                }
                            }
                            else this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)
                        }
                    }
                    request.onerror = _ => this.getSubtitleFromServerAndSave(`${REST_URL}${url}`, resolve)
                }
                else resolve(false)
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
            headers: {"Authorization": JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")).token},
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
                    NotificationManager.warning(e?.response?.status === 403 ? "شما به این محتوا دسترسی ندارید!" : "دانلود فایل با مشکل مواجه شد!"),
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

            requestGetVideo.onerror = _ => this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: {...video}}, () =>
                this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
            )

            requestGetVideo.onsuccess = _ =>
            {
                if (requestGetVideo.result && requestGetVideo.result.blob)
                {
                    try
                    {
                        requestGetVideo.result.blob.arrayBuffer()
                            .then((buffer) => this.setState({...this.state, video: URL.createObjectURL(new Blob([buffer])), loading: false, loadingPercent: null, selected: {...video}}))
                            .catch(() =>
                                this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: {...video}}, () =>
                                    this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
                                ),
                            )
                    }
                    catch (e)
                    {
                        this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: {...video}}, () =>
                            this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
                        )
                    }
                }
                else this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: {...video}}, () =>
                    this.getVideoFromServerAndSave(`${REST_URL}${url}`, save),
                )
            }
        }
        request.onerror = _ => this.setState({...this.state, video: `${REST_URL}${url}`, loading: false, loadingPercent: null, selected: {...video}}, () =>
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

    shareLink = () =>
    {
        const {selected, videoPack} = this.state
        if (navigator.share)
        {
            navigator.share({
                title: document.title,
                text: "این لینک رو در KRED ببین! \n",
                url: `https://www.kred.ir/videos/${videoPack._id}/${selected._id}`,
            })
                .then(() => console.log("Successful share"))
                .catch(error => console.log("Error sharing:", error))
        }
        else this.copy()
    }

    copy()
    {
        const {selected, videoPack} = this.state
        copyToClipboard(`https://www.kred.ir/videos/${videoPack._id}/${selected._id}`, () => NotificationManager.success("لینک با موفقیت کپی شد"))
    }

    render()
    {
        const {videoPack, loading, loadingPercent, video, subtitle, selected} = this.state
        return (
            <div className="video-page-cont">
                {
                    videoPack ?
                        <React.Fragment>
                            <Helmet>
                                <title>فیلم‌های آموزشی {videoPack.title} | KRED</title>
                                <meta property="og:title" content={`فیلم‌های آموزشی ${videoPack.title} | KRED`}/>
                                <meta name="twitter:title" content={`فیلم‌های آموزشی ${videoPack.title} | KRED`}/>
                                <meta name="description" content={`فیلم های آموزشی پزشکی ${videoPack.title} | KRED`}/>
                                <meta property="og:description" content={`فیلم های آموزشی پزشکی ${videoPack.title} | KRED`}/>
                                <meta name="twitter:description" content={`فیلم های آموزشی پزشکی ${videoPack.title} | KRED`}/>
                            </Helmet>
                            <div className={`video-page-loading-dark ${loading ? "show" : ""}`}>
                                {loadingPercent && <div className="video-page-loading-dark-text">{loadingPercent}</div>}
                            </div>
                            <h1 className="video-page-h1">
                                مجموعه فیلم‌های<span> </span>{videoPack.title}
                            </h1>
                            {
                                video ?
                                    <div ref={e => this.cont = e} className="video-page-video-container">
                                        <video ref={e => this.video = e} className="video-page-video" controls controlsList="nodownload" autoPlay>
                                            <source src={video}/>
                                            {subtitle && <track label="Farsi" kind="subtitles" srcLang="en" src={subtitle} default/>}
                                        </video>
                                        <div className="video-page-video-nav">
                                            {/*<Material className="post-like-count-cont like" onClick={this.likeAndDisLike}>*/}
                                            {/*    <LikeSvg className={`post-like-svg ${videoPack.is_liked ? "liked" : ""}`}/>*/}
                                            {/*    <div className={`pavilion-item-like ${videoPack.is_liked ? "liked" : ""}`}>{videoPack.likes_count || 0} پسند</div>*/}
                                            {/*</Material>*/}
                                            <Material className="post-like-count-cont copy " onClick={this.shareLink}>
                                                <CopySvg className="post-comment-svg"/>
                                                <div className="pavilion-item-like">
                                                    <span className="only-desktop">کپی لینک</span>
                                                    <span className="only-mobile">اشتراک گذری</span>
                                                </div>
                                            </Material>
                                            <span className="video-page-video-title">{selected?.title}</span>
                                        </div>
                                    </div>
                                    :
                                    <div className="video-page-video-container pre">
                                        لطفا یک ویدیو انتخاب کنید
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
                                                        <Material key={"video" + video._id} className={`video-page-aside-videos-item ${selected?._id === video._id ? "selected" : ""}`} onClick={() => this.showVideo(video)}>
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
                        </React.Fragment>
                        :
                        <div className="exchange-show-cont">
                            <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        </div>
                }
            </div>
        )
    }
}

export default ShowPackPage