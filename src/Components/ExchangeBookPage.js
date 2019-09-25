import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"
import Arrow from "../Media/Svgs/Arrow"

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
                    <div onClick={() => this.container.scrollTo({left: this.container.scrollLeft + 1000, behavior: "smooth"})}><Arrow className="exchange-slider-arrow exchange-slider-right-arrow"/></div>
                    <div onClick={() => this.container.scrollTo({left: this.container.scrollLeft - 1000, behavior: "smooth"})}><Arrow className="exchange-slider-arrow exchange-slider-left-arrow"/></div>
                    <div className='exchange-slider-title'>جدید ترین ها</div>
                    <div className='exchange-slider-container' ref={e => this.container = e}>
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