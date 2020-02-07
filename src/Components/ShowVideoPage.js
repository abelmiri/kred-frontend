import React, {PureComponent} from "react"
import axios from "axios"
import {REST_URL} from "../Functions/api"
import Material from "./Material"
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
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        document.addEventListener("contextmenu", this.osContextMenu)
        document.addEventListener("keydown", this.onKeyDown)
    }

    osContextMenu = (e) => e.preventDefault()

    onKeyDown = (e) => e.keyCode === 123 && e.preventDefault()

    componentWillUnmount()
    {
        document.removeEventListener("contextmenu", this.osContextMenu)
        document.removeEventListener("keydown", this.onKeyDown)
    }

    showVideo(url)
    {
        this.setState({...this.state, selected: null, subtitle: null, video: null, loading: true, loadingPercent: null}, () =>
        {
            axios.get(`${REST_URL}/subtitles/${url}?time=${new Date().toISOString()}`, {
                headers: {"Authorization": JSON.parse(localStorage.getItem("user")).token},
                responseType: "blob",
                onDownloadProgress: e => this.setState({...this.state, loadingPercent: `در حال دانلود زیرنویس ${Math.floor((e.loaded * 100) / e.total)} %`}),
            })
                .then((subtitleRes) => this.setState({...this.state, loading: false, selected: url, video: `${REST_URL}/videos/${url}`, subtitle: URL.createObjectURL(subtitleRes.data)}))
                .catch((err) =>
                {
                    if (err.message === "Request failed with status code 401") this.setState({...this.state, loading: false, loadingPercent: null}, () => NotificationManager.warning("شما به این محتوا دسترسی ندارید! برای خرید به کانال تلگرامی KRED مراجعه کنید! KRED_co@"))
                    else NotificationManager.warning("دانلود فایل با مشکل مواجه شد!")
                })
        })
    }

    render()
    {
        const {user} = this.props
        const {video, subtitle, loading, loadingPercent, selected} = this.state
        return (
            <div className="video-page-cont">
                <div className={`video-page-loading-dark ${loading ? "show" : ""}`}>
                    {loadingPercent && <div className="video-page-loading-dark-text">{loadingPercent}</div>}
                </div>
                {
                    user ?
                        <React.Fragment>
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
                                    </Material>
                                    <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Inferior view of base of the skull")}>
                                        Inferior view of base of the skull
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
                                    </Material>
                                    <Material className="video-page-aside-videos-item" onClick={() => this.showVideo("Neurovasculature of head and neck")}>
                                        Neurovasculature of head and neck
                                    </Material>

                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <div className="video-page-video-not-login">برای استفاده از محتوا لطفا لاگین کنید</div>
                }
            </div>
        )
    }
}

export default ShowVideoPage