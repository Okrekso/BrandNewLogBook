import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountPage.scss";
import Auth from "../../js/auth";

export default function AccountPage(props) {

    return <div id="account-page" className="full-page">
        <div id="top">
            <div className="decoration l"></div>
            <div className="img" />
            <h3 id="name">{Auth.auth().currentUser.name}</h3>
            <h3 id="group">{Auth.auth().currentUser.group}</h3>
            <div className="decoration r1"></div>
            <div className="decoration r2 s"></div>
        </div>
        <div id="bottom"></div>
    </div>
}