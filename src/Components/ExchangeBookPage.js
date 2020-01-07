import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"
import api from "../Functions/api"
import Material from "./Material"
import CreateExchangeModal from "./CreateExchangeModal"

class ExchangeBookPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            displayShowModal: true,
            showModal: true,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {setExchanges, setCities, setCategories} = this.props
        api.get("exchange", "?limit=100", true).then((data) => setExchanges(data)) // TODO add pagination
        api.get("city", "?limit=100", true).then((data) => setCities(data))
        api.get("category", "?limit=100", true).then((data) => setCategories(data))
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
        if (this.props.defaultPhone)
        {
            if (bool)
            {
                if (document.body.clientWidth <= 480) window.history.pushState("", "", "/exchange/addExchangeModal")
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
        else if (document.getElementById("header-login"))
        {
            document.getElementById("header-login").click()
        }
    }

    render()
    {
        const {exchanges, cities, defaultPhone, categories} = this.props
        const {showModal, displayShowModal} = this.state
        return (
            <div>
                <div className='exchange-background-img'>
                    <div className='exchange-des-cont'>
                        <h2 className='exchange-desc'>تبادل کتاب</h2>
                        {/*<h3 className='exchange-text'>تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست </h3>*/}
                    </div>
                </div>

                <Material className='create-exchange-button' onClick={() => this.changeModalState(true)}>آگهی خودتو بساز</Material>

                <div style={{paddingTop: defaultPhone ? "0" : "5px"}} className='exchange-list'>
                    {
                        exchanges && exchanges.map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)
                    }
                    <div className='exchange-item-cont-hide'/>
                    <div className='exchange-item-cont-hide'/>
                    <div className='exchange-item-cont-hide'/>
                    <div className='exchange-item-cont-hide'/>
                </div>

                {displayShowModal && <CreateExchangeModal showModal={showModal} hideModal={() => this.changeModalState(false)} cities={cities} categories={categories} defaultPhone={defaultPhone}/>}

            </div>
        )
    }
}

export default ExchangeBookPage