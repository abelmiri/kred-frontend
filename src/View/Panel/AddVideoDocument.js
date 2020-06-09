import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api from "../../Functions/api"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import PdfSvg from "../../Media/Svgs/PdfSvg"
import TickSvg from "../../Media/Svgs/TickSvg"

class AddVideoDocument extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            suggestedVideos: [],
            type: "image",
        }
    }

    searchVideo = value =>
    {
        clearTimeout(this.search)
        this.search = setTimeout(() =>
        {
            this.setState({...this.state, suggestedVideos: []}, () =>
            {
                if (value.length > 2)
                {
                    api.get("video", `?searchTitle=${value}&limit=10`)
                        .then(suggestedVideos => this.setState({...this.state, suggestedVideos}))
                }
            })
        }, 250)
    }

    setDescription = value => this.description = value

    selectVideo(video)
    {
        this.setState({...this.state, video, suggestedVideos: []})
    }

    toggleType(type)
    {
        if (type !== this.state.type)
        {
            this.setState({...this.state, type}, () =>
            {
                this.selectedFile = undefined
                this.setState({...this.state, selectedImagePreview: undefined})
            })
        }
    }

    selectImage = (e) =>
    {
        const file = e.target.files[0]
        this.selectedFile = file
        if (this.state.type === "image")
        {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        }
        else this.setState({...this.state, selectedImagePreview: "pdf"})
        e.target.value = ""
    }

    submit = () =>
    {
        const video_id = this.state.video?._id
        const description = this.description?.trim()
        const type = this.state.type
        const file = this.selectedFile

        if (video_id && description && file)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                let form = new FormData()
                form.append("video_id", video_id)
                form.append("description", description)
                form.append("type", type)
                form.append("file", file)
                api.post("video-document", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                    .then((document) =>
                    {
                        const {addDocument, toggleAddModal} = this.props
                        NotificationManager.success("ایجاد شد!")
                        addDocument(document)
                        toggleAddModal()
                    })
                    .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
            })
        }
        else
        {
            if (!video_id) NotificationManager.warning("لطفا ویدیو مورد نظر را انتخاب کنید!")
            if (!description) NotificationManager.warning("لطفا توضیحات را وارد کنید!")
            if (!file) NotificationManager.warning("لطفا فایل را انتخاب کنید!")
        }
    }

    render()
    {
        const {toggleAddModal} = this.props
        const {loading, suggestedVideos, video, type, selectedImagePreview, loadingPercent} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-cont bigger-size create-small">
                    <div className="create-exchange-title">ساخت مایندمپ!</div>
                    <div className="panel-add-off-main">
                        <div className="panel-add-off-main-menu-cont">
                            {
                                video ?
                                    <div className="panel-add-doc-selected-video" onClick={() => this.selectVideo(undefined)}>
                                        {video.title}
                                        <CancelSvg className="panel-add-doc-selected-video-cancel"/>
                                    </div>
                                    :
                                    <React.Fragment>
                                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="ویدیو | نام ویدیو را سرچ کنید..." getValue={this.searchVideo}/>
                                        {
                                            suggestedVideos.length > 0 &&
                                            <div className="panel-add-off-main-menu">
                                                {
                                                    suggestedVideos.map(item =>
                                                        <Material className="panel-add-off-main-menu-item" key={item._id} onClick={() => this.selectVideo(item)}>{item.title}</Material>,
                                                    )
                                                }
                                            </div>
                                        }
                                    </React.Fragment>
                            }
                        </div>
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="توضیحات" name="description" getValue={this.setDescription}/>
                        <div className="panel-add-doc-select-type">
                            <Material className="login-modal-forget" onClick={() => this.toggleType("image")}>
                                <div className={`login-modal-forget-checkbox ${type === "image" ? "" : "hide"}`}/>
                                عکس
                            </Material>
                            <Material className="login-modal-forget" onClick={() => this.toggleType("pdf")}>
                                <div className={`login-modal-forget-checkbox ${type === "pdf" ? "" : "hide"}`}/>
                                pdf
                            </Material>
                        </div>

                        <label className="panel-add-img">
                            {
                                selectedImagePreview ?
                                    <React.Fragment>
                                        {
                                            selectedImagePreview === "pdf" ?
                                                <TickSvg className="panel-add-doc-pdf"/>
                                                :
                                                <img src={selectedImagePreview} className="create-exchange-selected-img" alt=""/>
                                        }
                                        {loading ? <div className="create-exchange-edit-svg">{loadingPercent} %</div> : <PencilSvg className="create-exchange-edit-svg"/>}
                                    </React.Fragment>
                                    :
                                    <div>
                                        {
                                            type === "pdf" ?
                                                <PdfSvg className="create-exchange-svg"/>
                                                :
                                                <CameraSvg className="create-exchange-svg"/>
                                        }
                                    </div>
                            }
                            <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                            <input disabled={loading} type="file" hidden accept={type === "image" ? "image/*" : "application/pdf"} onChange={this.selectImage}/>
                        </label>

                        <Material className="panel-add-pav-submit" onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={loading ? null : toggleAddModal}/>
            </React.Fragment>
        )
    }
}

export default AddVideoDocument