import React, {PureComponent} from "react"
import {Link} from "react-router-dom"
import Slider1 from "../../Media/Images/login-slider1.png"
import Slider2 from "../../Media/Images/login-slider2.png"
import Slider3 from "../../Media/Images/login-slider3.png"
import api from "../../Functions/api"
import ExchangeItem from "./ExchangeItem"
import {ClipLoader} from "react-spinners"
import ExchangeSvg from "../../Media/Svgs/ExchangeSvg"

class ProfilePageDashboard extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.slides = [
            {img: Slider1, text: "دیگه لازم نیست پول زیادی برای کتاب‌هات خرج کنی!"},
            {img: Slider2, text: "دیگه وقتشه حرفه ای درس بخونی!"},
            {img: Slider3, text: "توی KRED از حال و هوای دانشجوهای موفق باخبر شو!"},
        ]
        this.state = {
            sliderIndex: 0,
            previousSlider: this.slides.length - 1,
            exchanges: {},
            exchangeLoading: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        this.sliderInterval = setInterval(() =>
        {
            const {sliderIndex} = this.state
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === this.slides.length ? 0 : sliderIndex + 1})
        }, 5000)

        const {user} = this.props
        api.get("exchange", `?limit=100&page=1&user_id=${user._id}`)
            .then((exchanges) => this.setState({...this.state, exchangeLoading: false, exchanges: exchanges.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})}))
            .catch(() => this.setState({...this.state, exchangeErr: true}))
    }

    componentWillUnmount()
    {
        clearInterval(this.sliderInterval)
    }

    setSlider = (index) =>
    {
        const {sliderIndex} = this.state
        if (sliderIndex !== index)
        {
            this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: index}, () =>
            {
                clearInterval(this.sliderInterval)
                this.sliderInterval = setInterval(() =>
                {
                    const {sliderIndex} = this.state
                    this.setState({...this.state, previousSlider: sliderIndex, sliderIndex: sliderIndex + 1 === this.slides.length ? 0 : sliderIndex + 1})
                }, 5000)
            })
        }
    }

    deleteExchange = (id) =>
    {
        const exchanges = {...this.state.exchanges}
        delete exchanges[id]
        this.setState({...this.state, exchanges})
    }

    render()
    {
        const {sliderIndex, previousSlider, exchanges, exchangeErr, exchangeLoading} = this.state
        return (
            <React.Fragment>
                <div className="profile-introduction">
                    <div className="profile-introduction-content">
                        <div className="profile-introduction-title">
                            سلام!
                        </div>
                        <div className="profile-introduction-description">
                            <p>به KRED خوش اومدی <span role="img" aria-label="">😊</span></p>
                            <p>اینجا برای نتیجه گیریه! یک جمع صمیمی از دانشجوهای علوم پزشکی با کلی تجربه و محتوا و اتفاق جالب... خوشحال میشیم تو هم بیای.</p>
                            <p>کرِد یک کلمه باستانیه که ریشه‌ی تمام کلماتی حساب میشه که معنیشون قلبه... <span role="img" aria-label="">🧡</span></p>
                            <p>حالا بیا با قسمت های مختلف آشنا بشیم:</p>
                            <div className="profile-introduction-links">
                                <Link to="/videos" className="link">فیلم‌های آموزشی</Link>
                                <Link to="/pavilions" className="link">گپ و گفت</Link>
                                <Link to="/exchanges" className="link">تبادل کتاب</Link>
                                <Link to="/class" className="link">کلاس درس</Link>
                            </div>
                        </div>
                    </div>
                    <div className="profile-introduction-slider">
                        {
                            this.slides.map((item, index) =>
                                <div key={"slide" + index}
                                     style={{opacity: sliderIndex === index ? "1" : "0", left: sliderIndex === index ? "0" : previousSlider === index ? "30px" : "-30px"}}
                                     className="login-slider-item">
                                    <img loading="lazy" src={item.img} alt="" className="login-slider-img"/>
                                    <div className="login-slider-text">{item.text}</div>
                                </div>,
                            )
                        }
                        <div className="login-slider-dots">
                            {
                                this.slides.map((dot, index) =>
                                    <div onClick={() => this.setSlider(index)} style={{backgroundColor: sliderIndex === index ? "#878787" : "white"}} className="login-slider-dot" key={"dot" + index}/>,
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="profile-my-books">
                    <div className="profile-save-part">
                        <div>آگهی های من</div>
                        <ExchangeSvg className="profile-save-part-svg"/>
                    </div>
                    {
                        Object.values(exchanges).length > 0 ?
                            <div className="exchange-list in-profile">
                                {Object.values(exchanges).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} onProfile={true} deleteExchange={this.deleteExchange}/>)}
                                <div className="exchange-item-cont-hide"/>
                                <div className="exchange-item-cont-hide"/>
                                <div className="exchange-item-cont-hide"/>
                                <div className="exchange-item-cont-hide"/>
                                <div className="exchange-item-cont-hide"/>
                                <div className="exchange-item-cont-hide"/>
                            </div>
                            :
                            exchangeErr ?
                                <div className="profile-save-section-err">برنامه در گرفتن اطلاعات با خطا مواجه شد!</div>
                                :
                                exchangeLoading ?
                                    <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                                    :
                                    <div className="profile-save-part-empty">موردی یافت نشد!</div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default ProfilePageDashboard