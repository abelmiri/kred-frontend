import React, {PureComponent} from "react"
import Material from "./Material"
import StickerSvg from "../../Media/Svgs/StickerSvg"

class StickersMenu extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            open: false,
            first: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😊", "😋", "😎", "😍", "😘", "😶", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "😮", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😜", "😛", "😌", "😴", "😫", "😯", "😪", "😱", "🤐", "😝", "🤤", "😒", "😓", "😔", "😈", "👿", "👹"],
            second: ["👍🏼", "👎🏼", "🙏🏼", "👌🏼", "👋🏼", "💪🏼", "🤘🏼", "🖖🏼", "🤞🏼", "👆🏼", "👇🏼", "👈🏼", "👉🏼", "🖐🏼", "👏🏼", "🙌🏼"],
            third: ["🎈", "🎁", "🎀", "🎄", "🎉", "🎊", "🎃", "🔑", "🔒", "💣", "📱", "💻", "🖥", "🖨", "⌨", "🖱", "💿", "💾", "✏", "🖋", "🖊", "🎥", "🎬", "✉", "💼", "🗓", "📎", "⏳", "⏰", "📂", "📌", "🗑"],
            forth: ["🧡", "💛", "💙", "💚", "💜", "🖤", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🔞", "🚭", "🔕", "🔇", "🚫", "❌", "🚷", "🚯", "🚳", "💦", "💯"],
            tab: "first",
        }
    }

    componentDidMount()
    {
        document.addEventListener("mousedown", this.handleMouseDown)
    }

    componentWillUnmount()
    {
        document.removeEventListener("mousedown", this.handleMouseDown)
    }

    handleMouseDown = (e) =>
    {
        if (this.state.open && this.menu && !this.menu.contains(e.target)) this.setState({...this.state, open: false})
    }

    handleOpen = () => this.setState({...this.state, open: !this.state.open})

    handleTab(tab)
    {
        this.setState({...this.state, tab})
    }

    render()
    {
        const {output} = this.props
        const {open, tab} = this.state
        return (
            <div ref={e => this.menu = e} className="stickers-container">
                <div className="emoji-inline-block" onClick={this.handleOpen}><StickerSvg className="emoji-logo"/></div>
                <div className={`stickers-menu-container ${open ? "" : "close"}`}>
                    <div className="stickers-menu-scroll">
                        {
                            this.state[tab] && this.state[tab].map((emoji, i) =>
                                <div key={i} onClick={() => output(emoji)} style={{width: "30px", display: "inline-block", overflow: "hidden", color: "black"}}>{emoji}</div>,
                            )
                        }
                    </div>
                    <div className="stickers-menu-tabs">
                        <Material className={`stickers-menu-tab ${tab === "first" ? "select" : ""}`} onClick={() => this.handleTab("first")}><span role="img" aria-label="">😀</span></Material>
                        <Material className={`stickers-menu-tab ${tab === "second" ? "select" : ""}`} onClick={() => this.handleTab("second")}><span role="img" aria-label="">👍🏼</span></Material>
                        <Material className={`stickers-menu-tab ${tab === "third" ? "select" : ""}`} onClick={() => this.handleTab("third")}><span role="img" aria-label="">🎈</span></Material>
                        <Material className={`stickers-menu-tab ${tab === "forth" ? "select" : ""}`} onClick={() => this.handleTab("forth")}><span role="img" aria-label="">❤</span></Material>
                    </div>
                </div>
            </div>
        )
    }
}

export default StickersMenu