import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountStatistics.scss";

export default function AccountStatistics(props) {
    const [points, setpoints] = useState([89, 81, 77, 76, 77, 50, 80]);
    const [avgpoint, setavgpoint] = useState(Math.round(points.reduce((a, b) => a + b, 0) / points.length));
    const [visits, setvisits] = useState([]);

    useEffect(() => {
        setavgpoint(Math.round(points.reduce((a, b) => a + b, 0) / points.length));
    }, [points]);
    return (
        <div id="account-statistics">
            <div className="statistics-block">
                <p>Середній бал</p>
                <h4>{avgpoint}</h4>
            </div>
        </div>
    )
}