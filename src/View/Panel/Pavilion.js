import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api, {REST_URL} from "../../Functions/api"
import AudioSvg from "../../Media/Svgs/AudioSvg"
import {ClipLoader} from "react-spinners"

class Pavilion extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
            loadingPercent: 0,
            selectedImagePreview: null,
            add: false,
            postsLoading: true,
            posts: {},
            isUpdating: false,
        }
        this.title = ""
        this.interviewee_name = ""
        this.interviewee_bio = ""
        this.bold_description = ""
        this.description = ""
        this.selectedImage = false
        this.selectedAudio = false

        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        api.get("conversation", `?limit=50&page=1&time=${new Date().toISOString()}`)
            .then((data) => this.setState({...this.state, postsLoading: false, posts: data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}))
            .catch(() => this.setState({...this.state, error: true, postsLoading: false}))

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(posts).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, postsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("conversation", `?limit=50&page=${this.page}&time=${new Date().toISOString()}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, postsLoading: false, posts: {...posts, ...data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}})
                    })
                })
            }
        }, 20)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.add)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, add: false})
                }
            }
        }
    }

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    selectAudio = (e) =>
    {
        const audio = e.target.files[0]
        e.target.value = ""
        this.setState({...this.state, selectedAudioPreview: null}, () =>
        {
            this.selectedAudio = audio
            const reader = new FileReader()
            reader.readAsDataURL(audio)
            reader.onload = () => this.setState({...this.state, selectedAudioPreview: reader.result})
        })
    }

    setTitle = (title) => this.title = title

    setName = (interviewee_name) => this.interviewee_name = interviewee_name

    setBio = (interviewee_bio) => this.interviewee_bio = interviewee_bio

    setBold = (bold_description) => this.bold_description = bold_description

    setDesc = (description) => this.description = description

    submit = () =>
    {
        const {isUpdating, loading} = this.state
        const title = this.title.trim()
        const interviewee_name = this.interviewee_name.trim()
        const interviewee_bio = this.interviewee_bio.trim()
        const bold_description = this.bold_description.trim()
        const description = this.description.trim()
        if (!loading)
        {
            if (!isUpdating)
            {
                if (title.length > 0 && interviewee_name.length > 0 && interviewee_bio.length > 0 && bold_description.length > 0 && description.length > 0 && this.selectedImage)
                {
                    this.setState({...this.state, loading: true}, () =>
                    {
                        let form = new FormData()
                        form.append("title", title)
                        form.append("description", description)
                        form.append("bold_description", bold_description)
                        form.append("interviewee_name", interviewee_name)
                        form.append("interviewee_bio", interviewee_bio)
                        if (this.selectedAudio) form.append("audio", this.selectedAudio)
                        compressImage(this.selectedImage)
                            .then(img =>
                            {
                                form.append("picture", img)
                                this.postData(form)
                            })
                    })
                }
                else
                {
                    if (title.length === 0) NotificationManager.warning("فیلد عنوان را پر کنید!")
                    if (interviewee_name.length === 0) NotificationManager.warning("فیلد نام طرف را پر کنید!")
                    if (interviewee_bio.length === 0) NotificationManager.warning("فیلد بیو طرف را پر کنید!")
                    if (bold_description.length === 0) NotificationManager.warning("فیلد متن بولد را پر کنید!")
                    if (description.length === 0) NotificationManager.warning("فیلد توضیحات را پر کنید!")
                    if (!this.selectedImage) NotificationManager.warning("عکس را بارگزاری کنید!")
                }
            }
            else
            {
                if (title.length > 0 || interviewee_name.length > 0 || interviewee_bio.length > 0 || bold_description.length > 0 || description.length > 0 || this.selectedImage || this.selectedAudio)
                {
                    let form = new FormData()
                    form.append("conversation_id", isUpdating._id)
                    if (title.length > 0) form.append("title", title)
                    if (interviewee_name.length > 0) form.append("interviewee_name", interviewee_name)
                    if (interviewee_bio.length > 0) form.append("interviewee_bio", interviewee_bio)
                    if (description.length > 0) form.append("description", description)
                    if (bold_description.length > 0) form.append("bold_description", bold_description)
                    if (this.selectedAudio) form.append("audio", this.selectedAudio)
                    if (this.selectedImage)
                    {
                        compressImage(this.selectedImage)
                            .then(img =>
                            {
                                form.append("picture", img)
                                this.patchData(form)
                            })
                    }
                    else this.patchData(form)
                }
                else NotificationManager.warning("شما تغییری ایجاد نکرده اید!")
            }
        }
    }

    postData(form)
    {
        api.post("conversation", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((conversation) =>
                this.setState({...this.state, posts: {[conversation._id]: {...conversation}, ...this.state.posts}, loading: false}, () =>
                {
                    NotificationManager.success("با موفقیت ثبت شد ادمین جون.")
                    this.toggleAddModal()
                }),
            )
            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
    }

    patchData(form)
    {
        api.patch("conversation", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then((updateConversation) =>
                this.setState({...this.state, posts: {...this.state.posts, [updateConversation._id]: {...updateConversation}}, loading: false}, () =>
                {
                    NotificationManager.success("با موفقیت آپدیت شد ادمین جون.")
                    this.toggleAddModal()
                }),
            )
            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
    }

    toggleAddModal = () =>
    {
        if (!this.state.loading)
        {
            const add = !this.state.add
            if (add)
            {
                if (document.body.clientWidth <= 480) window.history.pushState("", "", "/panel/pavilion/add")
                document.body.style.overflow = "hidden"
                this.setState({...this.state, add})
            }
            else
            {
                if (document.body.clientWidth <= 480) window.history.back()
                document.body.style.overflow = "auto"
                this.setState({...this.state, add, isUpdating: false, loading: false, loadingPercent: 0, selectedAudioPreview: null, selectedImagePreview: null}, () =>
                {
                    this.title = ""
                    this.interviewee_name = ""
                    this.interviewee_bio = ""
                    this.bold_description = ""
                    this.description = ""
                    this.selectedImage = false
                    this.selectedAudio = false
                })
            }
        }
    }

    goForUpdate(post)
    {
        this.setState({...this.state, isUpdating: {...post}}, () => this.toggleAddModal())
    }

    render()
    {
        const {add, posts, postsLoading, selectedImagePreview, loading, loadingPercent, selectedAudioPreview, isUpdating} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">گپ و گفت</div>

                {
                    Object.values(posts).length > 0 &&
                    <React.Fragment>
                        <div className="panel-0ff-code-cont title">
                            <div className="panel-0ff-code-item-big">عنوان</div>
                            <div className="panel-0ff-code-item">طرف!</div>
                        </div>
                        {
                            Object.values(posts).map((post) =>
                                <Material key={post._id} className="panel-0ff-code-cont" onClick={() => this.goForUpdate(post)}>
                                    <div className="panel-0ff-code-item-big">{post.title}</div>
                                    <div className="panel-0ff-code-item">{post.interviewee_name}</div>
                                </Material>,
                            )
                        }
                    </React.Fragment>
                }
                <div className={`exchange-page-loading ${postsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>

                <Material className="panel-0ff-code-add" onClick={this.toggleAddModal}>
                    +
                </Material>

                {
                    add &&
                    <React.Fragment>
                        <div className="create-exchange-cont bigger-size create-small">
                            <div className="create-exchange-title">{isUpdating ? "ویرایش" : "ساخت"} گپ و گفت</div>
                            <div className="panel-add-off-main">
                                <MaterialInput disabled={loading} defaultValue={isUpdating.title} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="عنوان *" getValue={this.setTitle}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.bold_description} isTextArea={true} className="panel-add-pav-title area" backgroundColor="white" label="متن بولد *" getValue={this.setBold}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.description} isTextArea={true} className="panel-add-pav-title area" backgroundColor="white" label="توضیحات (سوالات را بین ** قرار دهید) *" getValue={this.setDesc}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.interviewee_name} className="panel-add-pav-title" backgroundColor="white" label="نام طرف *" getValue={this.setName}/>
                                <MaterialInput disabled={loading} defaultValue={isUpdating.interviewee_bio} className="panel-add-pav-title" backgroundColor="white" label="بیو طرف *" getValue={this.setBio}/>
                                <label className="panel-add-audio">
                                    {
                                        selectedAudioPreview || isUpdating.audio ?
                                            <React.Fragment>
                                                <audio controls>
                                                    <source src={selectedAudioPreview || REST_URL + "/" + isUpdating.audio}/>
                                                </audio>
                                                <PencilSvg className="create-exchange-edit-svg"/>
                                            </React.Fragment>
                                            :
                                            <AudioSvg className="panel-add-audio-svg"/>
                                    }
                                    <input disabled={loading} type="file" hidden accept="audio/*" onChange={this.selectAudio}/>
                                </label>
                                <label className="panel-add-img">
                                    {
                                        selectedImagePreview || isUpdating.picture ?
                                            <React.Fragment>
                                                <img src={selectedImagePreview || REST_URL + "/" + isUpdating.picture} className="create-exchange-selected-img" alt=""/>
                                                {loading ? <div className="create-exchange-edit-svg">{loadingPercent} %</div> : <PencilSvg className="create-exchange-edit-svg"/>}
                                            </React.Fragment>
                                            :
                                            <div>
                                                <span className="panel-add-img-star">*</span>
                                                <CameraSvg className="create-exchange-svg"/>
                                            </div>
                                    }
                                    <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                                    <input disabled={loading} type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                </label>
                                <Material className="panel-add-pav-submit" onClick={this.submit}>ثبت</Material>
                            </div>
                        </div>
                        <div className="create-exchange-back" onClick={this.toggleAddModal}/>
                    </React.Fragment>
                }

            </section>
        )
    }
}

export default Pavilion