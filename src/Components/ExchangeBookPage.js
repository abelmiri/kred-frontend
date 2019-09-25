import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"

class ExchangeBookPage extends PureComponent
{
    render()
    {
        return (
            <React.Fragment>
                <div className='exchange-background-img'>
                    <div className='exchange-des-cont'>
                        <h2 className='exchange-desc'>تبادل کتاب</h2>
                        <h3 className='exchange-text'>تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست </h3>
                    </div>
                </div>
                <div className='exchange-slider'>
                    <div className='exchange-slider-title'>جدید ترین ها</div>
                    <div className='exchange-slider-container'>
                        <ExchangeItem/>
                        <ExchangeItem/>
                        <ExchangeItem/>
                        <ExchangeItem/>
                        <ExchangeItem/>
                        <ExchangeItem/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ExchangeBookPage