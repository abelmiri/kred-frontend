import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class ClassItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            error: false,
            items: [],
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {isBlock, id} = this.props
        api.get(`${isBlock ? "block" : "lesson"}/category`, `?${isBlock ? "block" : "lesson"}_id=${id}`)
            .then((data) =>
            {
                if (data.length > 0)
                {
                    this.setState({...this.state, items: data, loading: false})
                }
                else
                {
                    api.get(`${isBlock ? "block" : "lesson"}`, `${id}`)
                        .then((item) =>
                        {
                            this.setState({...this.state, loading: false, items: [item]})
                        })
                        .catch(() => this.setState({...this.state, error: true, loading: false}))
                }
            })
            .catch(() => this.setState({...this.state, error: true, loading: false}))
    }

    render()
    {
        const {id} = this.props
        const {loading, error} = this.state
        return (
            <React.Fragment>
                <div className="class-item-page-container">
                    {id}
                </div>
                <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                <div className={`exchange-page-loading ${loading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
            </React.Fragment>
        )
    }
}

export default ClassItemPage