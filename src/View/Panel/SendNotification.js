import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import CameraSvg from "../../Media/Svgs/Camera"
import Material from "../Components/Material"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"

class SendNotification extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            requireInteraction: true,
            renotify: true,
        }
    }

    setValue = e => this[e.target.name] = e.target.value

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.image = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    removePiv = () =>
    {
        this.image = null
        setTimeout(() => this.setState({...this.state, selectedImagePreview: undefined}), 50)
    }

    toggleRequire = () => this.setState({...this.state, requireInteraction: !this.state.requireInteraction})

    toggleRenotify = () => this.setState({...this.state, renotify: !this.state.renotify})

    submit = () =>
    {
        const {requireInteraction, renotify} = this.state
        const title = this.title?.trim()
        const body = this.body?.trim()
        const tag = this.tag?.trim()
        const url = this.url?.trim()
        const image = this.image

        if (title && body && tag)
        {
            let form = new FormData()
            form.append("title", title)
            form.append("body", body)
            form.append("tag", tag)
            url && form.append("url", url)
            requireInteraction !== true && form.append("requireInteraction", requireInteraction)
            renotify !== true && form.append("renotify", renotify)
            compressImage(image)
                .then(image =>
                {
                    image && form.append("image", image)
                    api.post("send-notification", form)
                        .then(() =>
                        {
                            NotificationManager.success("ها")
                            this.setState({...this.state, loading: false})
                        })
                        .catch(err => NotificationManager.error(err))
                })
        }
        else
        {
            if (!title) NotificationManager.warning("عنوان را وارد بفرمایید.")
            if (!body) NotificationManager.warning("متن را وارد بفرمایید.")
            if (!tag) NotificationManager.warning("تگ را وارد بفرمایید. اگ نمیدونی چی بزنی دستتو پرت کن رو کیبورد!")
        }
    }

    render()
    {
        const {loading, selectedImagePreview, requireInteraction, renotify} = this.state || {}
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">ارسال نوتیفیکیشن</div>

                <MaterialInput disabled={loading} name="title" className="panel-add-pav-title" backgroundColor="white" label={<span>عنوان <span className="required-star">*</span></span>} getValue={this.setValue}/>
                <MaterialInput disabled={loading} name="body" isTextArea={true} className="panel-add-pav-title area" backgroundColor="white" label={<span>متن <span className="required-star">*</span></span>} getValue={this.setValue}/>
                <MaterialInput disabled={loading} name="tag" className="panel-add-pav-title" backgroundColor="white" placeholder="از این فیلد، برای گروپ کردن نوتیف ها استفاده میشه!" label={<span>تگ <span className="required-star">*</span></span>} getValue={this.setValue}/>
                <MaterialInput disabled={loading} name="url" className="panel-add-pav-title left" backgroundColor="white" placeholder="https://www.kred.ir/videos" label={<span>آدرس</span>} getValue={this.setValue}/>

                <Material className="login-modal-forget class" onClick={loading ? null : this.toggleRequire}>
                    <div className={`login-modal-forget-checkbox ${requireInteraction ? "" : "hide"}`}/>
                    نیاز به تعامل :/
                </Material>

                <Material className="login-modal-forget class" onClick={loading ? null : this.toggleRenotify}>
                    <div className={`login-modal-forget-checkbox ${renotify ? "" : "hide"}`}/>
                    اعلام مجدد
                </Material>

                <label className="panel-add-img" onClick={selectedImagePreview ? this.removePiv : null}>
                    {
                        selectedImagePreview ?
                            <React.Fragment>
                                <img src={selectedImagePreview} className="create-exchange-selected-img" alt=""/>
                                <CancelSvg className="create-exchange-edit-svg"/>
                            </React.Fragment>
                            :
                            <div>
                                <CameraSvg className="create-exchange-svg"/>
                                <input disabled={loading} type="file" hidden accept="image/*" onChange={this.selectImage}/>
                            </div>
                    }
                </label>
                <Material className={`panel-add-pav-submit ${loading ? "loading" : ""}`} onClick={this.submit}>ثبت</Material>
            </section>
        )
    }
}

export default SendNotification