import React, {PureComponent} from "react"
import * as PropTypes from "prop-types"

class Fluent extends PureComponent
{
    static propTypes = {
        className: PropTypes.string,
        borderWidth: PropTypes.string,
        fluentColor: PropTypes.string,
        onClick: PropTypes.func,
    }

    constructor(props)
    {
        super(props)
        this.state = {
            sign: 0,
            opacity: 0,
        }
        this.mouseMove = this.mouseMove.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("mousemove", this.mouseMove)
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousemove", this.mouseMove)
    }

    mouseMove(e)
    {
        if (this.fluent)
        {
            const rect = this.fluent.getBoundingClientRect()
            if (rect.top + rect.height >= 0)
            {
                if (e.clientX > rect.left - 100 && e.clientX < rect.right + 100)
                {
                    if (e.clientY > rect.top - 100 && e.clientY < rect.bottom + 100)
                    {
                        let opacity = 0
                        let sign = 0

                        if (rect.top - e.clientY > 0) opacity += (rect.top - e.clientY) / 100

                        else if (e.clientY - rect.bottom > 0) opacity += (e.clientY - rect.bottom) / 100

                        if (rect.left - e.clientX > 0) opacity += (rect.left - e.clientX) / 100

                        else if (e.clientX - rect.right > 0) opacity += (e.clientX - rect.right) / 100


                        if (rect.left - e.clientX > 0)
                        {
                            if (rect.top + (rect.height / 2) - e.clientY > 0)
                            {
                                sign = 2
                            }
                            else
                            {
                                sign = 4
                            }
                        }
                        else if (e.clientX - rect.right > 0)
                        {
                            if (rect.top + (rect.height / 2) - e.clientY > 0)
                            {
                                sign = 1
                            }
                            else
                            {
                                sign = 3
                            }
                        }
                        ///////////////////////////////////////////////////////////////
                        if (rect.top - e.clientY > 0)
                        {
                            if (rect.left + (rect.width / 2) - e.clientX > 0)
                            {
                                sign = 2
                            }
                            else
                            {
                                sign = 1
                            }
                        }
                        else if (e.clientY - rect.bottom > 0)
                        {
                            if (rect.left + (rect.width / 2) - e.clientX > 0)
                            {
                                sign = 4
                            }
                            else
                            {
                                sign = 3
                            }
                        }
                        this.setState({...this.state, sign, opacity: 1 - opacity.toFixed(1)}, () =>
                        {
                            if (e.clientX > rect.left && e.clientX < rect.right)
                            {
                                if (e.clientY > rect.top && e.clientY < rect.bottom)
                                {
                                    this.setState({...this.state, sign: 5})
                                }
                            }
                        })
                    }
                    else this.setState({...this.state, sign: 0})
                }
                else this.setState({...this.state, sign: 0})
            }
        }
    }

    render()
    {
        const {sign, opacity} = this.state
        const {onClick, className, children, fluentColor, borderWidth} = this.props

        return (
            <div className={`fluent-container ${className}`}
                 style={{padding: borderWidth ? borderWidth : "2px"}}
                 onClick={onClick}>
                <div className='fluent-design' style={{background: `linear-gradient(to top right, transparent, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: sign === 1 || sign === 5 ? opacity : 0}}/>
                <div className='fluent-design' style={{background: `linear-gradient(to top left, transparent, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: sign === 2 || sign === 5 ? opacity : 0}}/>
                <div className='fluent-design' style={{background: `linear-gradient(to bottom right, transparent, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: sign === 3 || sign === 5 ? opacity : 0}}/>
                <div className='fluent-design' style={{background: `linear-gradient(to bottom left, transparent, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: sign === 4 || sign === 5 ? opacity : 0}}/>
                <div ref={e => this.fluent = e} className='fluent-content'>{children}</div>
            </div>
        )
    }
}

export default Fluent