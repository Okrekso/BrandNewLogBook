import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AuthPage.scss";
import { CSSTransition } from "react-transition-group";
import Auth from '../../js/auth';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error';

export default function AuthPage(props) {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("");
    const [state, setstate] = useState("inputs");

    useEffect(() => {
        if (state == "log-in") {
            Auth.signIn(email, password)
                .then(res => {
                    const authParams = { token: res.data.token, email: email };
                    console.log(token);
                    localStorage.setItem("authParams", authParams);
                })
                .catch(err => {
                    setstate("inputs");
                    seterror("Log In error. Check entered fields");
                });
        }
    }, [state]);


    return (
        <CSSTransition classNames="flow-bottom" timeout={800} in appear>
            <div id="auth" className="full-page">
                <div className="form">
                    {
                        state == "inputs" &&
                        <>
                            <TextField
                                label="email"
                                type="email"
                                className="text-fields"
                                value={email}
                                onChange={handle => setemail(handle.target.value)}
                            />
                            <TextField
                                label="password"
                                type="password"
                                className="text-fields"
                                value={password}
                                onChange={handle => setpassword(handle.target.value)}
                            />
                            {
                                error !== "" &&
                                <div id="error-holder">
                                    <ErrorIcon color="error" />
                                    <p>{error}</p>
                                </div>
                            }
                            <Button variant="contained" color="primary"
                                onClick={() => setstate("log-in")}
                                disabled={email.length < 5 || password.length < 2}>
                                Log In
                            </Button>
                        </>
                    }
                    {
                        state == "log-in" &&
                        <CircularProgress id="circular" color="primary" />
                    }
                </div>
            </div>
        </CSSTransition>
    )
}