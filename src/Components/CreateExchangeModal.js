import React, {Component} from "react"
import CameraSvg from "../Media/Svgs/Camera"
import Material from "./Material"
import api from "../Functions/api"

let phoneValid = true

let selectedImage = false
let titleValid = false
let descriptionValid = false
let priceValid = false
let cityValid = false

class CreateExchangeModal extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            selectedImagePreview: null,
            loading: false,
        }
        this.selectImage = this.selectImage.bind(this)
        this.submit = this.submit.bind(this)
    }

    selectImage(e)
    {
        const img = e.target.files[0]
        selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    validateInput(e, type)
    {
        if (type === "phone")
        {
            if (e.target.value.trim().length === 11)
            {
                phoneValid = true
                e.target.style.border = ""
            }
            else phoneValid = false
        }
        else if (type === "city")
        {
            if (e.target.value !== "0")
            {
                cityValid = true
                e.target.style.border = ""
            }
            else
            {
                cityValid = false
                e.target.style.border = "1px solid red"
            }
        }
        else if (type === "price")
        {
            if (e.target.value.trim().length > 0)
            {
                priceValid = true
                e.target.style.border = ""
            }
            else priceValid = false
        }
        else if (type === "desc")
        {
            if (e.target.value.trim().length > 0)
            {
                descriptionValid = true
                e.target.style.border = ""
            }
            else descriptionValid = false
        }
        else if (type === "title")
        {
            if (e.target.value.trim().length > 0)
            {
                titleValid = true
                e.target.style.border = ""
            }
            else titleValid = false
        }
    }

    blurInput(e, type)
    {
        if (type === "phone")
        {
            if (e.target.value.trim().length !== 11) e.target.style.border = "1px solid red"
        }
        else if (type === "city")
        {
            if (e.target.value === "0") e.target.style.border = "1px solid red"
        }
        else
        {
            if (e.target.value.trim().length === 0) e.target.style.border = "1px solid red"
        }
    }

    submit()
    {
        if (!this.state.loading && selectedImage && phoneValid && titleValid && descriptionValid && priceValid && cityValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                let form = new FormData()
                form.append("phone", this.phoneInput.value)
                form.append("price", this.priceInput.value)
                form.append("title", this.titleInput.value)
                form.append("description", this.descriptionInput.value)
                form.append("category_id", "5d822e2567cafe3e00e8d61a")
                form.append("city_id", this.cityInput.value)
                form.append("picture", selectedImage)
                api.post("exchange", form)
                    .then(() =>
                    {
                        alert("آگهی شما ثبت شد و پس از تایید به نمایش در می آید.")
                        this.props.hideModal()
                    })
                    .catch(() => this.setState({...this.state, }, () => alert("سیستم با خطا مواجه شد!")))
            })
        }
    }

    render()
    {
        const {showModal, hideModal, cities, defaultPhone} = this.props
        const {selectedImagePreview, loading} = this.state
        return (
            <React.Fragment>
                <div className={`create-exchange-cont ${showModal ? "show" : "hide"}`}>
                    <div className='create-exchange-title'>ثبت آگهی تبادل کتاب</div>
                    <div className='create-exchange-main'>
                        <div className='create-exchange-part'>
                            <div className='create-exchange-section'>
                                <label className='create-exchange-section-label'>عنوان <span>*</span></label>
                                <input type='text'
                                       ref={e => this.titleInput = e}
                                       className='create-exchange-section-input'
                                       placeholder="مثال: کتاب زمین شناسی"
                                       maxLength={60}
                                       onBlur={(e) => this.blurInput(e, "title")}
                                       onChange={(e) => this.validateInput(e, "title")}
                                />
                            </div>
                            <div className='create-exchange-section'>
                                <label className='create-exchange-section-label'>شماره تماس <span>*</span></label>
                                <input defaultValue={defaultPhone}
                                       ref={e => this.phoneInput = e}
                                       type='number'
                                       className='create-exchange-section-input'
                                       placeholder="مثال: 09123456789"
                                       onBlur={(e) => this.blurInput(e, "phone")}
                                       onChange={(e) => this.validateInput(e, "phone")}
                                       onInput={e => e.target.value = e.target.value.slice(0, 11)}
                                />
                            </div>
                            <div className='create-exchange-section relative'>
                                <label className='create-exchange-section-label'>قیمت <span>*</span></label>
                                <input type='number'
                                       ref={e => this.priceInput = e}
                                       className='create-exchange-section-input'
                                       placeholder="مثال: 25,000"
                                       onBlur={(e) => this.blurInput(e, "price")}
                                       onChange={(e) => this.validateInput(e, "price")}
                                       onInput={e => e.target.value = e.target.value.slice(0, 8)}
                                />
                                <div className="create-exchange-price">تومان</div>
                            </div>
                            <div className='create-exchange-section'>
                                <label className='create-exchange-section-label'>توضیحات <span>*</span></label>
                                <textarea rows={6}
                                          ref={e => this.descriptionInput = e}
                                          className='create-exchange-section-input'
                                          placeholder="مثال: نوشته استاد میری، چاپ سال 95"
                                          onBlur={(e) => this.blurInput(e, "desc")}
                                          onChange={(e) => this.validateInput(e, "desc")}
                                />
                            </div>
                        </div>
                        <div className='create-exchange-part'>
                            <div className='create-exchange-image'>تصویر: <span>*</span></div>
                            <label className='create-exchange-img'>
                                {
                                    selectedImagePreview ?
                                        <img src={selectedImagePreview} className='create-exchange-selected-img' alt=''/>
                                        :
                                        <React.Fragment>
                                            <CameraSvg className="create-exchange-svg"/>
                                            <input type='file' hidden accept="image/*" onChange={this.selectImage}/>
                                        </React.Fragment>
                                }
                            </label>
                            <div className='create-exchange-city'>شهر: <span>*</span></div>
                            <select className='create-exchange-select' ref={e => this.cityInput = e} onBlur={(e) => this.blurInput(e, "city")} onChange={(e) => this.validateInput(e, "city")}>
                                <option value={0}>انتخاب</option>
                                {
                                    Object.values(cities).map(item => <option key={item._id} value={item._id}>{item.name}</option>)
                                }
                            </select>
                        </div>
                        <Material className={`create-exchange-submit ${loading ? "hide" : ""}`} onClick={this.submit}>ثبت آگهی</Material>
                    </div>
                </div>
                <div className={`create-exchange-back ${showModal ? "show" : "hide"}`} onClick={hideModal}/>
            </React.Fragment>
        )
    }
}

export default CreateExchangeModal