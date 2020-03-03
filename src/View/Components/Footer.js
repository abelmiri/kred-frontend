import React from "react"
import Logo from "../../Media/Images/Logo.png"
import AboutUsSvg from "../../Media/Svgs/AboutUsSvg"
import VideoPlayer from "../../Media/Svgs/VideoPlayer"
import InstaSvg from "../../Media/Svgs/InstaSvg"
import EmailSvg from "../../Media/Svgs/EmailSvg"
import TelegramSvg from "../../Media/Svgs/TelegramSvg"
import {Link} from "react-router-dom"
import Booklet from "../../Media/Svgs/Booklet"

const goUp = () => window.scroll({top: 0, behavior: "smooth"})

const Footer = () =>
    <div className='footer-container'>
        <div className="footer-logo-cont">
            <img src={Logo} alt="KRED LOGO" className="footer-logo"/>
            <div className="footer-desc">KRED | گام هایی جذاب در دنیای پزشکی</div>
        </div>
        <div className="footer-parts">
            <div className="footer-part">
                <div className="footer-part-title">بخش‌های سایت</div>
                <div className="footer-part-text">
                    <AboutUsSvg className="footer-part-svg"/>
                    درباره ما
                </div>
                <Link to="/videos" onClick={goUp} className="footer-part-text">
                    <VideoPlayer className="footer-part-svg"/>
                    فیلم‌های آموزشی
                </Link>
                <Link to="/exchanges" onClick={goUp} className="footer-part-text">
                    <Booklet className="footer-part-svg"/>
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