import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountPage.scss";
import Auth from "../../js/auth";

export default function AccountPage(props) {
    useEffect(() => {
        console.log("this:", Auth.auth().currentUser);
    }, []);
    return <div id="account-page" className="full-page">

    </div>
}