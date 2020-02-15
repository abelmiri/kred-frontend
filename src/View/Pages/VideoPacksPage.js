import React, {PureComponent} from "react"
import {ClipLoader} from "react-spinners"

class VideoPacksPage extends PureComponent
{
    componentDidMount()
    {
        this.props.getVideoPacks()
    }

    render()
    {
        const {videoPacks} = this.props
        return (
            <div className="video-packs-page-cont">
                {
                    Object.values(videoPacks).length > 0 ?
                        Object.values(videoPacks).map(pack =>
                            <div key={pack._id}>
                                {pack.title}
                            </div>,
                        )
                        :
                        <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                }
            </div>
        )
    }
}

export default VideoPacksPage