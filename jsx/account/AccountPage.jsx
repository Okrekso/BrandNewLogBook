import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountPage.scss";
import Auth from "../../js/auth";
import BlankButtonSlider from "../customElements/blankButtonSlider/BlankButtonSlider";
import { CSSTransition } from 'react-transition-group';
import { BrowserRouter as Router, Route, Link, useLocation, Switch } from 'react-router-dom'
import AccountStatistics from './account-statistics/AccountStatistics';
import AccountSchedule from './account-schedule/AccountSchedule';
import Database from '../../js/db';
import AccountSettings from './account-settings/AccountSettings';



export default function AccountPage(props) {
    const [schedule, setschedule] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const db = new Database();
        // db.table("lessons").get()
        //     .then(data => {
        //         console.log(data);
        //     })
        //     .catch(err => {
        //         console.error("err:", err);
        //     })
    }, []);

    return <div id="account-page" className="big-page full-page">
        <CSSTransition classNames="flow-top" timeout={1000}
            unmountOnExit
            in={location.pathname == "/"}>
            <div id="top" className={Auth.currentUser.status}>
                <div className="decoration l"></div>
                <div className="img">
                    <button className="add-photo">+</button>
                </div>
                <h3 id="name">{Auth.currentUser.name}</h3>
                <h3 id="group">{Auth.currentUser.group}</h3>
                <div className="decoration r1"></div>
                <div className="decoration r2 s"></div>
            </div>
        </CSSTransition>

        <div id="bottom">

            <Switch>
                <Route path="/" exact>
                    <AccountStatistics />
                </Route>
                <Route path="/schedule" exact>
                    <AccountSchedule />
                </Route>
                <Route path="/settings" exact>
                    <AccountSettings />
                </Route>
            </Switch>

            <BlankButtonSlider
                links={[
                    { url: "/", label: "мій акаунт" },
                    { url: "/schedule", label: "розклад" },
                    { url: "/points", label: "успішність" },
                    { url: "/settings", label: "налаштування" },
                ]} />
        </div>
    </div>
}