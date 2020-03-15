import React, {PureComponent} from "react"
import Profile from "../../Media/Svgs/Profile"
import Material from "./Material"
import ReplySvg from "../../Media/Svgs/ReplySvg"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import api, {REST_URL} from "../../Functions/api"
import {NotificationManager} from "react-notifications"
import {ClipLoader} from "react-spinners"

class Comment extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            reply: false,
            sendLoading: false,
            showReplies: false,
        }
    }

    likeAndDisLikeComment(comment)
    {
        const {user, setLikeComment, removeLikeComment} = this.props
        if (user)
        {
            if (comment.is_liked)
            {
                api.del(`conversation/comment/like/${comment._id}`)
                    .then(() => setLikeComment(comment))
                    .catch(() => NotificationManager.error("اینترنت خود را بررسی کنید!"))
            }
            else
            {
                api.post("conversation/comment/like", {comment_id: comment._id})
                    .then(() => removeLikeComment(comment))
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

    removeComment(id)
    {
        let result = window.confirm("از حذف نظر مطمئنید؟!")
        if (result)
        {
            api.del(`conversation/comment/${id}`)
                .then(() =>
                {
                    this.props.removeComment(id)
                    NotificationManager.success("نظر شما با موفقیت حذف شد!")
                })
                .catch(() => NotificationManager.error("مشکلی پیش آمد، اینترنت خود را بررسی کنید!"))
        }
    }

    showReplay = () =>
    {
        const reply = !this.state.reply
        this.setState({...this.state, reply}, () =>
        {
            if (reply && document.body.clientWidth > 480) this.description.focus()
        })
    }

    sendReply = () =>
    {
        const {sendLoading} = this.state
        if (!sendLoading)
        {
            const {user, parentId, comment, setComment, commentParentId} = this.props
            if (user)
            {
                const description = this.description.value.trim()
                if (description.length > 1)
                {
                    this.setState({...this.state, sendLoading: true}, () =>
                    {
                        api.post("conversation/comment", {conversation_id: parentId, description, parent_comment_id: commentParentId, reply_comment_id: comment._id})
                            .then(comment =>
                                this.setState({...this.state, sendLoading: false, reply: false}, () =>
                                {
                                    setComment(comment)
                                    NotificationManager.success("پاسخ شما با موفقیت ثبت شد!")
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

    onCommentChange = (e) =>
    {
        if (e.target.style.border === "1px solid red" && e.target.value.trim().length > 1) e.target.style.border = "1px solid #CDCDCD"
    }

    showReplies = () => this.setState({...this.state, showReplies: true})

    render()
    {
        const {reply, sendLoading, showReplies} = this.state
        const {comment, user, childs, parentId, setComment, removeComment, comments, replyComment, setLikeComment, removeLikeComment} = this.props
        return (
            <div className="pavilion-comment">
                <div className="pavilion-comment-header">
                    <div className="pavilion-comment-header-profile">
                        {
                            comment.user.avatar ?
                                <img className="pavilion-comment-profile" src={REST_URL + comment.user.avatar} alt={comment.user.name}/>
                                :
                                <Profile className="pavilion-comment-profile"/>
                        }
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
                    {replyComment && <span className="pavilion-comment-replied">@{replyComment.user.name} </span>}{comment.description}
                </div>
                <div className="pavilion-comment-like-cont">
                    {
                        comment.user._id === user._id &&
                        <Material className="pavilion-comment-delete" onClick={() => this.removeComment(comment._id)}>حذف</Material>
                    }
                    <Material className="pavilion-comment-reply" onClick={this.showReplay}>
                        <ReplySvg className="pavilion-comment-like-svg "/>
                    </Material>
                    <Material className="pavilion-comment-like mr-left" onClick={() => this.likeAndDisLikeComment(comment)}>
                        <div className={`pavilion-item-like mr-left ${comment.is_liked ? "liked" : ""}`}>{comment.likes_count}</div>
                        <LikeSvg className={`pavilion-comment-like-svg ${comment.is_liked ? "liked" : ""}`}/>
                    </Material>
                </div>
                {
                    reply &&
                    <React.Fragment>
                        <textarea onChange={this.onCommentChange} ref={e => this.description = e} rows={3} className="pavilion-comment-reply-area" placeholder="پاسخت رو بنویس..."/>
                        <div className="pavilion-comment-create-btn">
                            <Material className={`pavilion-comment-create-material reply`} onClick={this.sendReply}>
                                {sendLoading ? <ClipLoader size={15} color="white"/> : "ارسال"}
                            </Material>
                        </div>
                    </React.Fragment>
                }
                {
                    !comment.parent_comment_id && childs && childs.length > 0 ?
                        !showReplies ?
                            <Material className="pavilion-comment-show-replies" onClick={this.showReplies}>نمایش پاسخ‌ها ({childs.length})</Material>
                            :
                            <div className="pavilion-comment-child">
                                <div className="pavilion-comment-child-title">پاسخ‌ها ({childs.length})</div>
                                {
                                    childs.map(cm =>
                                        <Comment key={cm._id}
                                                 comment={cm}
                                                 user={user}
                                                 parentId={parentId}
                                                 setComment={setComment}
                                                 removeComment={removeComment}
                                                 commentParentId={comment._id}
                                                 replyComment={comments[cm.reply_comment_id]}
                                                 setLikeComment={setLikeComment}
                                                 removeLikeComment={removeLikeComment}
                                        />,
                                    )
                                }
                            </div>
                        :
                        null
                }
            </div>
        )
    }
}

export default Comment