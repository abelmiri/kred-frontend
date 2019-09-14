import React, {Component} from "react"
import HIT from "../Media/Images/HIT.png"
import Library from "../Media/Images/Library.jpg"
import Nurses from "../Media/Images/Nurses.png"
import Pavion from "../Media/Images/Pavion.jpg"
import Doctors from "../Media/Images/Doctors.png"
import Material from "./Material"

class HomePage extends Component
{
    changeRoute = (e) =>
    {
        const {goToExchangeBook} = this.props
        const {target} = e
        goToExchangeBook(target, "/exchange")
    }

    render()
    {

        return (
            <React.Fragment>
                <div className='home-background-img'>
                    <h1 className='home-title'>KRED</h1>
                    <h2 className='home-desc'>گام هایی جذاب در دنیای پزشکی</h2>
                </div>
                <div className='home-exchange'>
                    <img className='home-exchange-img' src={Library} alt=''/>
                    <div className='home-exchange-text'>
                        <h3 className='home-exchange-title'>تبادل کتاب</h3>
                        <div className='home-exchange-description'>تو اینجا میتونی هر کتابی رو لازم نداری بفروشی، هر کدومو لازم داری بخری</div>
                        <button className='home-exchange-butt' onClick={this.changeRoute}>برو تو تبادل کتاب</button>
                    </div>
                </div>
                <div className='home-videos'>
                    <div className='home-videos-text'>
                        <h3 className='home-videos-title'>فیلم های آموزشی</h3>
                        <div className='home-exchange-description'>به دنیای جدید آموزش بیا! دیگه نیازی نیست دغدغه یادگیری درسات رو داشته باشی</div>
                        <Material type='button' backgroundColor='rgba(58,175,169,0.2)' className='home-videos-butt'>برو تو فیلم های آموزشی</Material>
                    </div>
                    <img className='home-videos-img' src={Nurses} alt=''/>
                </div>
                <div className='home-exchange'>
                    <img className='home-exchange-img' src={Pavion} alt=''/>
                    <div className='home-exchange-text'>
                        <h3 className='home-exchange-title'>پاویون</h3>
                        <div className='home-exchange-description'>اینجا میتونی با بقیه سال بالایی هات در ارتباط باشی و ازشون کلی تجربه جدید کسب کنی</div>
                        <Material type='button' backgroundColor='rgba(255,255,255,0.3)' className='home-exchange-butt'>برو تو پاویون</Material>
                    </div>
                </div>
                <div className='home-about'>
                    <h3 className='home-about-title'>اینجا چه خبره؟!</h3>
                    <div className='home-about-description'>سلام خدمت شما... ما از فلان چیزا استفاده می کنیم تا فلان بشه و بهمان داستانا پیش نیاد و حال کنید و حال کنیم</div>
                </div>
                <div className='home-exchange'>
                    <img className='home-exchange-img' src={Library} alt=''/>
                    <div className='home-exchange-text'>
                        <h3 className='home-exchange-title'>جزوه ها و خلاصه درس ها</h3>
                        <div className='home-exchange-description'>دیگه سر کلاس جزوه ننویس!</div>
                        <Material type='button' backgroundColor='rgba(255,255,255,0.3)' className='home-exchange-butt'>برو تو جزوه و خلاصه درس</Material>
                    </div>
                </div>
                <div className='home-questions'>
                    <div className='home-videos-text'>
                        <h3 className='home-questions-title'>نمونه سوال</h3>
                        <div className='home-exchange-description'>نمونه سوال بزنی پاسی!</div>
                        <Material type='button' backgroundColor='rgba(58,175,169,0.2)' className='home-questions-butt'>برو تو نمونه سوال</Material>
                    </div>
                    <img className='home-videos-img' src={Doctors} alt=''/>
                </div>
                <div className='home-collab'>
                    <div className='home-collab-cont'>
                        <h3 className='home-collab-title'>تو هم میتونی با کرد همکاری کنی ...</h3>
                        <Material type='button' backgroundColor='rgba(58,175,169,0.2)' className='home-collab-butt'>همکاری با KRED</Material>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default HomePage