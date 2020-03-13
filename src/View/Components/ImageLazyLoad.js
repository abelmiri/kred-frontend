import React, {PureComponent} from "react"
import axios from "axios"

class ImageLazyLoad extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loadingPercent: 0,
            picture: null,
        }
    }

    componentDidMount()
    {
        const {thumbnail, src} = this.props
        if (thumbnail)
        {
            axios.get(src, {
                responseType: "blob",
                onDownloadProgress: e => this.setState({...this.state, loadingPercent: Math.floor((e.loaded * 100) / e.total)}),
            })
                .then((res) => this.setState({...this.state, picture: URL.createObjectURL(res.data)}))
        }
    }

    render()
    {
        const {className, thumbnail, src, alt} = this.props
        const {picture, loadingPercent} = this.state
        return <img className={className} src={picture ? picture : thumbnail ? thumbnail : src} alt={alt} style={thumbnail ? {transition: "all linear 0.1s", filter: `Blur(${picture ? 0 : 100 / (loadingPercent > 0 ? loadingPercent : 1)}px)`} : {}}/>
    }
}

export default ImageLazyLoad