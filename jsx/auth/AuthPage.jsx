import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AuthPage.scss";

import { CSSTransition } from "react-transition-group";

export default function AuthPage(props) {
    return (
        <CSSTransition classNames="flow-bottom" timeout={800} in appear>
            <div id="auth" className="full-page">
                <div className="form">
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <button>Log In</button>
                </div>
            </div>
        </CSSTransition>
    )
}