import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountPage.scss";
import Auth from "../../js/auth";
import BlankButtonSlider from "../customElements/blankButtonSlider/BlankButtonSlider";
import { CSSTransition } from 'react-transition-group';
import { BrowserRouter as Router, Route, Link, useLocation, Switch } from 'react-router-dom'
import AccountStatistics from './account-statistics/AccountStatistics';



export default function AccountPage(props) {
    const location = useLocation();

    return <div id="account-page" className="full-page">
        <CSSTransition classNames="flow-top" timeout={1000}
            unmountOnExit
            in={location.pathname == "/account"}>
            <div id="top" className={Auth.auth().currentUser.status}>
                <div className="decoration l"></div>
                <div className="img">
                    <button className="add-photo">+</button>
                </div>
                <h3 id="name">{Auth.auth().currentUser.name}</h3>
                <h3 id="group">{Auth.auth().currentUser.group}</h3>
                <div className="decoration r1"></div>
                <div className="decoration r2 s"></div>
            </div>
        </CSSTransition>

        <div id="bottom">

            <Switch>
                <Route path="/account" exact>
                    <AccountStatistics />
                </Route>
            </Switch>

            <BlankButtonSlider
                links={[
                    { url: "/account", label: "мій акаунт" },
                    { url: "/account/schedule", label: "розклад" },
                    { url: "/account/points", label: "успішність" },
                    { url: "/account/settings", label: "налаштування" },
                ]} />
        </div>
    </div>
}