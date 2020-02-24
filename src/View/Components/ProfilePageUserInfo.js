import React, {Component} from "react"
import Material from "./Material"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"

class ProfilePageUserInfo extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            email: "",
            name: "",
            major: "",
            grade: "",
            entrance: "",
            birth_date: "",
            university: "",
            password: "",
            loading: false,
            done: false,
            pass_modal: false,
            done_pass: false,
            wrong_pass: false,
        }
    }

    componentDidMount()
    {
        if (localStorage.hasOwnProperty("user"))
        {
            const user = JSON.parse(localStorage.getItem("user"))
            this.setState({
                ...this.state,
                name: user.name && user.name,
                email: user.email && user.email,
                birth_date: user.birth_date && user.birth_date,
                university: user.university && user.university,
                entrance: user.entrance && user.entrance,
                major: user.major && user.major,
                grade: user.grade && user.grade,
                password: user.password && user.password,
            })
        }
    }

    setUserData = (e, type) =>
    {
        switch (type)
        {
            case "name":
                this.setState({...this.state, name: e.target.value.trim()})
                break
            case "email":
                this.setState({...this.state, email: e.target.value.trim().toLocaleLowerCase()})
                break
            case "birth_date":
                this.setState({...this.state, birth_date: e.target.value.trim()})
                break
            case "university":
                this.setState({...this.state, university: e.target.value.trim()})
                break
            case "entrance":
                this.setState({...this.state, entrance: e.target.value.trim()})
                break
            case "major":
                this.setState({...this.state, major: e.target.value.trim()})
                break
            case "grade":
                this.setState({...this.state, grade: e.target.value.trim()})
                break
            default:
                break
        }
    }

    handleSubmit = () =>
    {
        const {email, name, major, grade, entrance, birth_date, university} = this.state
        const {setUser, resolve} = this.props

        if (!name || !university)
        {
            if (!name) NotificationManager.error("لطفا اسم خودتون رو وارد کنید!")
            if (!university) NotificationManager.error("لطفا دانشگاه خودتون رو وارد کنید!")
        }
        else
        {
            this.setState({...this.state, loading: true, done: false}, () =>
            {
                api.patch("user", {email, name, major, grade, entrance, birth_date, university}, "")
                    .then((res) =>
                    {
                        this.setState({...this.state, loading: false, done: true}, () =>
                        {
                            setUser(res)
                            setTimeout(() => resolve && resolve(), 150)
                        })
                    })
                    .catch((e) =>
                    {
                        if (e.message === "Request failed with status code 404")
                        {
                            localStorage.removeItem("user")
                            this.setState({...this.state, loading: false})
                        }
                    })
            })
        }
    }

    handlePassModal = () =>
    {
        const {pass_modal, loading} = this.state
        if (!loading)
        {
            this.setState({...this.state, pass_modal: !pass_modal, done_pass: false, wrong_pass: false})
        }
    }

    handlePassChange = () =>
    {
        const {password} = this.state
        const {setUser} = this.props
        const oldPass = this.oldPasswordInput.value
        const newPass = this.newPasswordInput.value

        if (oldPass === password && newPass.length >= 8 && newPass.length <= 20)
        {
            this.setState({...this.state, loading: true, done_pass: false, wrong_pass: false}, () =>
            {
                api.patch("user", {password: newPass}, "")
                    .then((res) =>
                    {
                        this.setState({...this.state, loading: false, done_pass: true, password: newPass}, () => setUser(res))
                    })
                    .catch((e) =>
                    {
                        if (e.message === "Request failed with status code 404")
                        {
                            localStorage.clear()
                            this.setState({...this.state, loading: false})
                        }
                    })
            })
        }
        else this.setState({...this.state, wrong_pass: true})
    }

    render()
    {
        const {email, name, major, grade, entrance, birth_date, university, pass_modal, loading, done, done_pass, wrong_pass} = this.state
        const {showPrompt, dontShowPasswordBtn} = this.props
        return (
            <div className="profile-introduction">
                <div className="profile-introduction-content">
                    {showPrompt && <div className="profile-introduction-title">میشه اطلاعات پروفایلت رو کامل کنی؟</div>}
                    <div className="profile-info-description">
                        <div>
                            <p>نام کامل <span>*</span></p>
                            <input type="text" placeholder="نام و نام خانوادگی" defaultValue={name ? name : ""} onBlur={(e) => this.setUserData(e, "name")}/>
                        </div>
                        <div>
                            <p>ایمیل</p>
                            <input type="email" placeholder="name@provider.dom" defaultValue={email ? email : ""} dir="ltr" onBlur={(e) => this.setUserData(e, "email")}/>
                        </div>
                        <div>
                            <p>تاریخ تولد</p>
                            <input type="text" placeholder="1375/05/15" defaultValue={birth_date ? birth_date : ""} onBlur={(e) => this.setUserData(e, "birth_date")}/>
                        </div>
                        <div>
                            <p>نام دانشگاه <span>*</span></p>
                            <input type="text" placeholder="علوم پزشکی ایران" defaultValue={university ? university : ""} onBlur={(e) => this.setUserData(e, "university")}/>
                        </div>
                        <div>
                            <p>سال ورودی دانشگاه</p>
                            <input type="text" placeholder="971" defaultValue={entrance ? entrance : ""} onBlur={(e) => this.setUserData(e, "entrance")}/>
                        </div>
                        <div>
                            <p>رشته تحصیلی</p>
                            <input type="text" placeholder="پزشکی" defaultValue={major ? major : ""} onBlur={(e) => this.setUserData(e, "major")}/>
                        </div>
                        <div>
                            <p>مقطع تحصیلی</p>
                            <input type="text" placeholder="دکترا" defaultValue={grade ? grade : ""} onBlur={(e) => this.setUserData(e, "grade")}/>
                        </div>

                        {done && <p className="profile-info-submit-success-text">تغییرات با موفقیت ثبت شد.</p>}
                        <div className="profile-info-submit-buttons-container">
                            <Material type='button' style={dontShowPasswordBtn ? {flexGrow: 1} : {}} onClick={!loading ? this.handleSubmit : null} className={`profile-info-submit-button ${loading ? "loading" : ""}`}>
                                ثبت
                            </Material>
                            {
                                !dontShowPasswordBtn &&
                                <Material type='button' onClick={!loading ? this.handlePassModal : null} className={loading ? "profile-info-submit-button loading" : "profile-info-submit-button"}>
                                    تغییر رمز
                                </Material>
                            }
                        </div>
                        {pass_modal ?
                            <React.Fragment>
                                <div className="exchange-show-contact password">
                                    <div className='create-exchange-title'>تغییر رمز پروفایل</div>
                                    <div className="create-exchange-main">
                                        <div className="create-exchange-part">
                                            <div className='create-exchange-section'>
                                                <label className='create-exchange-section-label'>رمز قدیمی <span>*</span></label>
                                                <input type='password'
                                                       className='create-exchange-section-input'
                                                       placeholder="رمز پروفایل"
                                                       maxLength={20}
                                                       ref={e => this.oldPasswordInput = e}
                                                />
                                            </div>
                                            <div className='create-exchange-section'>
                                                <label className='create-exchange-section-label'>رمز جدید <span>*</span></label>
                                                <input type='password'
                                                       className='create-exchange-section-input'
                                                       placeholder="بین 8 تا 20 کاراکتر"
                                                       maxLength={20}
                                                       ref={e => this.newPasswordInput = e}
                                                />
                                            </div>
                                            {done_pass && <p className="profile-info-submit-success-text">رمز با موفقیت تغییر کرد.</p>}
                                            {wrong_pass && <p className="profile-info-submit-error-text">رمز غلط است.</p>}
                                        </div>
                                        <div>
                                            <Material className={loading ? "create-exchange-submit loading" : "create-exchange-submit"} onClick={!loading ? this.handlePassChange : null}>
                                                تغییر رمز
                                            </Material>
                                        </div>
                                    </div>
                                </div>
                                <div className="create-exchange-back" onClick={!loading ? this.handlePassModal : null}/>
                            </React.Fragment>
                            : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePageUserInfo