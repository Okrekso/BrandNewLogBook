import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./BlankButtonSlider.scss";
import {
    BrowserRouter as Router,
    Route, Link, useHistory
} from 'react-router-dom';

export default function BlankButtonsSlider(props) {
    const [links, setlinks] = useState(props.links);
    const history = useHistory();
    return (
        <div className="blank-slider" style={props.style}>
            {
                links.map((li, i) => <div className="element-holder">
                    <h4>{typeof (li) == "string" ? li : li.label}</h4>
                    <div onClick={() => history.push(typeof (li) == "string" ? li : li.url)} className="element"></div>
                </div>)
            }
        </div>
    )
}