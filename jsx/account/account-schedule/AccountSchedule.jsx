import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountSchedule.scss";
import moment from "moment";
moment.locale("uk");

export default function AccountSchedule(props) {
    const [startDate, setstartDate] = useState(moment(new Date()));
    const [endDate, setendDate] = useState(moment(new Date()).add(7, "d"));
    const [intervals, setintervals] = useState(() => {
        let intervals = [];
        for (let i = 0; i < Math.abs(moment(startDate).startOf("d").diff(moment(endDate).startOf("d"), "d")); i++) {
            intervals.push(moment(startDate).clone().add(i, "d"));
        }
        return intervals;
    });

    const [timeIntervals, setTimeIntervals] = useState(() => {
        let intervals = [];
        for (let i = 0; i < 24; i++) {
            intervals.push(moment(startDate).clone().startOf("d").add(i, "h"));
        }
        return intervals;
    });
    return (
        <div id="account-schedule">
            <div id="schedule-bottom">
                <div id="times">
                    {
                        timeIntervals.map(int=><h2>{int.format("HH:mm")}</h2>)
                    }
                </div>
                <div id="days">
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                    <Day date={new Date()}></Day>
                </div>
            </div>
        </div>
    )
}

function Day(props) {
    const [intervals, setintervals] = useState(() => {
        let intervals = [];
        const now = moment(props.date).startOf("D");
        for (let inter = 0; inter < 24; inter++) {
            intervals.push(now.clone().add(inter, "h"));
        }
        return intervals;
    });

    return (
        <div className="schedule-day">
            <h2>{moment(props.date).format("DD MMM.")}</h2>
            <div className="schedule-box">
                {
                    intervals.map(inter => <DayBlock date={inter} />)
                }
            </div>
        </div>
    )
}

function DayBlock(props) {
    return <div className="schedule-block">
        <h3>{moment(props.date).format("HH:mm")}</h3>
    </div>
}