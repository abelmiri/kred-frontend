import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import CopySvg from "../../Media/Svgs/CopySvg"
import {NotificationManager} from "react-notifications"
import copyToClipboard from "../../Helpers/copyToClipboard"
import Profile from "../../Media/Svgs/Profile"
import StickersMenu from "../Components/StickerMenu"

class PavilionItemPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            pavilion: null,
            notFound: false,
            error: false,
            commentsLoading: false,
            comments: {},
            sendLoading: false,
            focused: false,
        }
        this.page = 2
        this.activeScrollHeight = 0
    }

    componentDidMount()
    {
        window.scroll({top: 0})

        const {pavilionId, location} = this.props

        api.get(`conversation/${pavilionId}`, `?time=${new Date().toISOString()}`)
            .then((pavilion) =>
            {
                this.setState({...this.state, pavilion}, () =>
                {
                    if (pavilion.comments_count > 0)
                    {
                        this.setState({...this.state, commentsLoading: true}, () =>
                        {
                            api.get(`conversation/comments/${pavilionId}`, `?limit=5&page=1&time=${new Date().toISOString()}`)
                                .then((comments) => this.setState({...this.state, comments: comments.reduce((sum, comment) => ({...sum, [comment._id]: {...comment}}), {}), commentsLoading: false}))
                        })
                    }
                    setTimeout(() =>
                    {
                        if (location.includes("/comments")) window.scroll({top: this.comments.offsetTop - 100, behavior: "smooth"})
                    }, 450)
                })
            })
            .catch((e) => e?.response?.status === 404 ? this.setState({...this.state, notFound: true}) : this.setState({...this.state, error: true}))

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
            const {comments} = this.state
            const {pavilionId} = this.props
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(comments).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, commentsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get(`conversation/comments/${pavilionId}`, `?limit=5&page=${this.page}&time=${new Date().toISOString()}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, commentsLoading: false, comments: {...comments, ...data.reduce((sum, comment) => ({...sum, [comment._id]: {...comment}}), {})}})
                    })
                })
            }
        }, 20)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        window.onpopstate = () =>
        {
            if (document.body.clientWidth <= 480)
            {
                if (this.state.focused)
                {
                    document.body.style.overflow = "auto"
                    this.setState({...this.state, focused: false})
                }
            }
        }
    }

    likeAndDisLike = () =>
    {
        const {user} = this.props
        if (user)
        {
            const {pavilion} = this.state
            if (pavilion.is_liked)
            {
                api.del(`conversation/like/${pavilion._id}`)
                    .then(() => this.setState({...this.state, pavilion: {...pavilion, is_liked: false, likes_count: pavilion.likes_count - 1}}))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
            else
            {
                api.post("conversation/like", {conversation_id: pavilion._id})
                    .then(() => this.setState({...this.state, pavilion: {...pavilion, is_liked: true, likes_count: pavilion.likes_count + 1}}))
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

    copy = () => copyToClipboard(`https://www.kred.ir/pavilions/${this.state.pavilion._id}`, () => NotificationManager.success("لینک با موفقیت کپی شد"))

    sendComment = () =>
    {
        const {sendLoading, pavilion} = this.state
        if (!sendLoading)
        {
            const {user, pavilionId} = this.props
            if (user)
            {
                const description = this.description.value.trim()
                if (description.length > 1)
                {
                    this.setState({...this.state, sendLoading: true}, () =>
                    {
                        api.post("conversation/comment", {conversation_id: pavilionId, description})
                            .then(comment =>
                                this.setState({
                                    ...this.state,
                                    sendLoading: false,
                                    focused: false,
                                    comments: {[comment._id]: {...comment, user: {...user}}, ...this.state.comments},
                                    pavilion: {...pavilion, comments_count: pavilion.comments_count + 1},
                                }, () =>
                                {
                                    this.description.value = ""
                                    document.body.style.overflow = "auto"
                                    NotificationManager.success("نظر شما با موفقیت ثبت شد!")
                                }),
                            )
                            .catch(() => this.setState({...this.state, sendLoading: false}, () => NotificationManager.error("مشکلی پیش آمد، اینترنت خود را بررسی کنید!")))
                    })
                }
                else
                {
                    this.description.style.border = "1px solid red"
                    if (description.length === 1) NotificationManager.error("حداقل متن مورد قبول 2 کاراکتر است!")
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
    }

    focusOnComment = () =>
    {
        if (document.body.clientWidth <= 480 && !this.state.focused)
        {
            if (document.body.clientWidth <= 480) window.history.pushState("", "", `/pavilions/${this.props.pavilionId}/add-comment`)
            document.body.style.overflow = "hidden"
            this.setState({...this.state, focused: true})
        }
    }

    removeComment(id)
    {
        let result = window.confirm("از حذف نظر مطمئنید؟!")
        if (result)
        {
            api.del(`conversation/comment/${id}`)
                .then(() =>
                {
                    const {pavilion} = this.state
                    let comments = {...this.state.comments}
                    delete comments[id]
                    this.setState({...this.state, comments: {...comments}, pavilion: {...pavilion, comments_count: pavilion.comments_count - 1}}, () =>
                        NotificationManager.success("نظر شما با موفقیت حذف شد!"),
                    )
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد، اینترنت خود را بررسی کنید!"))
        }
    }

    onCommentChange = (e) =>
    {
        if (e.target.style.border === "1px solid red" && e.target.value.trim().length > 1) e.target.style.border = "1px solid white"
    }

    handleEmoji = (emoji) =>
    {
        if (document.selection)
        {
            this.description.focus()
            let sel = document.selection.createRange()
            sel.text = emoji
        }
        else if (this.description.selectionStart || this.description.selectionStart === 0)
        {
            this.description.focus()
            let startPos = this.description.selectionStart
            let endPos = this.description.selectionEnd
            this.description.value = this.description.value.substring(0, startPos) + emoji + this.description.value.substring(endPos, this.description.value.length)
            this.description.selectionStart = startPos + emoji.length
            this.description.selectionEnd = startPos + emoji.length
        }
        else this.description.value += emoji
    }

    render()
    {
        const {notFound, error, pavilion, comments, commentsLoading, sendLoading, focused} = this.state
        const {user} = this.props
        return (
            <div className="pavilion-item-page-cont">
                {
                    notFound ?
                        <div className="exchange-page-loading">مصاحبه مورد نظر یافت نشد!</div>
                        :
                        error ?
                            <div className="exchange-page-loading">سایت در گرفتن اطلاعات با مشکل مواجه شد!</div>
                            :
                            pavilion ?
                                <React.Fragment>
                                    <h1 className="pavilion-item-title">{pavilion.title}</h1>
                                    <img className="pavilion-item-pic" src={REST_URL + "/" + pavilion.picture} alt={pavilion.title}/>
                                    <div className="pavilion-item-bold-desc">{pavilion.bold_description}</div>
                                    <div className="pavilion-item-desc">{pavilion.description}</div>
                                    <div className="pavilion-item-footer">
                                        <Material className="post-like-count-cont like" onClick={this.likeAndDisLike}>
                                            <LikeSvg className={`post-like-svg ${pavilion.is_liked ? "liked" : ""}`}/>
                                            <div className={`pavilion-item-like ${pavilion.is_liked ? "liked" : ""}`}>{pavilion.likes_count} پسند</div>
                                        </Material>
                                        <Material className="post-like-count-cont copy" onClick={this.copy}>
                                            <CopySvg className="post-comment-svg"/>
                                            <div className="pavilion-item-like">کپی لینک</div>
                                        </Material>
                                        <Material className="post-like-count-cont comment">
                                            <CommentSvg className="post-comment-svg"/>
                                            <div className="pavilion-item-like">{pavilion.comments_count} دیدگاه</div>
                                        </Material>
                                    </div>
                                    <div className="pavilion-item-comments-section" ref={e => this.comments = e}>
                                        <div className="pavilion-comment-create-title">خوشحال میشیم نظرتو بدونیم!</div>
                                        <textarea ref={e => this.description = e} rows={4} onChange={this.onCommentChange} className={`pavilion-comment-create ${focused ? "focused" : ""}`} placeholder="نظرت رو بنویس..." onClick={this.focusOnComment}/>
                                        <div className="pavilion-comment-emoji-cont">
                                            <StickersMenu output={this.handleEmoji} modal={true}/>
                                        </div>
                                        {
                                            focused &&
                                            <div className="pavilion-comment-emoji-mobile">
                                                <Material onClick={() => this.handleEmoji("😂")}><span role='img' aria-label=''>😂</span></Material>
                                                <Material onClick={() => this.handleEmoji("❤")}><span role='img' aria-label=''>❤</span></Material>
                                                <Material onClick={() => this.handleEmoji("😊")}><span role='img' aria-label=''>😊</span></Material>
                                                <Material onClick={() => this.handleEmoji("😑")}><span role='img' aria-label=''>😑</span></Material>
                                                <Material onClick={() => this.handleEmoji("👌")}><span role='img' aria-label=''>👌</span></Material>
                                                <Material onClick={() => this.handleEmoji("😍")}><span role='img' aria-label=''>😍</span></Material>
                                                <Material onClick={() => this.handleEmoji("😐")}><span role='img' aria-label=''>😐</span></Material>
                                                <Material onClick={() => this.handleEmoji("🙌")}><span role='img' aria-label=''>🙌</span></Material>
                                            </div>
                                        }
                                        <div className="pavilion-comment-create-btn">
                                            <Material className={`pavilion-comment-create-material ${focused ? "focused" : ""}`} onClick={this.sendComment}>
                                                {sendLoading ? <ClipLoader size={15} color="white"/> : "ارسال نظر"}
                                            </Material>
                                        </div>
                                        <div className="pavilion-item-comments-title">نظرات کاربران</div>
                                        {
                                            Object.values(comments).map(comment =>
                                                <div key={comment._id} className="pavilion-comment">
                                                    <div className="pavilion-comment-header">
                                                        <div className="pavilion-comment-header-profile">
                                                            <Profile className="pavilion-comment-profile"/>
                                                            <div>
                                                                <div className="pavilion-comment-sender">{comment.user.name}</div>
                                                                {
                                                                    comment.user.university &&
                                                                    <div className="pavilion-comment-uni">دانشجوی {comment.user.university}</div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="pavilion-comment-date">{new Date(comment.created_date).toLocaleDateString("fa-ir")}</div>
                                                    </div>
                                                    <div className="pavilion-comment-desc">
                                                        {comment.description}
                                                    </div>
                                                    {
                                                        comment.user._id === user._id &&
                                                        <div className="pavilion-comment-create-btn">
                                                            <Material className="pavilion-comment-delete" onClick={() => this.removeComment(comment._id)}>حذف</Material>
                                                        </div>
                                                    }
                                                </div>,
                                            )
                                        }
                                        <div className={`exchange-page-loading ${commentsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                                    </div>
                                </React.Fragment>
                                :
                                <div className="exchange-page-loading"><ClipLoader size={24} color="#3AAFA9"/></div>
                }
            </div>
        )
    }
}

export default PavilionItemPage