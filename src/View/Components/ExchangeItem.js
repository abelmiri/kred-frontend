import React from "react"
import api, {REST_URL} from "../../Functions/api"
import {Link} from "react-router-dom"
import Material from "./Material"
import addCommaPrice from "../../Helpers/addCommaPrice"
import {NotificationManager} from "react-notifications"

const deleteExchangeFunc = (e, id, deleteExchange) =>
{
    e.preventDefault()
    api.del("exchange", null, id)
        .then(() =>
        {
            NotificationManager.success("آگهی شما با موفقیت حذف شد!")
            deleteExchange(id)
        })
        .catch(() => NotificationManager.error("مشکلی پیش آمد. اینرنت خود را بررسی کنید."))
}

const ExchangeItem = (props) =>
{
    const {exchange, city, inSlide, onProfile, deleteExchange} = props
    return (
        <Link to={`/exchanges/${exchange._id}`} className="exchange-item-cont">
            <Material className={`exchange-item-cont-material ${inSlide ? "in-slide" : ""}`}>
                <img className={`exchange-item-img ${inSlide ? "in-slide" : ""}`} src={REST_URL + "/" + exchange.picture} alt={exchange.title}/>
                <div className='exchange-item-title'>{exchange.title}</div>
                <div className="exchange-item-description">{exchange.description}</div>
                <div className='exchange-item-price'>
                    {exchange.price === 0 ? "رایگان" : exchange.price === -1 ? "توافقی" : <React.Fragment>{addCommaPrice(exchange.price)} <span>تومان</span></React.Fragment>}
                </div>
                {
                    !onProfile ?
                        city && <div className='exchange-item-city'>{city.name}</div>
                        :
                        <div className="exchange-item-remove-cont">
                            <Material className="video-pack-item-title-buy exchange" onClick={(e) => deleteExchangeFunc(e, exchange._id, deleteExchange)}>
                                حذف
                            </Material>
                        </div>
                }
            </Material>
        </Link>
    )
}

export default ExchangeItem