import React, {Component} from "react"
import Material from "./Material"
import api from "../Functions/api"

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
            loading: false,
            done: false,
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
        const {setUser} = this.props

        this.setState({...this.state, loading: true, done: false}, () =>
        {
            api.patch("user", {email, name, major, grade, entrance, birth_date, university}, "")
                .then((res) =>
                {
                    this.setState({...this.state, loading: false, done: true}, () => setUser(res))
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

    render()
    {
        const {email, name, major, grade, entrance, birth_date, university, loading, done} = this.state
        return (
            <div className="profile-introduction">
                <div className="profile-introduction-content">
                    <div className="profile-introduction-title">
                        اطلاعات شخصی
                    </div>
                    <div className="profile-info-description">
                        <p>نام کامل</p>
                        <input type="text" placeholder="نام و نام خانوادگی" defaultValue={name ? name : ""} onBlur={(e) => this.setUserData(e, "name")}/>
                        <p>ایمیل</p>
                        <input type="text" placeholder="name@provider.dom" defaultValue={email ? email : ""} dir="ltr" onBlur={(e) => this.setUserData(e, "email")}/>
                        <p>تاریخ تولد</p>
                        <input type="text" placeholder="1375/05/15" defaultValue={birth_date ? birth_date : ""} onBlur={(e) => this.setUserData(e, "birth_date")}/>
                        <p>نام دانشگاه</p>
                        <input type="text" placeholder="صنعتی شریف" defaultValue={university ? university : ""} onBlur={(e) => this.setUserData(e, "university")}/>
                        <p>سال ورودی دانشگاه</p>
                        <input type="text" placeholder="971" defaultValue={entrance ? entrance : ""} onBlur={(e) => this.setUserData(e, "entrance")}/>
                        <p>رشته تحصیلی</p>
                        <input type="text" placeholder="پزشکی" defaultValue={major ? major : ""} onBlur={(e) => this.setUserData(e, "major")}/>
                        <p>مقطع تحصیلی</p>
                        <input type="text" placeholder="دکترا" defaultValue={grade ? grade : ""} onBlur={(e) => this.setUserData(e, "grade")}/>

                        {done && <p className="profile-info-submit-success-text">تغییرات با موفقیت ثبت شد.</p>}
                        <div className="profile-info-submit-buttons-container">
                            <Material type='button' onClick={!loading ? this.handleSubmit : null} className={loading ? "profile-info-submit-button loading" : "profile-info-submit-button"}>
                                ثبت
                            </Material>
                            <Material type='button' className={"profile-info-submit-button loading"}>
                                تغییر رمز
                            </Material>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePageUserInfo