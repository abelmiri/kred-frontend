import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"
import Arrow from "../Media/Svgs/Arrow"
import api from "../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "./Material"
import CreateExchangeModal from "./CreateExchangeModal"

class ExchangeBookPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            displayShowModal: false,
            showModal: false,
        }
    }

    componentDidMount()
    {
        const {setExchanges, setCities} = this.props
        api.get("exchange", "?limit=20&skip=0", true).then((data) => setExchanges(data)) // TODO add pagination
        api.get("city", "?limit=100", true).then((data) => setCities(data))
    }

    componentDidUpdate()
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.showModal)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showModal: false})
                    setTimeout(() => this.setState({...this.state, displayShowModal: false}), 150)
                }
            }
        }
    }

    changeModalState = (bool) =>
    {
        if (bool)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", "/exchange/add")
            document.body.style.overflow = "hidden"
            this.setState({...this.state, displayShowModal: bool})
            setTimeout(() => this.setState({...this.state, showModal: bool}), 150)
        }
        else
        {
            if (document.body.clientWidth <= 480) window.history.back()
            else
            {
                document.body.style.overflow = "auto"
                this.setState({...this.state, showModal: bool})
                setTimeout(() => this.setState({...this.state, displayShowModal: bool}), 150)
            }
        }
    }

    render()
    {
        const {exchanges, cities, defaultPhone} = this.props
        const {showModal, displayShowModal} = this.state
        return (
            <div>
                <div className='exchange-background-img'>
                    <div className='exchange-des-cont'>
                        <h2 className='exchange-desc'>تبادل کتاب</h2>
                        <h3 className='exchange-text'>تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست </h3>
                    </div>
                </div>
                <div className='exchange-slider'>
                    <div className='exchange-slider-title'>جدید ترین ها</div>
                    <div className='exchange-slider-container-relative'>
                        <div className='exchange-slider-container' ref={e => this.container = e}>
                            {
                                exchanges.length > 0 ?
                                    exchanges.slice(0, 4).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)
                                    :
                                    <ClipLoader/>
                            }
                        </div>
                        {
                            exchanges.length > 0 &&
                            <React.Fragment>
                                <Arrow className="exchange-slider-arrow exchange-slider-right-arrow" onClick={() => this.container.scrollTo({left: this.container.scrollLeft + 1000, behavior: "smooth"})}/>
                                <Arrow className="exchange-slider-arrow exchange-slider-left-arrow" onClick={() => this.container.scrollTo({left: this.container.scrollLeft - 1000, behavior: "smooth"})}/>
                            </React.Fragment>
                        }
                    </div>
                </div>

                {defaultPhone && <Material className='create-exchange-button' onClick={() => this.changeModalState(true)}>آگهی خودتو بساز</Material>}

                <div className='exchange-list'>
                    {
                        exchanges.slice(4, exchanges.length).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)
                    }
                    <div className='exchange-item-cont-hide'/>
                    <div className='exchange-item-cont-hide'/>
                </div>

                {displayShowModal && <CreateExchangeModal showModal={showModal} hideModal={() => this.changeModalState(false)} cities={cities} defaultPhone={defaultPhone}/>}


            </div>
        )
    }
}

export default ExchangeBookPage