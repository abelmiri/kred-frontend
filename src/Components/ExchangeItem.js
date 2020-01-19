import React from "react"
import {REST_URL} from "../Functions/api"
import {Link} from "react-router-dom"
import Material from "./Material"

const ExchangeItem = (props) =>
{
    const {exchange, city} = props
    return (
        <Material className="exchange-item-cont">
            <Link to={`/exchange/${exchange._id}`} className="exchange-item-link">
                <img className='exchange-item-img' src={REST_URL + "/" + exchange.picture} alt=''/>
                <div className='exchange-item-title'>{exchange.title}</div>
                <div className="exchange-item-description">{exchange.description}</div>
                <div className='exchange-item-price'>{exchange.price} <span>تومان</span></div>
                {city && <div className='exchange-item-city'>{city && city.name}</div>}
            </Link>
        </Material>
    )
}

export default ExchangeItem