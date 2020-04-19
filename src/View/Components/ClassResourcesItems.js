import React from "react"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import {Link} from "react-router-dom"
import CommentSvg from "../../Media/Svgs/CommentSvg"

export function ClassResourcesItems(props)
{
    const {item, svg, type, isSaveView, link} = props
    return (
        <Link to={link ? link : `resources/${item._id}`} className={`class-handout-item ${isSaveView ? "save" : ""}`}>
            {svg}
            <div className="class-handout-item-title-cont">
                <div className="class-handout-item-title">
                    {item.title}
                </div>
                <div className="class-handout-item-description">
                    {item.university}{item.teacher && ` - ${item.teacher}`}
                </div>
                <div className="class-handout-item-description">
                    {type === "question" ? `${item.pages_count} صفحه` : item.subject}
                </div>
                <div className="class-handout-item-like">
                    <LikeSvg className="class-handout-item-detail-like-svg"/>
                    {item.likes_count}
                </div>
                <div className="class-handout-item-comment">
                    {item.comments_count}
                    <CommentSvg className="class-handout-item-detail-comment-svg"/>
                </div>
            </div>
        </Link>
    )
}
