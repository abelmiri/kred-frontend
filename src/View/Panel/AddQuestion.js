import React, {PureComponent} from "react"
import MaterialInput from "../Components/MaterialInput"
import Material from "../Components/Material"
import {NotificationManager} from "react-notifications"
import api, {REST_URL} from "../../Functions/api"
import CameraSvg from "../../Media/Svgs/Camera"
import CancelSvg from "../../Media/Svgs/CancelSvg"
import compressImage from "../../Helpers/compressImage"

class AddQuestion extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    setTitle = e => this.title = e.target.value
    setFirst = e => this.first_answer = e.target.value
    setSecond = e => this.second_answer = e.target.value
    setThird = e => this.third_answer = e.target.value
    setForth = e => this.forth_answer = e.target.value
    setCorrect = e => this.correct_answer = e.target.value

    selectImage = (e) =>
    {
        const img = e.target.files[0]
        this.selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    removePiv = () =>
    {
        this.selectedImage = null
        this.setState({...this.state, selectedImagePreview: undefined})
    }

    submit = () =>
    {
        const {quiz_id, update} = this.props
        const title = this.title?.trim()
        const first_answer = this.first_answer?.trim()
        const second_answer = this.second_answer?.trim()
        const third_answer = this.third_answer?.trim()
        const forth_answer = this.forth_answer?.trim()
        const correct_answer = this.correct_answer?.trim()
        const selectedImage = this.selectedImage

        if (update)
        {
            if (title || first_answer || second_answer || third_answer || forth_answer || (correct_answer && parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1) || selectedImage)
            {
                this.setState({...this.state, loading: true}, () =>
                {
                    const form = new FormData()
                    form.append("question_id", update._id)
                    title && form.append("title", title)
                    first_answer && form.append("first_answer", first_answer)
                    second_answer && form.append("second_answer", second_answer)
                    third_answer && form.append("third_answer", third_answer)
                    forth_answer && form.append("forth_answer", forth_answer)
                    correct_answer && form.append("correct_answer", correct_answer)
                    compressImage(selectedImage)
                        .then(img =>
                        {
                            img && form.append("picture", img)
                            api.patch("quiz/question", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                                .then((question) =>
                                {
                                    console.log(question)
                                    const {updateQuestionFunc, toggleAddModal} = this.props
                                    NotificationManager.success("حله")
                                    updateQuestionFunc(question)
                                    toggleAddModal()
                                })
                                .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
                        })
                })
            }
            else
            {
                if (correct_answer && !(parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1)) NotificationManager.warning("گزینه صحیح باید عددی از 1 تا 4 باشد")
                else NotificationManager.warning("شما تغییری ایجاد نکرده اید!")
            }
        }
        else
        {
            if (title && first_answer && second_answer && third_answer && forth_answer && correct_answer && parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1)
            {
                this.setState({...this.state, loading: true}, () =>
                {
                    const form = new FormData()
                    form.append("quiz_id", quiz_id)
                    form.append("title", title)
                    form.append("first_answer", first_answer)
                    form.append("second_answer", second_answer)
                    form.append("third_answer", third_answer)
                    form.append("forth_answer", forth_answer)
                    form.append("correct_answer", correct_answer)
                    compressImage(selectedImage)
                        .then(img =>
                        {
                            img && form.append("picture", img)
                            api.post("quiz/question", form, "", e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}))
                                .then((question) =>
                                {
                                    const {addQuestionFunc, toggleAddModal} = this.props
                                    NotificationManager.success("حله")
                                    addQuestionFunc(question)
                                    toggleAddModal()
                                })
                                .catch(() => this.setState({...this.state, loading: false}, () => NotificationManager.error("سیستم با خطا مواجه شد!")))
                        })
                })
            }
            else
            {
                if (!title) NotificationManager.warning("متن سوال را وارد کن!")
                if (!first_answer) NotificationManager.warning("متن گزینه 1 را وارد کن!")
                if (!second_answer) NotificationManager.warning("متن گزینه 2 را وارد کن!")
                if (!third_answer) NotificationManager.warning("متن گزینه 3 را وارد کن!")
                if (!forth_answer) NotificationManager.warning("متن گزینه 4 را وارد کن!")
                if (!(correct_answer && parseInt(correct_answer) <= 4 && parseInt(correct_answer) >= 1)) NotificationManager.warning("گزینه صحیح باید عددی از 1 تا 4 باشد")
            }
        }
    }

    render()
    {
        const {toggleAddModal, update} = this.props
        const {loading, selectedImagePreview, loadingPercent} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-cont bigger-size create-small">
                    <div className="create-exchange-title">{update ? "ویرایش" : "ساخت"} سوال</div>
                    <div className="panel-add-off-main">
                        <MaterialInput disabled={loading} defaultValue={update?.title} className="panel-add-pav-title no-margin-top" backgroundColor="white" label="سوال" getValue={this.setTitle}/>
                        <MaterialInput disabled={loading} defaultValue={update?.first_answer} className="panel-add-pav-title" backgroundColor="white" label="گزینه 1" getValue={this.setFirst}/>
                        <MaterialInput disabled={loading} defaultValue={update?.second_answer} className="panel-add-pav-title" backgroundColor="white" label="گزینه 2" getValue={this.setSecond}/>
                        <MaterialInput disabled={loading} defaultValue={update?.third_answer} className="panel-add-pav-title" backgroundColor="white" label="گزینه 3" getValue={this.setThird}/>
                        <MaterialInput disabled={loading} defaultValue={update?.forth_answer} className="panel-add-pav-title" backgroundColor="white" label="گزینه 4" getValue={this.setForth}/>
                        <MaterialInput disabled={loading} defaultValue={update?.correct_answer} className="panel-add-pav-title" backgroundColor="white" label="گزینه صحیح" getValue={this.setCorrect}/>

                        <label className="panel-add-img" onClick={selectedImagePreview ? this.removePiv : null}>
                            {
                                selectedImagePreview || update?.picture ?
                                    <React.Fragment>
                                        <img src={selectedImagePreview || REST_URL + update.picture} className="create-exchange-selected-img" alt=""/>
                                        {loading ? <div className="create-exchange-edit-svg">{loadingPercent} %</div> : <CancelSvg className="create-exchange-edit-svg"/>}
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <CameraSvg className="create-exchange-svg"/>
                                        <input disabled={loading} type="file" hidden accept="image/*" onChange={this.selectImage}/>
                                    </React.Fragment>
                            }
                            <div className="create-exchange-selected-uploading" style={{transform: `scaleY(${loadingPercent / 100})`}}/>
                        </label>
                        <Material className="panel-add-pav-submit" onClick={loading ? null : this.submit}>ثبت</Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={toggleAddModal}/>
            </React.Fragment>
        )
    }
}

export default AddQuestion