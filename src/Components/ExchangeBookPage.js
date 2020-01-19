import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"
import api from "../Functions/api"
import Material from "./Material"
import CreateExchangeModal from "./CreateExchangeModal"
import {ClipLoader} from "react-spinners"

class ExchangeBookPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            displayShowModal: false,
            showModal: false,
            exchangesLoading: true,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {setExchanges, setCities, setCategories} = this.props
        api.get("exchange", `?limit=8&page=1&time=${new Date().toISOString()}`, true).then((data) =>
            this.setState({...this.state, exchangesLoading: false}, () => setExchanges(data.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}))),
        )
        api.get("city", `?limit=100&time=${new Date().toISOString()}`, true).then((data) => setCities(data))
        api.get("category", `?limit=100&time=${new Date().toISOString()}`, true).then((data) => setCategories(data))

        document.addEventListener("scroll", this.onScroll)
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

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {setExchanges, exchanges} = this.props
            if (Object.values(exchanges).length > 0)
            {
                const scrollHeight = document.body ? document.body.scrollHeight : 0
                if (window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
                {
                    this.setState({...this.state, exchangesLoading: true}, () =>
                    {
                        api.get("exchange", `?limit=8&page=${this.page}`, true).then((data) =>
                            this.setState({...this.state, exchangesLoading: false}, () =>
                            {
                                this.activeScrollHeight = scrollHeight
                                this.page = this.page + 1
                                setExchanges({...exchanges, ...data.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})})
                            }),
                        )
                    })
                }
            }
        }, 20)
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
        const {showModal, displayShowModal, exchangesLoading} = this.state
        return (
            <div>
                <div className='exchange-background-img'>
                    <div className='exchange-des-cont'>
                        <h2 className='exchange-desc'>تبادل کتاب</h2>
                        {/*<h3 className='exchange-text'>تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست </h3>*/}
                    </div>
                </div>

                <Material className='create-exchange-button' onClick={() => this.changeModalState(true)}>آگهی خودتو بساز</Material>

                <div className='exchange-list'>
                    {
                        exchanges &&
                        <React.Fragment>
                            {Object.values(exchanges).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)}
                            <div className='exchange-item-cont-hide'/>
                            <div className='exchange-item-cont-hide'/>
                            <div className='exchange-item-cont-hide'/>
                            <div className='exchange-item-cont-hide'/>
                        </React.Fragment>
                    }
                </div>

                {exchangesLoading && <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>}

                {displayShowModal && <CreateExchangeModal showModal={showModal} hideModal={() => this.changeModalState(false)} cities={cities} categories={categories} defaultPhone={defaultPhone}/>}

            </div>
        )
    }
}

export default ExchangeBookPage