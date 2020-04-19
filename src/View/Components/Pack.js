import React from "react"
import {REST_URL} from "../../Functions/api"
import TickSvg from "../../Media/Svgs/TickSvg"
import OffCorona from "../../Media/Images/OffCorona.png"
import Material from "./Material"
import addCommaPrice from "../../Helpers/addCommaPrice"
import {Link} from "react-router-dom"

const Pack = (props) =>
{
    const {pack, buyPack} = props
    return (
        <Link className="video-pack-item" to={`/videos/${pack._id}`}>
            {pack.off_percent !== 0 && !pack.have_permission && <img className="video-pack-banner" src={OffCorona} alt="off"/>}
            <img className="video-pack-item-img" src={REST_URL + "/" + pack.picture} alt={pack.title}/>
            {pack.price !== 0 && <div className="video-pack-item-sub">با زیرنویس فارسی</div>}
            <div className="video-pack-item-title">
                <div className="video-pack-item-title-text">
                    مجموعه فیلم‌های<span> </span>{pack.title}
                    {
                        pack.price === 0 ?
                            <div className="video-page-aside-videos-free videos">Free</div>
                            :
                            pack.have_permission && <TickSvg className="video-pack-item-title-svg"/>
                    }
                </div>
                {
                    !pack.have_permission && pack.price !== 0 && buyPack &&
                    <React.Fragment>
                        <Material className="video-pack-item-title-buy view">
                            مشاهده
                        </Material>
                        <Material className="video-pack-item-title-buy" onClick={(e) => buyPack(e, pack)}>
                            خرید ({addCommaPrice(pack.off_percent !== 0 ? ((100 - pack.off_percent) / 100) * pack.price : pack.price)} تومان) {pack.off_percent !== 0 && <span className="video-pack-price-off">{addCommaPrice(pack.price)}</span>}
                        </Material>
                    </React.Fragment>
                }
            </div>
        </Link>
    )
}

export default Pack