import React from "react"
import * as PropTypes from "prop-types"

class Material extends React.Component
{
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func,
        backgroundColor: PropTypes.string,
    }

    constructor(props)
    {
        super(props)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.handleButtonRelease = this.handleButtonRelease.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
    }

    handleButtonRelease(e)
    {
        clearTimeout(this.buttonPressTimer)
        if (!this.ripple)
        {
            let target = this.container
            let rect = target.getBoundingClientRect()
            let ripple = document.createElement("span")
            ripple.className = "ripple"
            if (this.props.backgroundColor) ripple.style.backgroundColor = this.props.backgroundColor
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + "px"
            target.appendChild(ripple)
            let top = e.clientY - rect.top - ripple.offsetHeight / 2
            let left = e.clientX - rect.left - ripple.offsetWidth / 2
            ripple.style.top = top + "px"
            ripple.style.left = left + "px"
            setTimeout(() =>
            {
                try
                {
                    target.removeChild(ripple)
                }
                catch (e)
                {
                    console.log("material failed")
                }
            }, 600)
        }
        else
        {
            this.ripple.style.opacity = "0"
            setTimeout(() =>
            {
                if (this.ripple && this.container)
                {
                    try
                    {
                        this.container.removeChild(this.ripple)
                        this.ripple = null
                    }
                    catch (e)
                    {
                        console.log("Material Effect Failed!")
                    }
                }
            }, 500)
        }
    }

    onMouseDown(e)
    {
        let clientY = e.clientY
        let clientX = e.clientX
        this.buttonPressTimer = setTimeout(() =>
        {
            let target = this.container
            let rect = target.getBoundingClientRect()
            let ripple = document.createElement("span")
            ripple.className = "ripple"
            ripple.className = "rippleSlow"
            if (this.props.backgroundColor) ripple.style.backgroundColor = this.props.backgroundColor
            ripple.style.height = ripple.style.width = (1.3 * Math.max(rect.width, rect.height)) + "px"
            target.appendChild(ripple)
            this.ripple = ripple
            let top = clientY - rect.top - ripple.offsetHeight / 2
            let left = clientX - rect.left - ripple.offsetWidth / 2
            ripple.style.top = top + "px"
            ripple.style.left = left + "px"
        }, 300)
    }

    handleLeave()
    {
        clearTimeout(this.buttonPressTimer)
        if (this.ripple)
        {
            this.ripple.style.transform = "scale(0)"
            this.ripple.style.opacity = "0"
            setTimeout(() =>
            {
                if (this.ripple && this.container)
                {
                    try
                    {
                        this.container.removeChild(this.ripple)
                        this.ripple = null
                    }
                    catch (e)
                    {
                        console.log("Material Effect Failed!")
                    }
                }
            }, 500)
        }
    }

    render()
    {
        const {children, className, onClick} = this.props
        return (
            <div ref={e => this.container = e} className={className ? className + " material" : "material"} onMouseDown={this.onMouseDown} onMouseUp={this.handleButtonRelease} onMouseLeave={this.handleLeave} onClick={onClick}>
                {children}
            </div>
        )
    }
}

export default Material