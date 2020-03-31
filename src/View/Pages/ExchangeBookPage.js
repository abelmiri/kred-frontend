import React, {PureComponent} from "react"
import ExchangeItem from "../Components/ExchangeItem"
import api from "../../Functions/api"
import Material from "../Components/Material"
import CreateExchangeModal from "../Components/CreateExchangeModal"
import {ClipLoader} from "react-spinners"
import SearchSvg from "../../Media/Svgs/SearchSvg"
import Arrow from "../../Media/Svgs/Arrow"
import MySlider from "../Components/MySlider"
import {Route, Switch} from "react-router-dom"
import ExchangeBookItemPage from "./ExchangeBookItemPage"
import {NotificationManager} from "react-notifications"

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
            selectedParent: "5dcbfd44d39b3ba7e9c38e68",
            selectedCategories: [],
            showCategoryMenu: false,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {getCities, getCategories} = this.props
        api.get("exchange", `?limit=12&page=1&time=${new Date().toISOString()}`)
            .then((data) =>
                this.setState({...this.state, exchangesLoading: false}, () =>
                {
                    this.setState({...this.state, newExchanges: data.slice(0, 6).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}), exchanges: data.slice(6, data.length).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})})
                    this.activeScrollHeight = 0
                    this.page = 2
                }),
            )
            .catch(() => this.setState({...this.state, error: true}))
        getCities()
        getCategories()

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "تبادل کتاب"}).catch(err => console.log(err))

        document.addEventListener("scroll", this.onScroll)
        document.addEventListener("click", this.onClick)
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
        document.addEventListener("click", this.onClick)
    }

    onClick = (e) =>
    {
        if (this.state.showCategoryMenu && this.categories && !this.categories.contains(e.target))
            this.setState({...this.state, showCategoryMenu: false})
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {searchTitle, exchanges, selectedCategories} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(exchanges).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, exchangesLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get("exchange", `?limit=12&page=${this.page}${selectedCategories.length > 0 ? `&searchCategories=${selectedCategories}` : ""}${searchTitle ? `&searchTitle=${searchTitle}` : ""}&time=${new Date().toISOString()}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, exchangesLoading: false, exchanges: {...exchanges, ...data.reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {})}})
                    })
                })
            }
        }, 20)
    }

    changeModalState = (bool) =>
    {
        if (this.props.defaultPhone)
        {
            if (bool)
            {
                if (document.body.clientWidth <= 480) window.history.pushState("", "", "/exchanges/add-exchange")
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
        else
        {
            if (document.getElementById("header-login")) document.getElementById("header-login").click()
            NotificationManager.error("برای ثبت آگهی، در سایت ثبت نام و یا وارد شوید.")
        }
    }

    selectCategory(id)
    {
        let selectedCategories = [...this.state.selectedCategories]
        if (selectedCategories.indexOf(id) === -1) selectedCategories = [...selectedCategories, id]
        else selectedCategories.splice(selectedCategories.indexOf(id), 1)
        this.setState({...this.state, selectedCategories, exchangesLoading: true}, () =>
        {
            const {searchTitle} = this.state
            api.get("exchange", `?limit=12&page=1${selectedCategories.length > 0 ? `&searchCategories=${selectedCategories}` : ""}${searchTitle ? `&searchTitle=${searchTitle}` : ""}&time=${new Date().toISOString()}`).then((data) =>
            {
                if (searchTitle || selectedCategories.length > 0)
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
                        newExchanges: data.slice(0, 6).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                        exchanges: data.slice(6, data.length).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                    })
                }
                this.activeScrollHeight = 0
                this.page = 2
            })
        })

    }

    handleChangeSelected(selectedParent)
    {
        this.setState({...this.state, selectedParent})
    }

    toggleShowCategories = () => this.setState({...this.state, showCategoryMenu: !this.state.showCategoryMenu})

    searchInput = (e) =>
    {
        const searchTitle = e.target.value
        this.setState({...this.state, searchTitle}, () =>
        {
            clearTimeout(this.searchTimeout)
            this.searchTimeout = setTimeout(() =>
            {
                this.setState({...this.state, exchangesLoading: true}, () =>
                    {
                        const {selectedCategories} = this.state
                        api.get("exchange", `?limit=12&page=1${selectedCategories.length > 0 ? `&searchCategories=${selectedCategories}` : ""}${searchTitle ? `&searchTitle=${searchTitle}` : ""}&time=${new Date().toISOString()}`).then((data) =>
                        {
                            if (searchTitle || selectedCategories.length > 0)
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
                                    newExchanges: data.slice(0, 6).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                                    exchanges: data.slice(6, data.length).reduce((sum, exchange) => ({...sum, [exchange._id]: {...exchange}}), {}),
                                })
                            }
                            this.activeScrollHeight = 0
                            this.page = 2
                        })
                    },
                )
            }, 350)
        })
    }

    render()
    {
        const {cities, defaultPhone, categories} = this.props
        const {exchanges, showModal, exchangesLoading, newExchanges, selectedParent, selectedCategories, showCategoryMenu, searchTitle} = this.state
        return (
            <Switch>
                <Route path="/exchanges/:id" render={(route) => <ExchangeBookItemPage exchange={exchanges[route.match.params.id] || newExchanges[route.match.params.id]} exchangeId={route.match.params.id} cities={cities}/>}/>

                <React.Fragment>
                    <div className="page-background-img exchange">
                        <div className="page-des-cont">
                            <h2 className="exchange-desc">تبادل کتاب</h2>
                            <h3 className="exchange-text">
                                اینجا میتونی کتابای ترم های قبلت رو، به ترم پایینی‌ها بدی
                                <br/>
                                اینجوری هم کتابخونه‌ت خلوت‌تر میشه، هم درختای کمتری قطع میشن
                            </h3>
                        </div>
                    </div>

                    <div className="exchange-list-new dont-gesture">
                        <div className="exchange-list-new-title">جـدیـدتـریـن ‌ها</div>
                        {
                            newExchanges && Object.values(newExchanges).length > 0 ?
                                <React.Fragment>
                                    <div className="exchange-list-new-cont">
                                        {Object.values(newExchanges).map(exchange => <ExchangeItem key={exchange._id} inSlide={true} exchange={exchange} city={cities[exchange.city_id]}/>)}
                                    </div>
                                    <MySlider className="exchange-list-new-cont-mobile" dots={true} marginDots="5px 0 15px 0" nodes={
                                        Object.values(newExchanges).map(exchange => <ExchangeItem key={exchange._id} inSlide={true} exchange={exchange} city={cities[exchange.city_id]}/>)
                                    }/>
                                </React.Fragment>
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#FFF"/></div>
                        }
                    </div>

                    <div className="create-exchange-button-search-add-container">
                        <Material className="create-exchange-button" onClick={() => this.changeModalState(true)}>آگهی خودتو بساز</Material>
                        <div className="create-exchange-button-search-cont">
                            <input type="text" className="create-exchange-button-search" placeholder="دنبال چی میگردی؟" onChange={this.searchInput} value={searchTitle}/>
                            <SearchSvg className="create-exchange-button-search-svg"/>
                        </div>
                        <div className="create-exchange-button-search-categories-cont" ref={e => this.categories = e}>
                            <Material className={`create-exchange-button-search-categories ${showCategoryMenu ? "bottom-none" : ""}`} onClick={this.toggleShowCategories}>
                                دسته‌بندی‌ها
                                <div className={`create-exchange-button-search-length ${selectedCategories.length === 0 ? "hide" : ""}`}>{selectedCategories.length}</div>
                                <Arrow className="create-exchange-button-search-categories-arrow"/>
                            </Material>

                            <div className={`create-exchange-button-search-categories-list ${showCategoryMenu ? "" : "hide"}`}>
                                <div className="create-exchange-category-btn search">
                                    <div className="create-exchange-category-item right" onClick={() => this.handleChangeSelected("5dcbff32d39b3ba7e9c38f9f")}>بالین</div>
                                    <div className="slideThree">
                                        <input type="checkbox"
                                               id="categories"
                                               checked={selectedParent === "5dcbff32d39b3ba7e9c38f9f"}
                                               onChange={() => this.handleChangeSelected(selectedParent === "5dcbff32d39b3ba7e9c38f9f" ? "5dcbfd44d39b3ba7e9c38e68" : "5dcbff32d39b3ba7e9c38f9f")}
                                        />
                                        <label htmlFor="categories"/>
                                    </div>
                                    <div className="create-exchange-category-item left" onClick={() => this.handleChangeSelected("5dcbfd44d39b3ba7e9c38e68")}>علوم پایه</div>
                                </div>
                                <div className="create-exchange-button-search-cats">
                                    {
                                        Object.values(categories).filter(cat => cat.parent_id === selectedParent).map(category =>
                                            <React.Fragment key={category._id}>
                                                <Material className={
                                                    `create-exchange-category-title ${selectedCategories.indexOf(category._id) !== -1 ? "selected" : ""}`
                                                }
                                                          onClick={() => Object.values(categories).filter(cat => cat.parent_id === category._id).length === 0 ? this.selectCategory(category._id) : null}>
                                                    {category.name}
                                                    {Object.values(categories).filter(cat => cat.parent_id === category._id).length > 0 && <Arrow className="create-exchange-category-arrow"/>}
                                                </Material>
                                                {
                                                    Object.values(categories).filter(cat => cat.parent_id === category._id).map(child =>
                                                        <Material key={child._id} className={
                                                            `create-exchange-category-title child ${selectedCategories.indexOf(child._id) !== -1 ? "selected" : ""}`
                                                        } onClick={() => this.selectCategory(child._id)}>
                                                            {child.name}
                                                        </Material>,
                                                    )
                                                }
                                            </React.Fragment>,
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="exchange-page-content">
                        <div className="exchange-list">
                            {
                                exchanges && Object.values(exchanges).length > 0 ?
                                    <React.Fragment>
                                        {Object.values(exchanges).map(exchange => <ExchangeItem key={exchange._id} exchange={exchange} city={cities[exchange.city_id]}/>)}
                                        <div className="exchange-item-cont-hide"/>
                                        <div className="exchange-item-cont-hide"/>
                                        <div className="exchange-item-cont-hide"/>
                                        <div className="exchange-item-cont-hide"/>
                                        <div className="exchange-item-cont-hide"/>
                                        <div className="exchange-item-cont-hide"/>
                                    </React.Fragment>
                                    :
                                    exchangesLoading !== true && <div className="exchange-page-loading not-found">موردی یافت نشد!</div>
                            }
                        </div>
                        <div className={`exchange-page-loading ${exchangesLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                    </div>

                    {showModal && <CreateExchangeModal hideModal={() => this.changeModalState(false)} cities={cities} categories={categories} defaultPhone={defaultPhone}/>}
                </React.Fragment>
            </Switch>
        )
    }
}

export default ExchangeBookPage