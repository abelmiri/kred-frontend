import React from "react"
import Example from "../Media/Images/Example.jpg"

const ExchangeItem = (props) =>
    <div className='exchange-item-cont'>
        <img className='exchange-item-img' src={Example} alt=''/>
        <div className='exchange-item-border'/>
        <div className='exchange-item-title'>درسنامه جامع علوم پایه دندانپزشکی میری!</div>
    </div>

export default ExchangeItem