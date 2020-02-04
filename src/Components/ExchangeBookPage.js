import React, {PureComponent} from "react"
import ExchangeItem from "./ExchangeItem"
import api from "../Functions/api"
import Material from "./Material"
import CreateExchangeModal from "./CreateExchangeModal"
import {ClipLoader} from "react-spinners"
import SearchSvg from "../Media/Svgs/SearchSvg"
import Arrow from "../Media/Svgs/Arrow"

class ExchangeBookPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            showModal: false,
            exchangesLoading: true,
            searchTitle: "",
            exchanges: {},
            newExchanges: {},
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {getCities, getCategories} = this.props
        api.get("exchange", `?limit=11&page=1&time=${new Date().toISOString()}`, true)
            .then((data) =>
                this.setState({...this.state, exchangesLoading: false}, () =>
                    this.setState({...this.state, newExchanges: data.slice(0, 5).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}), exchanges: data.slice(5, data.length).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})}),
                ),
            )
            .catch(() => this.setState({...this.state, error: true}))
        getCities()
        getCategories()
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
            const {exchangesLoading, searchTitle, exchanges} = this.state
            if (!exchangesLoading)
            {
                const scrollHeight = document.body ? document.body.scrollHeight : 0
                if (window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
                {
                    this.setState({...this.state, exchangesLoading: true}, () =>
                    {
                        api.get("exchange", `?limit=12&page=${this.page}${searchTitle ? `&searchTitle=${searchTitle}` : ""}&time=${new Date().toISOString()}`, true).then((data) =>
                        {
                            this.setState({...this.state, exchangesLoading: false, exchanges: {...exchanges, ...data.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})}})
                            this.activeScrollHeight = scrollHeight
                            this.page += 1
                        })
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
                this.setState({...this.state, showModal: bool})
            }
            else
            {
                if (document.body.clientWidth <= 480) window.history.back()
                else
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, showModal: bool})
                }
            }
        }
        else if (document.getElementById("header-login"))
        {
            document.getElementById("header-login").click()
        }
    }

    searchInput = (e) =>
    {
        const value = e.target.value.trim()
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() =>
        {
            this.setState({...this.state, searchTitle: value, exchangesLoading: true}, () =>
            {
                api.get("exchange", `?limit=12&page=1${value ? `&searchTitle=${value}` : ""}&time=${new Date().toISOString()}`, true).then((data) =>
                {
                    if (value)
                    {
                        this.setState({
                            ...this.state,
                            exchangesLoading: false,
                            exchanges: {...data.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})},
                        })
                    }
                    else
                    {
                        this.setState({
                            ...this.state,
                            exchangesLoading: false,
                            newExchanges: data.slice(0, 5).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                            exchanges: data.slice(5, data.length).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                        })
                    }
                    this.activeScrollHeight = 0
                    this.page = 2
                })
            })
        }, 350)
    }

    render()
    {
        const {cities, defaultPhone, categories} = this.props
        const {exchanges, showModal, exchangesLoading, newExchanges} = this.state
        return (
            <div>
                <div className='exchange-background-img'>
                    <div className='exchange-des-cont'>
                        <h2 className='exchange-desc'>تبادل کتاب</h2>
                        {/*<h3 className='exchange-text'>تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست </h3>*/}
                    </div>
                </div>

                <div className="exchange-list-new">
                    <div className="exchange-list-new-title">جـدیـدتـریـن ‌ها</div>
                    {
                        newExchanges && Object.values(newExchanges).length > 0 ?
                            Object.values(newExchanges).map(exchange => <ExchangeItem key={exchange._id} inSlide={true} exchange={exchange} city={cities[exchange.city_id]}/>)
                            :
                            <div className="exchange-page-loading"><ClipLoader size={24} color="#FFF"/></div>
                    }
                </div>

                <div className="create-exchange-button-search-add-container">
                    <Material className='create-exchange-button' onClick={() => this.changeModalState(true)}>آگهی خودتو بساز</Material>
                    <div className="create-exchange-button-search-cont">
                        <input type="text" className="create-exchange-button-search" placeholder="دنبال چی میگردی؟" onChange={this.searchInput}/>
                        <SearchSvg className="create-exchange-button-search-svg"/>
                    </div>
                    <Material className="create-exchange-button-search-categories">
                        دسته‌بندی‌ها
                        <Arrow className="create-exchange-button-search-categories-arrow"/>
                    </Material>
                </div>

                {
                    <div className='exchange-list'>
                        {
                            exchanges && Object.values(exchanges).length > 0 ?
                            <React.Fragment>
                                {Object.values(exchanges).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)}
                                <div className='exchange-item-cont-hide'/>
                                <div className='exchange-item-cont-hide'/>
                                <div className='exchange-item-cont-hide'/>
                                <div className='exchange-item-cont-hide'/>
                                <div className='exchange-item-cont-hide'/>
                                <div className='exchange-item-cont-hide'/>
                            </React.Fragment>
                                :
                                exchangesLoading !== true && <div className="exchange-page-loading not-found">موردی یافت نشد!</div>
                        }

                    </div>
                }

                <div className={`exchange-page-loading ${exchangesLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>

                {showModal && <CreateExchangeModal hideModal={() => this.changeModalState(false)} cities={cities} categories={categories} defaultPhone={defaultPhone}/>}

            </div>
        )
    }
}

export default ExchangeBookPage