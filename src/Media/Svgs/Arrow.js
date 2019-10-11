import React from "react"

const Arrow = (props) =>
    <svg viewBox="0 0 256 256" className={props.className} onClick={props.onClick}>
        <g>
            <polygon points="128,48.907 0,176.907 30.187,207.093 128,109.28 225.813,207.093 256,176.907"/>
        </g>
    </svg>
export default Arrow