import React from "react"
// import AboutUsSvg from "../../Media/Svgs/AboutUsSvg"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import InstaSvg from "../../Media/Svgs/InstaSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import TelegramSvg from "../../Media/Svgs/TelegramSvg"
import {Link} from "react-router-dom"
import ExchangeSvg from "../../Media/Svgs/ExchangeSvg"
import LogoSvg from "../../Media/Svgs/LogoSvg"
import Android from "../../Media/Images/Android.png"
import PavilionSvg from "../../Media/Svgs/PavilionSvg"
import ClassSvg from "../../Media/Svgs/ClassSvg"

const goUp = () => window.scroll({top: 0, behavior: "smooth"})

const Footer = () =>
    <div className="footer-container" id="footer">
        <div className="footer-logo-cont">
            <Link to="/" className="footer-logo-section" onClick={goUp}>
                <LogoSvg className="footer-logo"/>
                <div className="footer-desc">K<span>RED</span></div>
            </Link>
            <a href="/KRED.apk" className="footer-logo-section app" download>
                <img loading="lazy" src={Android} className="footer-logo app" alt="kred android application"/>
                <div className="footer-desc app">اپلیکیشن ما رو دانلود کن!</div>
            </a>
        </div>
        <div className="footer-parts">
            <div className="footer-part">
                <div className="footer-part-title">بخش‌های برنامه</div>
                {/*<div className="footer-part-text">*/}
                {/*    <AboutUsSvg className="footer-part-svg"/>*/}
                {/*    درباره ما*/}
                {/*</div>*/}
                <Link to="/videos" className="footer-part-text">
                    <VideoPlayer className="footer-part-svg"/>
                    فیلم‌های آموزشی
                </Link>
                <Link to="/class" className="footer-part-text">
                    <ClassSvg className="footer-part-svg"/>
                    کلاس درس
                </Link>
                <Link to="/pavilions" className="footer-part-text">
                    <PavilionSvg className="footer-part-svg"/>
                    گپ و گفت
                </Link>
                <Link to="/exchanges" className="footer-part-text">
                    <ExchangeSvg className="footer-part-svg"/>
                    تبادل کتاب
                </Link>
            </div>
            <div className="footer-part">
                <div className="footer-part-title">ارتباط با ما</div>
                <a href="https://t.me/KRED_co" target="_blank" rel="noopener noreferrer" className="footer-part-text">
                    <TelegramSvg className="footer-part-svg"/>
                    KRED_co
                </a>
                <a href="mailto://health.in.touch.co@gmail.com" className="footer-part-text">
                    <EmailSvg className="footer-part-svg"/>
                    health.in.touch.co@gmail.com
                </a>
                <a href="https://instagram.com/KRED_co" target="_blank" rel="noopener noreferrer" className="footer-part-text">
                    <InstaSvg className="footer-part-svg"/>
                    KRED_co
                </a>
            </div>
            <div className="footer-part last">
                با کرد لذت درس خوندن رو تجربه کن...
            </div>
        </div>
        <div className="footer-last-line">تمامی حقوق این شبکه متعلق به KRED می‌باشد.</div>
    </div>

export default Footer