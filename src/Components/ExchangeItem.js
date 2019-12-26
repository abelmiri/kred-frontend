import React from "react"
import {REST_URL} from "../Functions/api"

const ExchangeItem = (props) =>
{
    const {exchange, city} = props
    return (
        <div className="exchange-item-cont">
            <img className='exchange-item-img' src={REST_URL + "/" + exchange.picture} alt=''/>
            <div className='exchange-item-border'/>
            <div className='exchange-item-title'>{exchange.title}</div>
            <div className="exchange-item-description in-slide">{exchange.description}</div>
            <div className='exchange-item-price'>{exchange.price} <span>تومان</span></div>
            {city && <div className='exchange-item-city'>{city && city.name}</div>}
        </div>
    )
}

export default ExchangeItem