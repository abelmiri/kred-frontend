import React, {PureComponent} from "react"
import api from "../../Functions/api"
import {ClipLoader} from "react-spinners"

class AllPageViews extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            error: false,
            results: [],
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        api.get("view/all/page")
            .then(results => this.setState({...this.state, results}))
            .catch((err) =>
            {
                console.log(err)
                this.setState({...this.state, error: true})
            })
    }

    render()
    {
        const {error, results} = this.state
        if (error) return "خطایی پیش اومد ادمین جان!"
        else
        {
            return (
                <section className="panel-page-section">
                    <div className="panel-page-section-title">بازدید صفحات {results.length > 0 && `(${results.reduce((sum, item) => sum + item.count, 0)})`}</div>
                    <div className="panel-0ff-code-scroll">
                        {
                            results.length > 0 ?
                                <React.Fragment>
                                    <div className="panel-0ff-code-cont title">
                                        <div className="panel-0ff-code-item">صفحه</div>
                                        <div className="panel-0ff-code-item-small">بازدید</div>
                                    </div>
                                    {
                                        results.map(item =>
                                            <div key={"today-pages" + item._id} className="panel-0ff-code-cont">
                                                <div className="panel-0ff-code-item">{item._id}</div>
                                                <div className="panel-0ff-code-item-small">{item.count}</div>
                                            </div>,
                                        )
                                    }
                                </React.Fragment>
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                        }
                    </div>
                </section>
            )
        }
    }
}

export default AllPageViews