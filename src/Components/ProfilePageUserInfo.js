import React, {Component} from "react"
import Material from "./Material"
import api from "../Functions/api"

class ProfilePageUserInfo extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            user: {},
        }
    }

    componentDidMount()
    {
        if (localStorage.hasOwnProperty("user"))
        {
            const user = JSON.parse(localStorage.getItem("user"))
            this.setState({...this.state, user})
            console.log(user)
        }
    }

    render()
    {
        const {phone, email, name, major, grade, entrance, birth_date, university} = this.state.user
        return (
            <div className="profile-introduction">
                <div className="profile-introduction-content">
                    <div className="profile-introduction-title">
                        اطلاعات شخصی
                    </div>
                    <div className="profile-info-description">
                        <p>نام کامل</p>
                        <input type="text" placeholder="نام و نام خانوادگی" defaultValue={name ? name : ""}/>
                        <p>ایمیل</p>
                        <input type="text" placeholder="name@provider.dom" defaultValue={email ? email : ""} dir="ltr"/>
                        <p>تاریخ تولد</p>
                        <input type="text" placeholder="1375/05/15"/>
                        <p>نام دانشگاه</p>
                        <input type="text" placeholder="صنعتی شریف"/>
                        <p>سال ورودی دانشگاه</p>
                        <input type="text" placeholder="971"/>
                        <p>رشته تحصیلی</p>
                        <input type="text" placeholder="پزشکی"/>
                        <p>مقطع تحصیلی</p>
                        <input type="text" placeholder="دکترا"/>

                        <div className="profile-info-submit-buttons-container">
                            <Material type='button' className={"profile-info-submit-button"}>ثبت</Material>
                            <Material type='button' className={"profile-info-submit-button"}>تغییر رمز</Material>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePageUserInfo