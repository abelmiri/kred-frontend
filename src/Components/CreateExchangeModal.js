import React, {PureComponent} from "react"
import CameraSvg from "../Media/Svgs/Camera"
import Material from "./Material"
import api from "../Functions/api"
import Arrow from "../Media/Svgs/Arrow"

class CreateExchangeModal extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            selectedImagePreview: null,
            loading: false,
            level: 1,
            selectedParent: "5dcbff32d39b3ba7e9c38f9f",
            selectedCategories: [],
            contactType: "phone", //phone || telegram
            priceType: "fixed", //fixed || agreed || free
        }
        this.phoneValid = true
        this.selectedImage = false
        this.titleValid = false
        this.descriptionValid = false
        this.priceValid = false
        this.cityValid = false
        this.selectImage = this.selectImage.bind(this)
        this.submit = this.submit.bind(this)
        this.goNext = this.goNext.bind(this)
        this.goPrevious = this.goPrevious.bind(this)
    }

    selectImage(e)
    {
        const img = e.target.files[0]
        this.selectedImage = img
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => this.setState({...this.state, selectedImagePreview: reader.result})
        e.target.value = ""
    }

    validateInput(e, type)
    {
        if (type === "phone")
        {
            const {contactType} = this.state
            if ((contactType === "phone" && e.target.value.trim().length === 11) || (contactType === "telegram" && e.target.value.trim().length > 2))
            {
                this.phoneValid = true
                e.target.style.border = ""
            }
            else this.phoneValid = false
        }
        else if (type === "city")
        {
            if (e.target.value !== "0")
            {
                this.cityValid = true
                e.target.style.border = ""
            }
            else
            {
                this.cityValid = false
                e.target.style.border = "1px solid red"
            }
        }
        else if (type === "price")
        {
            if (e.target.value.trim().length > 0)
            {
                this.priceValid = true
                e.target.style.border = ""
            }
            else this.priceValid = false
        }
        else if (type === "desc")
        {
            if (e.target.value.trim().length > 0)
            {
                this.descriptionValid = true
                e.target.style.border = ""
            }
            else this.descriptionValid = false
        }
        else if (type === "title")
        {
            if (e.target.value.trim().length > 0)
            {
                this.titleValid = true
                e.target.style.border = ""
            }
            else this.titleValid = false
        }
    }

    blurInput(e, type)
    {
        if (type === "phone")
        {
            const {contactType} = this.state
            if ((contactType === "phone" && e.target.value.trim().length !== 11) || (contactType === "telegram" && e.target.value.trim().length < 3)) e.target.style.border = "1px solid red"
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

    goNext()
    {
        if (this.state.level < 3 && !this.state.loading) this.setState({...this.state, level: this.state.level + 1})
    }

    goPrevious()
    {
        if (this.state.level > 1 && !this.state.loading) this.setState({...this.state, level: this.state.level - 1})
    }

    handleChangeSelected(selectedParent)
    {
        this.setState({...this.state, selectedParent})
    }

    selectCategory(id)
    {
        let selectedCategories = [...this.state.selectedCategories]
        if (selectedCategories.indexOf(id) === -1) this.setState({...this.state, selectedCategories: [...selectedCategories, id]})
        else
        {
            selectedCategories.splice(selectedCategories.indexOf(id), 1)
            this.setState({...this.state, selectedCategories})
        }
    }

    selectContactType(contactType)
    {
        this.setState({...this.state, contactType}, () =>
        {
            if (contactType === "telegram") this.phoneInput.value = ""
        })
    }

    selectPriceType(priceType)
    {
        this.setState({...this.state, priceType}, () =>
        {
            if (priceType === "agreed" || priceType === "free")
            {
                this.priceInput.value = ""
                this.priceInput.disabled = true
                this.priceValid = true
                this.priceInput.style.border = ""
            }
            else
            {
                this.priceInput.value = ""
                this.priceInput.disabled = false
            }
        })
    }

    submit()
    {
        const {loading, selectedCategories, contactType, priceType} = this.state
        const {hideModal} = this.props
        if (!loading && this.selectedImage && this.phoneValid && this.titleValid && this.descriptionValid && this.priceValid && this.cityValid)
        {
            this.setState({...this.state, loading: true}, () =>
            {
                let form = new FormData()
                form.append(contactType, this.phoneInput.value)
                form.append("price", priceType === "free" ? 0 : priceType === "agreed" ? -1 : this.priceInput.value)
                form.append("title", this.titleInput.value)
                form.append("description", this.descriptionInput.value)
                form.append("categories", JSON.stringify(selectedCategories))
                form.append("city_id", this.cityInput.value)
                form.append("picture", this.selectedImage)
                api.post("exchange", form)
                    .then(() =>
                    {
                        alert("آگهی شما ثبت شد و پس از تایید به نمایش در می آید.")
                        hideModal()
                    })
                    .catch(() => alert("سیستم با خطا مواجه شد!"))
            })
        }
    }

    render()
    {
        const {hideModal, cities, defaultPhone, categories} = this.props
        const {selectedImagePreview, loading, level, selectedParent, selectedCategories, contactType} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-cont">
                    <div className='create-exchange-title'>ثبت آگهی تبادل کتاب</div>
                    <div className="create-exchange-main">
                        <div className={`create-exchange-rol ${level === 1 ? "level-one" : level === 2 ? "level-two" : "level-three"}`}>
                            <div className="create-exchange-part">
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
                                <div className='create-exchange-section relative-wrap'>
                                    <label className='create-exchange-section-label'>تماس <span>*</span></label>

                                    <div className="create-exchange-section-checkboxes">
                                        <label className='exchange-page-checkbox'>
                                            <input type="radio" name="phone" defaultChecked onChange={e => e.target.checked ? this.selectContactType("phone") : null}/>
                                            <span className='check-mark'/>
                                            شماره
                                        </label>
                                        <label className='exchange-page-checkbox'>
                                            <input type="radio" name="phone" onChange={e => e.target.checked ? this.selectContactType("telegram") : null}/>
                                            <span className='check-mark'/>
                                            آیدی تلگرام
                                        </label>
                                    </div>

                                    <input defaultValue={defaultPhone}
                                           ref={e => this.phoneInput = e}
                                           type={contactType === "phone" ? "number" : "text"}
                                           className='create-exchange-section-input price'
                                           placeholder={`مثال: ${contactType === "phone" ? "09123456789" : "telegram@"}`}
                                           onBlur={(e) => this.blurInput(e, "phone")}
                                           onChange={(e) => this.validateInput(e, "phone")}
                                           onInput={e => e.target.value = e.target.value.slice(0, 11)}
                                    />
                                </div>
                                <div className='create-exchange-section relative-wrap'>
                                    <label className='create-exchange-section-label'>قیمت <span>*</span></label>

                                    <div className="create-exchange-section-checkboxes">
                                        <label className='exchange-page-checkbox'>
                                            <input type="radio" name="price" defaultChecked onChange={e => e.target.checked ? this.selectPriceType("fixed") : null}/>
                                            <span className='check-mark'/>
                                            مقطوع
                                        </label>
                                        <label className='exchange-page-checkbox'>
                                            <input type="radio" name="price" onChange={e => e.target.checked ? this.selectPriceType("free") : null}/>
                                            <span className='check-mark'/>
                                            رایگان
                                        </label>
                                        <label className='exchange-page-checkbox'>
                                            <input type="radio" name="price" onChange={e => e.target.checked ? this.selectPriceType("agreed") : null}/>
                                            <span className='check-mark'/>
                                            توافقی
                                        </label>
                                    </div>

                                    <input type='number'
                                           ref={e => this.priceInput = e}
                                           className='create-exchange-section-input price'
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
                                              placeholder="مثال: نوشته استاد میری"
                                              onBlur={(e) => this.blurInput(e, "desc")}
                                              onChange={(e) => this.validateInput(e, "desc")}
                                    />
                                </div>
                            </div>

                            <div className="create-exchange-part">
                                <div className="create-exchange-category-btn-cont">
                                    <div>دسته‌بندی <span>*</span></div>
                                    <div className="create-exchange-category-btn">
                                        <div className="create-exchange-category-item right" onClick={() => this.handleChangeSelected("5dcbff32d39b3ba7e9c38f9f")}>بالین</div>
                                        <div className='slideThree'>
                                            <input type='checkbox'
                                                   id='category'
                                                   checked={selectedParent === "5dcbff32d39b3ba7e9c38f9f"}
                                                   onChange={() => this.handleChangeSelected(selectedParent === "5dcbff32d39b3ba7e9c38f9f" ? "5dcbfd44d39b3ba7e9c38e68" : "5dcbff32d39b3ba7e9c38f9f")}
                                            />
                                            <label htmlFor='category'/>
                                        </div>
                                        <div className="create-exchange-category-item left" onClick={() => this.handleChangeSelected("5dcbfd44d39b3ba7e9c38e68")}>علوم پایه</div>
                                    </div>
                                </div>
                                <div className="create-exchange-category-list">
                                    {
                                        Object.values(categories).filter(cat => cat.parent_id === selectedParent).map(category =>
                                            <React.Fragment key={category._id}>
                                                <Material className={`create-exchange-category-title ${selectedCategories.indexOf(category._id) !== -1 ? "selected" : ""}`}
                                                          onClick={() => Object.values(categories).filter(cat => cat.parent_id === category._id).length === 0 ? this.selectCategory(category._id) : null}>
                                                    {category.name}
                                                    {Object.values(categories).filter(cat => cat.parent_id === category._id).length > 0 && <Arrow className="create-exchange-category-arrow"/>}
                                                </Material>
                                                {
                                                    Object.values(categories).filter(cat => cat.parent_id === category._id).map(child =>
                                                        <Material key={child._id} className={`create-exchange-category-title child ${selectedCategories.indexOf(child._id) !== -1 ? "selected" : ""}`} onClick={() => this.selectCategory(child._id)}>
                                                            {child.name}
                                                        </Material>,
                                                    )
                                                }
                                            </React.Fragment>,
                                        )
                                    }
                                </div>
                            </div>

                            <div className="create-exchange-part">
                                <div className='create-exchange-image'>تصویر: <span>*</span></div>
                                <label className='create-exchange-img'>
                                    {
                                        selectedImagePreview ?
                                            <img src={selectedImagePreview} className='create-exchange-selected-img' alt=''/>
                                            :
                                            <React.Fragment>
                                                <CameraSvg className="create-exchange-svg"/>
                                                <input disabled={loading} type='file' hidden accept="image/*" onChange={this.selectImage}/>
                                            </React.Fragment>
                                    }
                                </label>
                                <div className='create-exchange-city'>شهر: <span>*</span></div>
                                <select disabled={loading} className='create-exchange-select' ref={e => this.cityInput = e} onBlur={(e) => this.blurInput(e, "city")} onChange={(e) => this.validateInput(e, "city")}>
                                    <option value={0}>انتخاب</option>
                                    {
                                        Object.values(cities).map(item => <option key={item._id} value={item._id}>{item.name}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <Material className={`create-exchange-submit ${level === 1 ? "create-exchange-hide-width" : "create-exchange-half-width-right"} ${loading ? "create-exchange-hide-submit" : ""}`} onClick={this.goPrevious}>مرحله قبل</Material>
                        <Material className={`create-exchange-submit ${level !== 1 ? "create-exchange-half-width-left" : ""} ${loading ? "create-exchange-hide-submit" : ""}`} onClick={level === 3 ? this.submit : this.goNext}>
                            {level === 3 ? "ثبت آگهی" : "مرحله بعد"}
                        </Material>
                    </div>
                </div>
                <div className="create-exchange-back" onClick={loading ? null : hideModal}/>
            </React.Fragment>
        )
    }
}

export default CreateExchangeModal