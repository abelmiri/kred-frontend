import React, {PureComponent} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"
// import Hamburger from "../Media/Svgs/Hamburger"
// import Material from "./Material"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {isTransparent: true}
        this.onScroll = this.onScroll.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("scroll", this.onScroll)
    }

    onScroll()
    {
        const {isTransparent} = this.state
        if (window.scrollY >= window.innerHeight - 50)
        {
            if (isTransparent) this.setState({...this.state, isTransparent: false})
        }
        else
        {
            if (!isTransparent) this.setState({...this.state, isTransparent: true})
        }
    }

    render()
    {
        const {isTransparent} = this.state
        const {location} = this.props
        return (
            <div className={`header-container-base ${isTransparent && location === "/" ? "hidden" : "visible"}`}>
                <div className='header-buttons'>
                    {/*{*/}
                    {/*    location === "/exchange" &&*/}
                    {/*    <Material backgroundColor='rgba(255,255,255,0.3)' className='header-buttons-menu'>*/}
                    {/*        <Hamburger className='header-buttons-hamburger'/>*/}
                    {/*        <span>تبادل کتاب</span>*/}
                    {/*    </Material>*/}
                    {/*}*/}
                    <div className='header-buttons-title'>ورود</div>
                    <div className='header-buttons-title'>ثبت نام</div>
                    <div className='header-buttons-title'>ارتباط با کرد</div>
                    <div className='header-buttons-title'>درباره ما</div>
                </div>
                <div className='header-logo-cont'>
                    <h1 style={{opacity: isTransparent && location === "/" ? 0 : 1}} className='header-logo-cont-title'>K<span>RED</span></h1>
                    <Link to="/" className='header-logo-cont'>
                        <img src={Logo} className='header-logo' alt='kred logo'/>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Header