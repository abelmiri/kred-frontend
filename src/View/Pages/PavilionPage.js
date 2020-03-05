import React, {PureComponent} from "react"
import {Switch} from "react-router-dom"
import api, {REST_URL} from "../../Functions/api"
import Mic from "../../Media/Images/PavilionMic.png"
import {ClipLoader} from "react-spinners"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import Material from "../Components/Material"

class PavilionPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            postsLoading: true,
            posts: {},
            error: false,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        api.get("conversation", `?limit=9&page=1&time=${new Date().toISOString()}`)
            .then((data) => this.setState({...this.state, postsLoading: false, posts: data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}))
            .catch(() => this.setState({...this.state, error: true, postsLoading: false}))

        document.addEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(posts).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, postsLoading: true}, () =>
                {
                    api.get("conversation", `?limit=9&page=${this.page}&time=${new Date().toISOString()}`, true).then((data) =>
                    {
                        this.setState({...this.state, postsLoading: false, posts: {...posts, ...data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}})
                        this.activeScrollHeight = scrollHeight
                        this.page += 1
                    })
                })
            }
        }, 20)
    }

    render()
    {
        const {posts, postsLoading} = this.state
        return (
            <Switch>
                {/*<Route path="/pavilion/:id" render={(route) => null}/>*/}

                <React.Fragment>
                    <div className='page-background-img pavilion'>
                        <div className='page-des-cont'>
                            <h2 className='exchange-desc pavilion'>گپ و گفت</h2>
                            <h3 className='exchange-text'>
                                اینجا هنوز متن لازم داره برای توضیح اینکه به چه دردی میخوره!
                                <br/>
                                ولی خب اینارو نوشتم که حوصلت سر نره!
                            </h3>
                        </div>
                        <img alt="Mic" src={Mic} className="pavilion-mic"/>
                    </div>

                    <div className="posts-list-con">
                        {
                            Object.values(posts).map((post) =>
                                <div className="post-con" key={post._id}>
                                    <div className="post-info-section">
                                        <div className="post-title">{post.title}</div>
                                        <div className="post-bold-description">{post.bold_description}</div>
                                        <div className="post-likes-comment-section">
                                            <Material className="post-like-count-cont">
                                                <div className={`post-like-count ${post.is_liked ? "liked" : ""}`}>{post.likes_count}</div>
                                                <LikeSvg className={`post-like-svg ${post.is_liked ? "liked" : ""}`}/>
                                            </Material>
                                            <Material className="post-like-count-cont">
                                                <div className="post-like-count">{post.comments_count}</div>
                                                <CommentSvg className="post-comment-svg"/>
                                            </Material>
                                        </div>
                                    </div>
                                    <img className="post-circle-image" src={REST_URL + "/" + post.picture} alt="user"/>
                                </div>,
                            )
                        }
                        <div className={`exchange-page-loading ${postsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default PavilionPage