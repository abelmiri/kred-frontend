import React from "react"

export function ClassResourcesItems(props)
{
    const {item, svg} = props
    return <div key={item._id} className="class-handout-item">
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
}
