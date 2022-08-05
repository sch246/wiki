import React from "react";

require.resolve('./main.css')
export default function Cover(props) {
    return (
        <cover title="你知道的太多了">
            {props.children}
        </cover>
    );
}