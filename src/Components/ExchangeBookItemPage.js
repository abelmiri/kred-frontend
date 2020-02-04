import React, {PureComponent} from "react"
import api, {REST_URL} from "../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "./Material"
import addCommaPrice from "../Helpers/addCommaPrice"

class ExchangeBookItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            showContact: false,
        }
    }

    componentDidMount()
    {
        const {exchangeId, setExchanges, setCities} = this.props
        api.get(`exchange/${exchangeId}`, `?time=${new Date().toISOString()}`, true).then((data) => setExchanges({[data._id]: {...data}}))
        api.get("city", `?limit=100&time=${new Date().toISOString()}`, true).then((data) => setCities(data))
    }

    toggleContact = () => this.setState({...this.state, showContact: !this.state.showContact})

    render()
    {
        const {exchange, city} = this.props
        const {showContact} = this.state
        return (
            <div className="exchange-show-cont">
                {
                    exchange ?
                        <React.Fragment>
                            <div className="exchange-show-content">
                                <h1 className="exchange-show-title">{exchange.title}</h1>
                                <h2 className="exchange-show-desc">{exchange.description}</h2>
                                {city && <div className='exchange-show-city'>{city.name}</div>}
                                <div className='exchange-show-price'>
                                    {exchange.price === 0 ? "رایگان" : exchange.price === -1 ? "توافقی" : <React.Fragment>{addCommaPrice(exchange.price)} <span>تومان</span></React.Fragment>}
                                </div>
                                <Material className="exchange-show-buy" onClick={this.toggleContact}>می‌خوام بخرم</Material>
                            </div>
                            <img className="exchange-show-img" src={REST_URL + "/" + exchange.picture} alt=""/>

                            {
                                showContact &&
                                <React.Fragment>
                                    <div className="create-exchange-back" onClick={this.toggleContact}/>
                                    <div className="exchange-show-contact">
                                        {
                                            exchange.telegram ?
                                                <React.Fragment>
                                                    آیدی تلگرام
                                                    <a className="exchange-show-contact-link" target="_blank" rel="noopener noreferrer" href={`https://t.me/${exchange.telegram}`}>{exchange.telegram}@</a>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    شماره تماس:
                                                    <a className="exchange-show-contact-link" href={`tel:${exchange.phone}`}>{exchange.phone}</a>
                                                </React.Fragment>
                                        }
                                    </div>
                                </React.Fragment>
                            }

                        </React.Fragment>
                        :
                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                }

            </div>
        )
    }
}

export default ExchangeBookItemPage