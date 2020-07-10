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
            sendToAll: true,
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

    toggleSendToAll(sendToAll)
    {
        this.setState({...this.state, sendToAll})
    }

    searchUsers = e =>
    {
        const value = e.target.value
        clearTimeout(this.search)
        this.search = setTimeout(() =>
        {
            this.setState({...this.state, suggestedUsers: []}, () =>
            {
                if (value.length > 2)
                {
                    api.get("user", `?search=${value}&limit=10`)
                        .then(suggestedUsers => this.setState({...this.state, suggestedUsers}))
                }
            })
        }, 250)
    }

    selectUser(user)
    {
        this.setState({...this.state, users: {...this.state.users, [user._id]: user}, suggestedUsers: []})
    }

    removeUser(user)
    {
        const users = {...this.state.users}
        delete users[user._id]
        this.setState({...this.state, users})
    }

    submit = () =>
    {
        const {requireInteraction, renotify, sendToAll, users} = this.state
        const title = this.title?.trim()
        const body = this.body?.trim()
        const tag = this.tag?.trim()
        const url = this.url?.trim()
        const image = this.image

        if (title && body && tag && (sendToAll || (users && Object.values(users).length > 0)))
        {
            let form = new FormData()
            form.append("title", title)
            form.append("body", body)
            form.append("tag", tag)
            url && form.append("url", url)
            requireInteraction !== true && form.append("requireInteraction", requireInteraction)
            renotify !== true && form.append("renotify", renotify)
            sendToAll !== true && form.append("users_id", JSON.stringify(Object.values(users).reduce((sum, item) => [...sum, item._id], [])))
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
                        .catch(err =>
                        {
                            console.log(err)
                            NotificationManager.error("خطایی رخ داد!")
                        })
                })
        }
        else
        {
            if (!title) NotificationManager.warning("عنوان را وارد بفرمایید.")
            if (!body) NotificationManager.warning("متن را وارد بفرمایید.")
            if (!tag) NotificationManager.warning("تگ را وارد بفرمایید. اگ نمیدونی چی بزنی دستتو پرت کن رو کیبورد!")
            if (!sendToAll) NotificationManager.warning("حداقل یک یوزر انتخاب کن!")
        }
    }

    render()
    {
        const {loading, selectedImagePreview, requireInteraction, renotify, suggestedUsers, users, sendToAll} = this.state
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

                <div className="panel-add-notif-radio">
                    <Material className="login-modal-forget class" onClick={loading ? null : () => this.toggleSendToAll(true)}>
                        <div className={`login-modal-forget-radio ${sendToAll ? "" : "hide"}`}/>
                        ارسال به همه
                    </Material>
                    <Material className="login-modal-forget class" onClick={loading ? null : () => this.toggleSendToAll(false)}>
                        <div className={`login-modal-forget-radio ${!sendToAll ? "" : "hide"}`}/>
                        انتخاب کاربران
                    </Material>
                </div>

                {
                    !sendToAll &&
                    <div className="panel-add-off-main-menu-cont">
                        <MaterialInput disabled={loading} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="نام، شماره، ایمیل یا نام‌کاربری" getValue={this.searchUsers}/>
                        {
                            suggestedUsers && suggestedUsers.length > 0 &&
                            <div className="panel-add-off-main-menu">
                                {
                                    suggestedUsers.filter(item => !(users && users[item._id])).map(item =>
                                        <Material className="panel-add-off-main-menu-item" key={item._id} onClick={() => this.selectUser(item)}>
                                            {item.name ? item.name + " | " + item.phone : item.username ? item.username + " | " + item.phone : item.phone}
                                        </Material>,
                                    )
                                }
                            </div>
                        }
                        <div className="panel-add-notif-users">
                            {
                                users && Object.values(users).length > 0 ?
                                    Object.values(users).map(item =>
                                        <div className="panel-add-notif-users-item" onClick={() => this.removeUser(item)}>
                                            {item.name ? item.name + " | " + item.phone : item.username ? item.username + " | " + item.phone : item.phone}
                                        </div>,
                                    )
                                    :
                                    <div className="error-text">کاربری انتخاب نشده است</div>
                            }
                        </div>
                    </div>
                }
                <Material className={`panel-add-pav-submit margin-bottom ${loading ? "loading" : ""}`} onClick={this.submit}>ثبت</Material>
            </section>
        )
    }
}

export default SendNotification