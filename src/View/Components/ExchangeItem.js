import React from "react"
import {REST_URL} from "../../Functions/api"
import {Link} from "react-router-dom"
import Material from "./Material"
import addCommaPrice from "../../Helpers/addCommaPrice"

const ExchangeItem = (props) =>
{
    const {exchange, city, inSlide} = props
    return (
        <Link to={`/exchange/${exchange._id}`} className="exchange-item-cont">
            <Material className={`exchange-item-cont-material ${inSlide ? "in-slide" : ""}`}>
                <img className={`exchange-item-img ${inSlide ? "in-slide" : ""}`} src={REST_URL + "/" + exchange.picture} alt={exchange.title}/>
                <div className='exchange-item-title'>{exchange.title}</div>
                <div className="exchange-item-description">{exchange.description}</div>
                <div className='exchange-item-price'>
                    {exchange.price === 0 ? "رایگان" : exchange.price === -1 ? "توافقی" : <React.Fragment>{addCommaPrice(exchange.price)} <span>تومان</span></React.Fragment>}
                </div>
                {city && <div className='exchange-item-city'>{city.name}</div>}
            </Material>
        </Link>
    )
}

export default ExchangeItem