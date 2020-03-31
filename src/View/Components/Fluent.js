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
            opacityRight: 0,
            opacityLeft: 0,
            opacityBottom: 0,
            opacityTop: 0,
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
                if (e.clientX > rect.left - 85 && e.clientX < rect.right + 85 && e.clientY > rect.top - 85 && e.clientY < rect.bottom + 85)
                {
                    let opacityRight, opacityLeft, opacityBottom, opacityTop

                    opacityTop = 1 - Math.abs((rect.top - e.clientY) / 85)

                    opacityBottom = 1 - Math.abs((e.clientY - rect.bottom) / 85)

                    opacityLeft = 1 - Math.abs((rect.left - e.clientX) / 85)

                    opacityRight = 1 - Math.abs((e.clientX - rect.right) / 85)

                    this.setState({...this.state, opacityTop, opacityBottom, opacityLeft, opacityRight})
                }
                else this.setState({...this.state, opacityTop: 0, opacityBottom: 0, opacityLeft: 0, opacityRight: 0})
            }
        }
    }

    render()
    {
        const {onClick, className, children, fluentColor, borderWidth} = this.props
        const {opacityRight, opacityLeft, opacityBottom, opacityTop} = this.state

        return (
            <div className={`fluent-container ${className}`}
                 style={{padding: borderWidth ? borderWidth : "2px"}}
                 onClick={onClick}>
                <div className="fluent-design" style={{background: `linear-gradient(to right, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: opacityRight}}/>
                <div className="fluent-design" style={{background: `linear-gradient(to left, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: opacityLeft}}/>
                <div className="fluent-design" style={{background: `linear-gradient(to bottom, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: opacityBottom}}/>
                <div className="fluent-design" style={{background: `linear-gradient(to top, transparent, ${fluentColor ? fluentColor : "#424242"})`, opacity: opacityTop}}/>
                <div ref={e => this.fluent = e} className="fluent-content">{children}</div>
            </div>
        )
    }
}

export default Fluent