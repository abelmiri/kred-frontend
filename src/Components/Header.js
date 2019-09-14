import React, {Component} from "react"
import Logo from "../Media/Images/Logo.png"
import {Link} from "react-router-dom"

const primaryColor = "#3AAFA9"

class Header extends Component
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
        return (
            <div style={isTransparent ? {backgroundColor: "transparent", borderBottom: `1px solid transparent`} : {backgroundColor: "white", borderBottom: `1px solid ${primaryColor}`}} className='header-container'>
                <div className='header-buttons'>
                    <div className='header-buttons-title'>ورود</div>
                    <div className='header-buttons-title'>ثبت نام</div>
                    <div className='header-buttons-title'>ارتباط با کرد</div>
                    <div className='header-buttons-title'>درباره ما</div>
                </div>
                <div className='header-logo-cont'>
                    <h1 style={{opacity: isTransparent ? 0 : 1}} className='header-logo-cont-title'>KRED</h1>
                    <Link to="/" className='header-logo-cont'>
                        <img src={Logo} className='header-logo' alt='kred logo'/>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Header