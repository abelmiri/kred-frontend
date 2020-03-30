import React, {PureComponent} from "react"
import {Link, Route, Switch} from "react-router-dom"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import PavilionItemPage from "./PavilionItemPage"
import {NotificationManager} from "react-notifications"
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

        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: "گپ و گفت"}).catch(err => console.log(err))

        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
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
                    this.activeScrollHeight = scrollHeight
                    api.get("conversation", `?limit=9&page=${this.page}&time=${new Date().toISOString()}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, postsLoading: false, posts: {...posts, ...data.reduce((sum, post) => ({...sum, [post._id]: {...post}}), {})}})
                    })
                })
            }
        }, 20)
    }

    likeAndDisLike(pavilion)
    {
        const {user} = this.props
        if (user)
        {
            if (pavilion.is_liked)
            {
                api.del(`conversation/like/${pavilion._id}`)
                    .then(() => this.setState({...this.state, posts: {...this.state.posts, [pavilion._id]: {...pavilion, is_liked: false, likes_count: pavilion.likes_count - 1}}}))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
            else
            {
                api.post("conversation/like", {conversation_id: pavilion._id})
                    .then(() => this.setState({...this.state, posts: {...this.state.posts, [pavilion._id]: {...pavilion, is_liked: true, likes_count: pavilion.likes_count + 1}}}))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
        }
        else
        {
            if (document.getElementById("header-login"))
            {
                NotificationManager.error("لطفا ابتدا در سایت ثبت نام و یا وارد شوید.")
                document.getElementById("header-login").click()
            }
        }
    }

    setPavilionUpdate = (pavilion) =>
    {
        if (this.state.posts[pavilion._id])
            this.setState({...this.state, posts: {...this.state.posts, [pavilion._id]: {...pavilion}}})
    }

    render()
    {
        const {posts, postsLoading} = this.state
        const {user} = this.props
        return (
            <Switch>
                <Route path="/pavilions/:id" render={route =>
                    <PavilionItemPage pavilion={posts[route.match.params.id]}
                                      setPavilionUpdate={this.setPavilionUpdate}
                                      pavilionId={route.match.params.id}
                                      location={route.location.pathname}
                                      user={user}
                    />
                }/>

                <React.Fragment>
                    <div className='page-background-img pavilion'>
                        <div className='page-des-cont'>
                            <h2 className='exchange-desc pavilion'>گپ و گفت</h2>
                            <h3 className='exchange-text'>
                                دوست داری بدونی پزشک های موفق توی دوران دانشجویی شون چیکار ها میکردن؟
                                <br/>
                                یا این که از تجربیات دانشجوهای موفق استفاده کنی؟
                                {/*<br/>*/}
                                {/*توی گپ و گفت میتونی جواب سوال هات رو پیدا کنی*/}
                            </h3>
                        </div>
                    </div>

                    <div className="posts-list-con">
                        {
                            Object.values(posts).map((post) =>
                                <div className="post-con" key={post._id}>
                                    <div className="post-info-section">
                                        <Link to={`/pavilions/${post._id}`}>
                                            <div className="post-title">{post.title}</div>
                                            <div className="post-name">{post.interviewee_name} "{post.interviewee_bio}"</div>
                                        </Link>
                                        <Link to={`/pavilions/${post._id}`} className="post-bold-description">{post.bold_description}</Link>
                                        <div className="post-likes-comment-section">
                                            <Material className="post-like-count-cont" onClick={() => this.likeAndDisLike(post)}>
                                                <div className={`post-like-count ${post.is_liked ? "liked" : ""}`}>{post.likes_count}</div>
                                                <LikeSvg className={`post-like-svg ${post.is_liked ? "liked" : ""}`}/>
                                            </Material>
                                            <Link to={`/pavilions/${post._id}/comments`} className="post-like-count-cont">
                                                <div className="post-like-count">{post.comments_count}</div>
                                                <CommentSvg className="post-comment-svg"/>
                                            </Link>
                                        </div>
                                    </div>
                                    <Link to={`/pavilions/${post._id}`} className="post-circle-image-link">
                                        <img className="post-circle-image" src={REST_URL + "/" + post.picture} alt={post.title}/>
                                    </Link>
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