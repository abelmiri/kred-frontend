import React from "react"

const CommentSvg = (props) =>
    <svg className={props.className} viewBox="0 0 137 106">
        <path fill="none" strokeWidth="7px" strokeLinecap="round" strokeLinejoin="round"
              d="M149.5,199.5l8.16-8.16a9.7,9.7,0,0,1,6.86-2.84h40.27a9.71,9.71,0,0,0,9.71-9.71V110.21a9.71,9.71,0,0,0-9.71-9.71H149.5"
              transform="translate(-81 -97)"/>
        <path fill="none" strokeWidth="7px" strokeLinecap="round" strokeLinejoin="round" d="M126.5,188.5H94.21a9.71,9.71,0,0,1-9.71-9.71V110.21a9.71,9.71,0,0,1,9.71-9.71H149.5"
              transform="translate(-81 -97)"/>
        <line fill="none" strokeWidth="7px" strokeLinecap="round" strokeLinejoin="round" x1="68.5" y1="102.5" x2="57.5" y2="91.5"/>
        <circle strokeWidth="4px" strokeLinecap="round" strokeLinejoin="round" cx="69" cy="47" r="4"/>
        <circle strokeWidth="4px" strokeLinecap="round" strokeLinejoin="round" cx="44" cy="47" r="4"/>
        <circle strokeWidth="4px" strokeLinecap="round" strokeLinejoin="round" cx="94" cy="47" r="4"/>
    </svg>

export default CommentSvg