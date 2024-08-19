import React from "react";

const IBox = (props) => {
    return(
        <div>
            <input type={props.a} required />
            <label>{props.l}</label>
        </div>
    );
}

export default IBox;