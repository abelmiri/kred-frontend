import React from "react"
import LikeSvg from "../../Media/Svgs/LikeSvg"
import {Link} from "react-router-dom"

export function ClassResourcesItems(props)
{
    const {item, svg} = props
    return (
        <Link to={`resources/${item._id}`} key={item._id} className="class-handout-item">
            <div className="class-handout-item-detail">
                <LikeSvg className="class-handout-item-detail-like-svg"/>
                {item.likes_count}
            </div>
            <div className="class-handout-item-blur-container">
                {svg}
                <div className="class-handout-item-title-cont">
                    <div className="class-handout-item-title">
                        {item.title}
                    </div>
                    <div className="class-handout-item-description">
                        {item.university}{item.teacher && ` - ${item.teacher}`}
                    </div>
                    <div className="class-handout-item-description">
                        {item.pages_count} صفحه
                    </div>
                </div>
            </div>
        </Link>
    )
}
