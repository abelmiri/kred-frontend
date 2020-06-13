import React, {PureComponent} from "react"
import RightArrow from "../../Media/Svgs/SmoothArrowSvg"
import Material from "./Material"

class MySlider extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            showIndex: 0,
        }
        this.deltaX = 0
        this.posX = 0
        this.prevX = 0
        this.deltaY = 0
        this.posY = 0
        this.changing = false
    }

    componentDidMount()
    {
        if (this.props.timer !== false)
        {
            this.interval = setInterval(() =>
            {
                const {showIndex} = this.state
                const {nodes} = this.props
                if (showIndex + 1 < nodes.length) this.setIndex(showIndex + 1)
                else this.setIndex(0)
            }, 8000)
        }
    }

    componentWillUnmount()
    {
        if (this.props.timer !== false) clearInterval(this.interval)
    }

    dragMouseDown = (e) =>
    {
        e.preventDefault()
        this.posX = e.clientX
        this.slider.onmouseup = this.closeDragElement
        this.slider.onmouseleave = this.closeDragElement
        this.slider.onmousemove = this.elementDrag
    }

    elementDrag = (e) =>
    {
        e.preventDefault()
        const {lang} = this.props
        if (!lang || lang === "fa") this.deltaX = this.posX - e.clientX
        else this.deltaX = e.clientX - this.posX
        this.posX = e.clientX
        this.prevX = this.prevX - this.deltaX > 0 && this.prevX - this.deltaX <= this.slider.scrollWidth - this.slider.clientWidth ? this.prevX - this.deltaX : this.prevX
        this.slider.style.transform = `translateX(${!lang || lang === "fa" ? this.prevX : -this.prevX}px)`
    }

    onTouchStart = (e) =>
    {
        this.posX = e.touches[0].clientX
        this.posY = e.touches[0].clientY
        this.slider.ontouchmove = this.onTouchMove
        this.slider.ontouchend = this.closeDragElement
    }

    onTouchMove = (e) =>
    {
        const {lang} = this.props
        if (!lang || lang === "fa")
        {
            this.deltaX = this.posX - e.touches[0].clientX
            this.deltaY = this.posY - e.touches[0].clientY
        }
        else
        {
            this.deltaX = e.touches[0].clientX - this.posX
            this.deltaY = e.touches[0].clientY - this.posY
        }
        if (this.changing || (this.deltaY < 5 && this.deltaY > -5))
        {
            this.posX = e.touches[0].clientX
            this.prevX = this.prevX - this.deltaX > 0 && this.prevX - this.deltaX <= this.slider.scrollWidth - this.slider.clientWidth ? this.prevX - this.deltaX : this.prevX
            this.slider.style.transform = `translateX(${!lang || lang === "fa" ? this.prevX : -this.prevX}px)`
            this.changing = true
        }
    }

    closeDragElement = () =>
    {
        const {lang} = this.props
        if (!(this.deltaX > 3) && (this.deltaX < -3 || this.prevX % this.slider.clientWidth > this.slider.clientWidth / 2))
        {
            if (this.prevX - this.deltaX > 0 && this.prevX - this.deltaX <= this.slider.scrollWidth - this.slider.clientWidth)
                this.prevX = parseInt(this.prevX / this.slider.clientWidth + 1) * this.slider.clientWidth
        }
        else this.prevX = this.prevX - this.prevX % this.slider.clientWidth
        this.slider.style.transition = "transform ease-in-out 0.2s"
        this.slider.style.transform = `translateX(${!lang || lang === "fa" ? this.prevX : -this.prevX}px)`
        this.slider.onmouseup = null
        this.slider.onmouseleave = null
        this.slider.onmousemove = null
        this.changing = false
        this.setState({...this.state, showIndex: parseInt(this.prevX / this.slider.clientWidth)}, () =>
        {
            if (this.props.timer !== false)
            {
                clearInterval(this.interval)
                this.interval = setInterval(() =>
                {
                    const {showIndex} = this.state
                    const {nodes} = this.props
                    if (showIndex + 1 < nodes.length) this.setIndex(showIndex + 1)
                    else this.setIndex(0)
                }, 20000)
            }
        })
        setTimeout(() =>
        {
            if (this.slider) this.slider.style.transition = "initial"
        }, 350)
    }

    setIndex(index)
    {
        this.setState({...this.state, showIndex: index}, () =>
        {
            if (this.props.timer !== false)
            {
                clearInterval(this.interval)
                this.interval = setInterval(() =>
                {
                    const {showIndex} = this.state
                    const {nodes} = this.props
                    if (showIndex + 1 < nodes.length) this.setIndex(showIndex + 1)
                    else this.setIndex(0)
                }, 20000)
            }
            const {lang} = this.props
            this.prevX = index * this.slider.clientWidth
            this.slider.style.transition = "transform ease-in-out 0.2s"
            this.slider.style.transform = `translateX(${!lang || lang === "fa" ? this.prevX : -this.prevX}px)`
            setTimeout(() =>
            {
                if (this.slider) this.slider.style.transition = "initial"
            }, 350)
        })
    }

    onLinkClick = (e) =>
    {
        if (this.linkTimer)
        {
            e.preventDefault()
            this.linkTimer = false
        }
    }

    onLinkDown = () => this.linkTime = setTimeout(() => this.linkTimer = true, 100)

    onLinkUp = () => clearTimeout(this.linkTime)

    render()
    {
        const {className, nodes, dots, marginDots, arrows, marginArrows, dotSelectedColor, dotColor, lang} = this.props
        const {showIndex} = this.state
        return (
            <div className={`my-slider-component ${className}`}>
                {
                    arrows &&
                    <React.Fragment>
                        <Material className={`my-slider-arrow ${!lang || lang === "fa" ? "right" : "left"}`} style={marginArrows ? {margin: marginArrows} : {}} onClick={() => showIndex - 1 >= 0 && this.setIndex(showIndex - 1)}>
                            <RightArrow/>
                        </Material>
                        <Material className={`my-slider-arrow ${!lang || lang === "fa" ? "left" : "right"}`} style={marginArrows ? {margin: marginArrows} : {}} onClick={() => showIndex + 1 < nodes.length && this.setIndex(showIndex + 1)}>
                            <RightArrow/>
                        </Material>
                    </React.Fragment>
                }

                <div className="my-slider-container">

                    <div ref={e => this.slider = e} className="my-slider-scroll" onMouseDown={this.dragMouseDown} onTouchStart={this.onTouchStart}>
                        {
                            nodes.map((node, index) =>
                                <div className="my-slider-node" key={showIndex === index ? "show" + index : "slider" + index} onMouseDown={this.onLinkDown} onMouseUp={this.onLinkUp} onClick={this.onLinkClick}>
                                    {node}
                                </div>,
                            )
                        }
                    </div>

                    {
                        dots &&
                        <div className="my-slider-dots" style={marginDots ? {margin: marginDots} : {}}>{
                            nodes.map((_, index) =>
                                <div key={"dot-slider" + index}
                                     className={`my-slider-dot ${showIndex === index ? "colored_dot" : ""}`}
                                     style={showIndex === index && dotSelectedColor ? {backgroundColor: dotSelectedColor} : dotColor ? {backgroundColor: dotColor} : {}}
                                     onClick={() => this.setIndex(index)}
                                />,
                            )}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default MySlider

// written by #Hoseyn