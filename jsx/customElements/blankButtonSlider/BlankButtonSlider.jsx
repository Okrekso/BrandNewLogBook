import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./BlankButtonSlider.scss";
import {
    BrowserRouter as Router,
    Route, Link, useHistory, useLocation
} from 'react-router-dom';

export default function BlankButtonsSlider(props) {
    const [links, setlinks] = useState(props.links);
    const history = useHistory();
    const location = useLocation();
    return (
        <div className="blank-slider" style={props.style}>
            {
                links.map((li, i) => <div className={`element-holder ${location.pathname == (typeof (li) == "string" ? li : li.url) ? "current" : ""}`}
                    onClick={() => history.push(typeof (li) == "string" ? li : li.url)}>
                    <h4>{typeof (li) == "string" ? li : li.label}</h4>
                    <div className={`element`}></div>
                </div>)
            }
        </div>
    )
}