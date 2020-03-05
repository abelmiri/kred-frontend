import React, {PureComponent} from "react"
import {Switch} from "react-router-dom"
import api from "../../Functions/api"
import Mic from "../../Media/Images/PavilionMic.png"


class PavilionPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            postsLoading: true,
            posts: [],
            error: false,
        }
        this.activeScrollHeight = 0
        this.page = 2
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        api.get("conversation", "?limit=9&page=1", true)
            .then((data) =>
                this.setState({...this.state, postsLoading: false}, () =>
                {
                    console.log(data)
                    this.setState({
                        ...this.state,
                        posts: data,
                    })
                }),
            )
            .catch(() => this.setState({...this.state, error: true}))
        document.addEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {posts} = this.state
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (posts.length % 9 === 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, exchangesLoading: true}, () =>
                {
                    api.get("conversation", `?limit=9&page=${this.page}`, true).then((data) =>
                    {
                        this.setState({...this.state, posts: posts.concat(data)})
                        this.activeScrollHeight = scrollHeight
                        this.page += 1
                    })
                })
            }
        }, 20)
    }


    render()
    {
        const {posts} = this.state
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
                            posts.map((post) => <div className="post-con" key={post._id}>
                                    <div className="post-info-section">
                                        <div className="post-title">{post.title}</div>
                                        <div className="post-bold-description">{post.bold_description}</div>
                                        <div className="post-likes-comment-section">{post.likes_count} آیکون لایک {post.comments_count} آیکون کامنت</div>
                                    </div>
                                    <div className="post-image-section">
                                        <img className="post-circle-image" src={api.REST_URL + "/" + post.picture} alt="user"/>
                                    </div>
                                </div>,
                            )
                        }
                    </div>
                </React.Fragment>
            </Switch>
        )
    }
}

export default PavilionPage