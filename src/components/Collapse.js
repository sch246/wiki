import React from "react";

export default function Collapse(props) {
    const [isCollapsed, setIsCollapsed] = React.useState(props.collapsed);

    const style = {
        collapsed: {
            display: "none"
        },
        expanded: {
            display: "block"
        },
        buttonStyle: {
            display: 'inline',
            width: '100%',
            color: '#393a34',
            'background-color':'#e6f6e6',
            /* 边框样式、颜色、宽度 */
            'border': '1px solid darkseagreen',
            'border-radius': '3px',
            'font-size': 'medium',
        }
    };

    return (
        <div>
            <button
                className="collapse-button"
                // style={style.buttonStyle}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {props.text}
                {isCollapsed ? "..." : ""}
            </button>
            <div
                className="collapse-content"
                // 决定显示和折叠
                style={isCollapsed ? style.collapsed : style.expanded}
                // aria-expanded 是给 Screen Reader 用来 判断当前元素状态的辅助属性
                aria-expanded={isCollapsed}
            >
                {props.children}
            </div>
        </div>
    );
}