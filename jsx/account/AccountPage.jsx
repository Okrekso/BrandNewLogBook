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
import AdminPanel from '../admin/AdminPanel';



export default function AccountPage(props) {
    const [schedule, setschedule] = useState([]);
    const location = useLocation();

    const [currentUser, setcurrentUser] = useState({});
    useEffect(() => {
        const db = new Database();
        db.table("users").id(Auth.getUserId()).get()
            .then(data => {
                const type = () => {
                    switch (data.type) {
                        case ("STD"): return "student";
                        case ("ADM"): return "admin";
                        case ("TCH"): return "teacher";
                    }
                };
                setcurrentUser({ ...data, type: type() });
            })
    }, []);

    return <div id="account-page" className="big-page full-page div-flex">
        <CSSTransition classNames="flow-top" timeout={1000}
            unmountOnExit
            in={location.pathname == "/"}>
            <div id="top" className={currentUser.status}>
                <div className="decoration l"></div>
                <div className="img">
                    <button className="add-photo">+</button>
                </div>
                <h3 id="name">{currentUser.name} {currentUser.surname}</h3>
                <h3 id="type">{currentUser.type}</h3>
                <h3 id="group">{currentUser.learn_group}</h3>
                <div className="decoration r1"></div>
                <div className="decoration r2 s"></div>
            </div>
        </CSSTransition>

        <div id="bottom">

            <Switch>
                {
                    currentUser.type === "student" &&
                    <Route path="/" exact>
                        <AccountStatistics />
                    </Route>
                }
                <Route path="/schedule" exact>
                    <AccountSchedule />
                </Route>
                <Route path="/settings" exact>
                    <AccountSettings />
                </Route>
                {
                    currentUser.type === "admin" &&
                    <Route path="/admin">
                        <AdminPanel />
                    </Route>
                }
            </Switch>
            {
                currentUser.type === "student" &&
                <BlankButtonSlider
                    links={[
                        { url: "/", label: "мій акаунт" },
                        { url: "/schedule", label: "розклад" },
                        { url: "/points", label: "успішність" },
                        { url: "/settings", label: "налаштування" },
                    ]} />
            }
            {
                currentUser.type === "admin" &&
                <BlankButtonSlider
                    links={[
                        { url: "/", label: "мій акаунт" },
                        { url: "/admin/students", label: "студенти" },
                        { url: "/admin/groups", label: "групи навчання" },
                        { url: "/admin/lessons", label: "зайняття" },
                        { url: "/admin/schedule", label: "складання розкладу" },
                        { url: "/settings", label: "налаштування" },
                    ]} />
            }
        </div>
    </div>
}