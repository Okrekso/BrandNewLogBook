import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountStatistics.scss";
import { CSSTransition } from 'react-transition-group';

export default function AccountStatistics(props) {
    const [points, setpoints] = useState([89, 81, 77, 76, 77, 50, 80]);
    const [avgpoint, setavgpoint] = useState(0);
    const [maxpoint, setmaxpoint] = useState(0);
    const [visits, setvisits] = useState(85);

    useEffect(() => {
        if (!points)
            return;
        setavgpoint(Math.round(points.reduce((a, b) => a + b, 0) / points.length));
        setmaxpoint(Math.max.apply(null, points));
    }, [points]);
    return (
        <div id="account-statistics">
            <StatisticsBlock label="середній бал" value={avgpoint} maxvalue={100} />
            <StatisticsBlock label="максимальний бал" value={maxpoint} maxvalue={100} delay={100} />
            <StatisticsBlock label="відсоток відвідувань" value={visits} maxvalue={100} delay={200} dimension="%" />
        </div>
    )
}

function StatisticsBlock(props = { delay: 0 }) {
    const [animated, setanimated] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setanimated(true);
        }, props.delay);
    }, []);
    return (
        <CSSTransition classNames="flow-bottom" in={animated} timeout={1000}>
            <div style={{ visibility: !animated ? "hidden" : "visible" }} className="statistics-block">
                <p>{props.label}</p>
                <div className="value-holder">
                    <h4 style={{ color: props.valueColor }}>{props.value}</h4>
                    {
                        props.maxvalue &&
                        <h5 style={{ color: props.valueColor }}>/ {props.maxvalue}</h5>
                    }
                    {
                        props.dimension &&
                        <h5 style={{ color: props.valueColor }}>{props.dimension}</h5>
                    }
                </div>
            </div>
        </CSSTransition>
    )
}