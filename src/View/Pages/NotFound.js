import React from "react"
import NotFoundImg from "../../Media/Images/404.png"
import Material from "../Components/Material"
import {Link} from "react-router-dom"
import Footer from "../Components/Footer"

const NotFound = () =>
    <div className="not-found-cont">
        <img loading="lazy" className="not-found-img" src={NotFoundImg} alt="kred not found page!" />
        <div className="not-found-code">404</div>
        <div className="not-found-text">صفحه‌ای که دنبالشی پیدا نشد... :(</div>
        <Link to="/"><Material className="not-found-btn">برگردیم صفحه اصلی</Material></Link>
        <Footer/>
    </div>

export default NotFound