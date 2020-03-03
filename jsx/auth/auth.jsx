import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./auth.scss";

export default function Auth(props) {
    return (
        <div id="auth" className="full-page">
            <h1>Brand New LogBook</h1>
            <div className="form">
                <input type="email" placeholder="email" />
                <input type="password" placeholder="password" />
                <button>Log In</button>
            </div>
        </div>
    )
}