import React, {PureComponent} from "react"
import Material from "../Components/Material"
import {ClipLoader} from "react-spinners"
import api, {REST_URL} from "../../Functions/api"
import ImageShow from "../Components/ImageShow"
import AddVideoDocument from "./AddVideoDocument"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import {NotificationManager} from "react-notifications"

class MindMaps extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            documentsLoading: true,
            documents: {},
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        api.get("video-document", `?limit=50&page=1`)
            .then((data) => this.setState({...this.state, documentsLoading: false, documents: data.reduce((sum, doc) => ({...sum, [doc._id]: {...doc}}), {})}))
            .catch(() => this.setState({...this.state, error: true, documentsLoading: false}))

        document.addEventListener("scroll", this.onScroll)
        window.addEventListener("popstate", this.onPopState)
    }

    onPopState = () =>
    {
        const {showModal} = this.state
        if (showModal) this.setState({...this.state, showModal: false})
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {documents} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(documents).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, documentsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("video-document", `?limit=50&page=${this.page}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, documentsLoading: false, documents: {...documents, ...data.reduce((sum, doc) => ({...sum, [doc._id]: {...doc}}), {})}})
                    })
                })
            }
        }, 20)
    }

    toggleAddModal = () =>
    {
        const showModal = !this.state.showModal
        if (showModal)
        {
            window.history.pushState("", "", "/panel/mind-maps/add-doc")
            this.setState({...this.state, showModal})
        }
        else window.history.back()
    }

    addDocument = document => this.setState({...this.state, documents: {[document._id]: {...document}, ...this.state.documents}})

    deleteDoc(id)
    {
        let result = window.confirm("مطمئنی ادمین؟!")
        if (result)
        {
            api.del("video-document", null, id)
                .then(() =>
                {
                    const documents = {...this.state.documents}
                    delete documents[id]
                    this.setState({...this.state, documents}, () =>
                        NotificationManager.success("با موفقیت حذف شد!"),
                    )
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد. اینترنت خود را بررسی کنید."))
        }
    }

    render()
    {
        const {documents, documentsLoading, showModal} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">مایندمپ‌ها</div>
                <div className="panel-0ff-code-scroll dont-gesture">
                    {
                        Object.values(documents).length > 0 &&
                        <React.Fragment>
                            <div className="panel-0ff-code-cont title scroll-wide">
                                <div className="panel-0ff-code-item-big">ویدیو</div>
                                <div className="panel-0ff-code-item">توضیحات</div>
                                <div className="panel-0ff-code-item">تایپ</div>
                                <div className="panel-0ff-code-item">فایل</div>
                                <div className="panel-0ff-code-remove-cont">حذف</div>
                            </div>
                            {
                                Object.values(documents).map((doc) =>
                                    <div key={doc._id} className="panel-0ff-code-cont scroll-wide">
                                        <div className="panel-0ff-code-item-big">{doc.video.title}</div>
                                        <div className="panel-0ff-code-item">{doc.description}</div>
                                        <div className="panel-0ff-code-item">{doc.type === "image" ? "عکس" : "pdf"}</div>
                                        <div className="panel-0ff-code-item">{doc.type === "image" ? <ImageShow className="panel-0ff-code-item-img" src={REST_URL + doc.file} alt=""/> : <a target="_blank" rel="noopener noreferrer" className="panel-0ff-code-item-link" href={REST_URL + doc.file}>نمایش فایل</a>}</div>
                                        <CancelSvg className="panel-0ff-code-remove-cont" onClick={() => this.deleteDoc(doc._id)}/>
                                    </div>,
                                )
                            }
                        </React.Fragment>
                    }
                </div>
                <div className={`exchange-page-loading ${documentsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>

                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {showModal && <AddVideoDocument toggleAddModal={this.toggleAddModal} addDocument={this.addDocument}/>}

            </section>
        )
    }
}

export default MindMaps