import React, {PureComponent} from "react"
import api, {REST_URL} from "../../Functions/api"
import {Link} from "react-router-dom"
import SmoothArrowSvg from "../../Media/Svgs/SmoothArrowSvg"
import {ClipLoader} from "react-spinners"
import Material from "../Components/Material"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import CopySvg from "../../Media/Svgs/CopySvg"
import CommentSvg from "../../Media/Svgs/CommentSvg"
import copyToClipboard from "../../Helpers/copyToClipboard"
import {NotificationManager} from "react-notifications"
import StickersMenu from "../Components/StickerMenu"
import Comment from "../Components/Comment"
import Helmet from "react-helmet"
import SaveSvg from "../../Media/Svgs/SaveSvg"
import SavedSvg from "../../Media/Svgs/SavedSvg"

class ClassItemResourceFilePage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            fileLoading: true,
            error: false,
            file: {},
            commentsLoading: false,
            comments: {},
            sendLoading: false,
            focused: false,
        }
        this.sentView = false

        this.showPicture = false

        this.page = 2
        this.activeScrollHeight = 0
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {fileId} = this.props
        api.get(`education-resource`, fileId)
            .then((file) => this.setState({...this.state, fileLoading: false, file}, () =>
            {
                if (file.comments_count > 0)
                {
                    this.setState({...this.state, commentsLoading: true}, () =>
                        api.get(`education-resource/comments/${fileId}`, `?limit=5&page=1`)
                            .then((comments) => this.setState({...this.state, comments: comments.reduce((sum, comment) => ({...sum, [comment._id]: {...comment}}), {}), commentsLoading: false})),
                    )
                }

                if (!this.sentView)
                {
                    const {parent, item, parentId} = this.props
                    if (parent && parent.title && item && item.title)
                    {
                        this.sentView = true
                        // statistics
                        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${parent.title} | ${item.title} | ${file.title}`, content_id: file._id}).catch(err => console.log(err))
                    }
                    else if (!parentId && item && item.title)
                    {
                        this.sentView = true
                        // statistics
                        process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${item.title} | ${file.title} | منابع درسی`, content_id: file._id}).catch(err => console.log(err))
                    }
                }

            }))
            .catch((e) => this.setState({...this.state, error: e?.response?.status !== 404, fileLoading: false}))

        document.addEventListener("scroll", this.onScroll)
        window.addEventListener("popstate", this.onPopState)
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (!this.sentView)
        {
            const {parent, item, parentId} = this.props
            const {file} = this.state
            if (parent && parent.title && item && item.title && file && file.title)
            {
                this.sentView = true
                // statistics
                process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${parent.title} | ${item.title} | ${file.title}`, content_id: file._id}).catch(err => console.log(err))
            }
            else if (!parentId && item && item.title && file && file.title)
            {
                this.sentView = true
                // statistics
                process.env.NODE_ENV === "production" && api.post("view", {type: "page", content: `کلاس درس | ${item.title} | ${file.title} | منابع درسی`, content_id: file._id}).catch(err => console.log(err))
            }
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("popstate", this.onPopState)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {comments} = this.state
            const {fileId} = this.props
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (Object.values(comments).length > 0 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, commentsLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    api.get(`education-resource/comments/${fileId}`, `?limit=5&page=${this.page}`).then((data) =>
                    {
                        this.page += 1
                        this.setState({...this.state, commentsLoading: false, comments: {...comments, ...data.reduce((sum, comment) => ({...sum, [comment._id]: {...comment}}), {})}})
                    })
                })
            }
        }, 20)
    }

    onPopState = () =>
    {
        if (document.body.clientWidth <= 480)
        {
            if (this.state.focused)
            {
                document.body.style.overflow = "auto"
                this.setState({...this.state, focused: false})
            }
        }

        if (this.showPicture) this.closeImage()
    }

    sendComment = () =>
    {
        const {sendLoading, file} = this.state
        if (!sendLoading)
        {
            const {user, fileId} = this.props
            if (user)
            {
                const description = this.description.value.trim()
                if (description.length > 1)
                {
                    this.setState({...this.state, sendLoading: true}, () =>
                    {
                        api.post("education-resource/comment", {education_id: fileId, description})
                            .then(comment =>
                                this.setState({
                                    ...this.state,
                                    sendLoading: false,
                                    focused: false,
                                    comments: {[comment._id]: {...comment, user: {...user}}, ...this.state.comments},
                                    file: {...file, comments_count: file.comments_count + 1},
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
            const {parent, item, type} = this.props
            const {file} = this.state
            if (document.body.clientWidth <= 480)
            {
                window.history.pushState(
                    "",
                    "",
                    `/${parent && parent.title ? `class/${type}/${parent._id}/${item._id}/resources/${file._id}/add-comment` : `class/${type}/${item._id}/resources/${file._id}/add-comment`}`,
                )
            }
            document.body.style.overflow = "hidden"
            this.setState({...this.state, focused: true})
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

    setComment = (comment) =>
    {
        const {file} = this.state
        const {user} = this.props

        this.setState({
            ...this.state,
            comments: {...this.state.comments, [comment._id]: {...comment, user: {...user}}},
            file: {...file, comments_count: file.comments_count + 1},
        })
    }

    removeComment = (id) =>
    {
        const {file} = this.state
        let comments = {...this.state.comments}
        delete comments[id]
        this.setState({...this.state, comments: {...comments}, file: {...file, comments_count: file.comments_count - 1}})
    }

    setLikeComment = (comment) => this.setState({...this.state, comments: {...this.state.comments, [comment._id]: {...comment, is_liked: false, likes_count: comment.likes_count - 1}}})

    removeLikeComment = (comment) => this.setState({...this.state, comments: {...this.state.comments, [comment._id]: {...comment, is_liked: true, likes_count: comment.likes_count + 1}}})

    likeAndDisLike = () =>
    {
        const {user} = this.props
        if (user)
        {
            const {file} = this.state
            if (file.is_liked)
            {
                api.del(`education-resource/like/${file._id}`)
                    .then(() => this.setState({...this.state, file: {...file, is_liked: false, likes_count: file.likes_count - 1}}))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
            else
            {
                api.post("education-resource/like", {education_id: file._id})
                    .then(() => this.setState({...this.state, file: {...file, is_liked: true, likes_count: file.likes_count + 1}}))
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

    saveAndDisSave = () =>
    {
        const {user} = this.props
        if (user)
        {
            const {file} = this.state
            if (file.is_saved)
            {
                api.del(`education-resource/save/${file._id}`)
                    .then(() => this.setState({...this.state, file: {...file, is_saved: false}}))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
            else
            {
                api.post("education-resource/save", {education_id: file._id})
                    .then(() => this.setState({...this.state, file: {...file, is_saved: true}}))
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

    shareLink = () =>
    {
        if (navigator.share)
        {
            navigator.share({
                title: document.title,
                text: "این لینک رو در KRED ببین! \n",
                url: window.location.href,
            })
                .then(() => console.log("Successful share"))
                .catch(error =>
                {
                    console.log("Error sharing:", error)
                    this.copy()
                })
        }
        else this.copy()
    }

    copy()
    {
        copyToClipboard(window.location.href, () => NotificationManager.success("لینک با موفقیت کپی شد"))
    }

    download = () =>
    {
        const {file} = this.state
        // statistics
        process.env.NODE_ENV === "production" && api.post("view", {type: "click", content: `دانلود ${file.title}`, content_id: file._id}).catch(err => console.log(err))
    }

    openImage = () =>
    {
        this.showPicture = true
        document.body.style.overflow = "hidden"
        window.history.pushState("", "", `${window.location.href}/show-picture`)
        const copyImage = this.img.cloneNode(true)
        copyImage.id = "picture"
        const rect = this.img.getBoundingClientRect()
        copyImage.style.position = "fixed"
        copyImage.style.top = rect.top + "px"
        copyImage.style.height = rect.height + "px"
        copyImage.style.width = rect.width + "px"
        copyImage.style.left = rect.left + "px"
        copyImage.style.right = "auto"
        copyImage.style.zIndex = "4"
        document.body.append(copyImage)
        copyImage.style.transition = "all linear 0.2s"
        setTimeout(() =>
        {
            copyImage.style.top = "0px"
            copyImage.style.left = "0px"
            copyImage.style.height = window.innerHeight + "px"
            copyImage.style.width = document.body.clientWidth + "px"
        }, 50)
    }

    closeImage = () =>
    {
        this.showPicture = false
        document.body.style.overflow = "auto"
        const copyImage = document.getElementById("picture")
        const rect = this.img.getBoundingClientRect()
        copyImage.style.zIndex = "0"
        copyImage.style.top = rect.top + "px"
        copyImage.style.height = rect.height + "px"
        copyImage.style.width = rect.width + "px"
        copyImage.style.left = rect.left + "px"
        copyImage.style.right = "auto"
        setTimeout(() => copyImage.remove(), 300)
    }

    render()
    {
        const {fileLoading, error, file, focused, sendLoading, comments, commentsLoading} = this.state
        const {type, user, parent, item} = this.props
        return (
            <div className="class-resources-page-container">
                {
                    parent && parent.title && item && item.title && file && file.title ?
                        <Helmet>
                            <title>{parent.title}، {item.title}، {file.title} | KRED</title>
                            <meta property="og:title" content={`${parent.title}، ${item.title}، ${file.title} | KRED`}/>
                            <meta name="twitter:title" content={`${parent.title}، ${item.title}، ${file.title} | KRED`}/>
                            <meta name="description" content={`${parent.title}، ${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                            <meta property="og:description" content={`${parent.title}، ${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                            <meta name="twitter:description" content={`${parent.title}، ${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                        </Helmet>
                        :
                        item && item.title && file && file.title &&
                        <Helmet>
                            <title>کلاس درس، {item.title}، {file.title} | KRED</title>
                            <meta property="og:title" content={`کلاس درس، ${item.title}، ${file.title} | KRED`}/>
                            <meta name="twitter:title" content={`کلاس درس، ${item.title}، ${file.title} | KRED`}/>
                            <meta name="description" content={`${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                            <meta property="og:description" content={`${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                            <meta name="twitter:description" content={`${item.title}، ${file.title}، ${file.subject} | KRED`}/>
                        </Helmet>
                }
                <div className="class-location-container">
                    <Link to="/class" className="class-location-link">کلاس درس</Link>
                    <SmoothArrowSvg className="class-left-arrow"/>
                    {
                        parent && parent.title ?
                            <React.Fragment>
                                <Link to={`/class/${type}/${parent._id}`} className="class-location-link">{parent.title}</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                <Link to={`/class/${type}/${parent._id}/${item?._id}/resources`} className="class-location-link">{item?.title}</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                {file?.title}
                            </React.Fragment>
                            :
                            item &&
                            <React.Fragment>
                                <Link to={`/class/${type}/${item._id}`} className="class-location-link">{item.title}</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                <Link to={`/class/${type}/${item._id}/resources`} className="class-location-link">منابع درسی</Link>
                                <SmoothArrowSvg className="class-left-arrow"/>
                                {file?.title}
                            </React.Fragment>
                    }
                </div>
                {
                    file && file._id &&
                    <div className="class-file-page-cont">
                        <div className="class-file-page-header">
                            <div className="class-file-page-detail">
                                <div className="class-file-page-detail-title">{file.title}</div>
                                <div>{file.subject}</div>
                                <div>{file.university}{file.teacher && ` - ${file.teacher}`}</div>
                                <div>{file.pages_count} صفحه</div>
                                {file.writer && <div>{file.writer}</div>}
                                <div className="class-file-page-nav">
                                    <Material className="post-like-count-cont like" onClick={this.likeAndDisLike}>
                                        <LikeSvg className={`post-like-svg ${file.is_liked ? "liked" : ""}`}/>
                                        <div className={`pavilion-item-like ${file.is_liked ? "liked" : ""}`}>{file.likes_count} پسند</div>
                                    </Material>
                                    <Material className="post-like-count-cont copy file" onClick={this.shareLink}>
                                        <CopySvg className="post-comment-svg"/>
                                        <div className="pavilion-item-like">
                                            <span className="only-desktop">کپی لینک</span>
                                            <span className="only-mobile">اشتراک گذری</span>
                                        </div>
                                    </Material>
                                    <Material className="post-like-count-cont comment">
                                        <CommentSvg className="post-comment-svg"/>
                                        <div className="pavilion-item-like">{file.comments_count} دیدگاه</div>
                                    </Material>
                                    <Material className="post-like-count-cont save" onClick={this.saveAndDisSave}>
                                        {
                                            file.is_saved ?
                                                <SavedSvg className="post-comment-svg save"/>
                                                :
                                                <SaveSvg className="post-comment-svg save"/>
                                        }
                                        <div className="pavilion-item-like">ذخیره</div>
                                    </Material>
                                </div>
                            </div>
                            <div className="class-file-page-download">
                                <Material className="class-file-page-pic-material" onClick={this.openImage}>
                                    <img className="class-file-page-pic" src={REST_URL + file.picture} alt={file.title} ref={e => this.img = e}/>
                                </Material>
                                <a target="_blank" rel="noopener noreferrer" href={REST_URL + file.file} onClick={this.download}>
                                    <Material className="class-file-page-download-btn">دانلود</Material>
                                </a>
                            </div>
                        </div>

                        <div className="pavilion-item-comments-section file">
                            <div className="pavilion-comment-create-title">خوشحال میشیم نظرتو بدونیم!</div>
                            <textarea ref={e => this.description = e} rows={4} onChange={this.onCommentChange} className={`pavilion-comment-create ${focused ? "focused" : ""}`} placeholder="نظرت رو بنویس..." onClick={this.focusOnComment}/>
                            <div className="pavilion-comment-emoji-cont">
                                <StickersMenu output={this.handleEmoji} modal={true}/>
                            </div>
                            {
                                focused &&
                                <div className="pavilion-comment-emoji-mobile">
                                    <Material onClick={() => this.handleEmoji("😂")}><span role="img" aria-label="">😂</span></Material>
                                    <Material onClick={() => this.handleEmoji("❤")}><span role="img" aria-label="">❤</span></Material>
                                    <Material onClick={() => this.handleEmoji("😊")}><span role="img" aria-label="">😊</span></Material>
                                    <Material onClick={() => this.handleEmoji("😑")}><span role="img" aria-label="">😑</span></Material>
                                    <Material onClick={() => this.handleEmoji("👌")}><span role="img" aria-label="">👌</span></Material>
                                    <Material onClick={() => this.handleEmoji("😍")}><span role="img" aria-label="">😍</span></Material>
                                    <Material onClick={() => this.handleEmoji("😐")}><span role="img" aria-label="">😐</span></Material>
                                    <Material onClick={() => this.handleEmoji("🙌")}><span role="img" aria-label="">🙌</span></Material>
                                </div>
                            }
                            <div className="pavilion-comment-create-btn">
                                <Material className={`pavilion-comment-create-material ${focused ? "focused" : ""}`} onClick={this.sendComment}>
                                    {sendLoading ? <ClipLoader size={15} color="white"/> : "ارسال نظر"}
                                </Material>
                            </div>
                            <div className="pavilion-item-comments-title">نظرات کاربران</div>
                            {
                                Object.values(comments).filter(comment => !comment.parent_comment_id).length > 0 ?
                                    Object.values(comments).filter(comment => !comment.parent_comment_id).map(comment =>
                                        <Comment key={comment._id}
                                                 education={true}
                                                 comment={comment}
                                                 user={user}
                                                 parentId={file._id}
                                                 setComment={this.setComment}
                                                 removeComment={this.removeComment}
                                                 childs={Object.values(comments).filter(cm => cm.parent_comment_id === comment._id)}
                                                 commentParentId={comment._id}
                                                 replyComment={comments[comment.reply_comment_id]}
                                                 comments={comments}
                                                 setLikeComment={this.setLikeComment}
                                                 removeLikeComment={this.removeLikeComment}
                                        />,
                                    )
                                    :
                                    file.comments_count === 0 && <div className="pavilion-comment-not-found">نظری وجود ندارد!</div>
                            }
                            <div className={`exchange-page-loading ${commentsLoading ? "" : "hide"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                        </div>
                    </div>
                }
                <div className={`exchange-page-loading error-text ${error ? "" : "none"}`}>مشکل در دریافت اطلاعات!</div>
                <div className={`exchange-page-loading ${fileLoading ? "" : "none"}`}><ClipLoader size={24} color="#3AAFA9"/></div>
                <div className={`exchange-page-loading error-text ${!fileLoading && !file._id && !error ? "" : "none"}`}>متأسفانه محتوایی برای نمایش پیدا نشد</div>
            </div>
        )
    }
}

export default ClassItemResourceFilePage