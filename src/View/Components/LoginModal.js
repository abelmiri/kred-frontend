import React, {PureComponent} from "react"
import Logo from "../../Media/Images/Logo.png"
import Material from "./Material"
import {ClipLoader} from "react-spinners"
import {Link} from "react-router-dom"
import api from "../../Functions/api"
import {NotificationManager} from "react-notifications"

class LoginModal extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loginLoading: false,
            rememberMe: true,
            forgetPassword: false,
        }
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.login()

    toggleRememberMe = () => this.setState({...this.state, rememberMe: !this.state.rememberMe})

    toggleForgetPassword = () => this.setState({...this.state, forgetPassword: !this.state.forgetPassword})

    login = () =>
    {
        const {loginLoading, rememberMe, forgetPassword} = this.state
        if (!loginLoading)
        {
            if (forgetPassword)
            {
                const phone = this.phoneInput.value.trim()
                if (phone.length === 11 && !isNaN(phone))
                {
                    api.post("user/forget-password", {phone}, "", true)
                        .then(() =>
                        {
                            NotificationManager.success("رمز عبور برای شما ارسال شد!")
                            this.setState({...this.state, loginLoading: false, forgetPassword: false})
                        })
                        .catch((e) =>
                        {
                            this.setState({...this.state, loginLoading: false}, () =>
                                NotificationManager.error(e.response.status === 404 ? "کاربری با شماره موبایل وارد شده یافت نشد." : "سایت در ارسال اطلاعات با خطا مواجه شد!"),
                            )
                        })
                }
                else NotificationManager.warning("شماره موبایل را به درستی وارد کنید.")
            }
            else
            {
                const phone = this.phoneInput.value.trim()
                const password = this.passwordInput.value
                if (phone.length > 0 && password.length >= 6 && password.length <= 30)
                {
                    this.setState({...this.state, loginLoading: true}, () =>
                    {
                        api.post("user/login", {phone, password}, "", true)
                            .then((data) =>
                            {
                                const {setUser, hideLoginModal} = this.props
                                setUser(data, !rememberMe)
                                hideLoginModal()
                            })
                            .catch((e) =>
                            {
                                this.setState({...this.state, loginLoading: false}, () =>
                                    NotificationManager.error(e.response.status === 404 ? "کاربری با اطلاعات وارد شده یافت نشد." : "سایت در ارسال اطلاعات با خطا مواجه شد!"),
                                )
                            })
                    })
                }
                else NotificationManager.warning("اطلاعات ورود را به درستی وارد کنید.")
            }
        }
    }

    render()
    {
        const {hideLoginModal, setOverflowAuto} = this.props
        const {loginLoading, rememberMe, forgetPassword} = this.state
        return (
            <React.Fragment>
                <div className="create-exchange-back" onClick={hideLoginModal}/>
                <div className="create-exchange-cont login">
                    <div className='create-exchange-title login'>ورود به KRED</div>
                    <img className="login-modal-logo" src={Logo} alt="kred"/>
                    <div className='create-exchange-section margin-top-none'>
                        <input type='text'
                               ref={e => this.phoneInput = e}
                               className='create-exchange-section-input'
                               placeholder={forgetPassword ? "شماره موبایل" : "ایمیل یا شماره موبایل"}
                               maxLength={forgetPassword ? 11 : 60}
                               name="phone"
                               onKeyDown={this.submitOnEnter}
                        />
                    </div>
                    <div className={`create-exchange-section ${forgetPassword ? "hide" : "show"}`}>
                        <input type='password'
                               ref={e => this.passwordInput = e}
                               className='create-exchange-section-input'
                               placeholder="رمز عبور"
                               maxLength={30}
                               name="password"
                               onKeyDown={this.submitOnEnter}
                        />
                    </div>
                    <div className="login-modal-forget-cont">
                        <Material className="login-modal-forget" onClick={this.toggleRememberMe}>
                            <div className={`login-modal-forget-checkbox ${rememberMe ? "" : "hide"}`}/>
                            مرا بخاطر بسپار
                        </Material>
                        <Material className="login-modal-forget" onClick={this.toggleForgetPassword}>{forgetPassword ? "بازگشت" : "بازیابی رمز عبور"}</Material>
                    </div>
                    <Material className={`header-login-submit ${loginLoading ? "loading" : ""}`} onClick={this.login}>
                        {loginLoading ? <ClipLoader color="white" size={15}/> : forgetPassword ? "بازیابی رمز" : "ورود"}
                    </Material>
                    <Link onClick={setOverflowAuto} to="/sign-up" className='login-modal-sign-up'>ثبت نام در KRED</Link>
                </div>
            </React.Fragment>
        )
    }
}

export default LoginModal