import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import PencilSvg from "../../Media/Svgs/Pencil"
import CameraSvg from "../../Media/Svgs/Camera"
import {NotificationManager} from "react-notifications"
import compressImage from "../../Helpers/compressImage"
import api from "../../Functions/api"

class PavilionAdd extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: false,
            loadingPercent: 0,
            reload: false,
            selectedImagePreview: null,
        }
        this.title = ""
        this.interviewee_name = ""
        this.interviewee_bio = ""
        this.bold_description = ""
        this.description = ""
        this.selectedImage = false
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

    setTitle = (title) => this.title = title

    setName = (interviewee_name) => this.interviewee_name = interviewee_name

    setBio = (interviewee_bio) => this.interviewee_bio = interviewee_bio

    setBold = (bold_description) => this.bold_description = bold_description

    setDesc = (description) => this.description = description

    submit = () =>
    {
        const {loading} = this.state
        const title = this.title.trim()
        const interviewee_name = this.interviewee_name.trim()
        const interviewee_bio = this.interviewee_bio.trim()
        const bold_description = this.bold_description.trim()
        const description = this.description.trim()
        if (!loading && title.length > 0 && interviewee_name.length > 0 && interviewee_bio.length > 0 && bold_description.length > 0 && description.length > 0 && this.selectedImage)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                let form = new FormData()
                form.append("title", title)
                form.append("description", description)
                form.append("bold_description", bold_description)
                form.append("interviewee_name", interviewee_name)
                form.append("interviewee_bio", interviewee_bio)
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

    postData(form)
    {
        api.post("conversation", form, "", (e) => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
            .then(() =>
                this.setState({...this.state, loading: false, loadingPercent: 0, reload: true, selectedImagePreview: null}, () =>
                {
                    this.title = ""
                    this.bold_description = ""
                    this.description = ""
                    this.selectedImage = false
                    NotificationManager.success("با موفقیت ثبت شد ادمین جون.")
                    setTimeout(() => this.setState({...this.state, reload: false}), 150)
                }),
            )
            .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
    }

    render()
    {
        const {reload, selectedImagePreview, loading, loadingPercent} = this.state
        return (
            <section className="panel-page-section">
                <div className="panel-page-section-title">ساخت گپ و گفت</div>
                <MaterialInput reload={reload} className="panel-add-pav-title" backgroundColor="white" label="عنوان" getValue={this.setTitle}/>
                <MaterialInput reload={reload} isTextArea={true} className="panel-add-pav-title area" backgroundColor="white" label="متن بولد" getValue={this.setBold}/>
                <MaterialInput reload={reload} isTextArea={true} className="panel-add-pav-title area" backgroundColor="white" label="توضیحات (سوالات را بین ** قرار دهید)" getValue={this.setDesc}/>
                <MaterialInput reload={reload} className="panel-add-pav-title" backgroundColor="white" label="نام طرف" getValue={this.setName}/>
                <MaterialInput reload={reload} className="panel-add-pav-title" backgroundColor="white" label="بیو طرف" getValue={this.setBio}/>
                <label className='panel-add-img'>
                    {
                        selectedImagePreview ?
                            <React.Fragment>
                                <img src={selectedImagePreview} className='create-exchange-selected-img' alt=''/>
                                {loading ? <div className="create-exchange-edit-svg">{loadingPercent} %</div> : <PencilSvg className="create-exchange-edit-svg"/>}
                            </React.Fragment>
                            :
                            <CameraSvg className="create-exchange-svg"/>
                    }
                    <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                    <input disabled={loading} type='file' hidden accept="image/*" onChange={this.selectImage}/>
                </label>
                <Material className="panel-add-pav-submit" onClick={this.submit}>ثبت</Material>
            </section>
        )
    }
}

export default PavilionAdd