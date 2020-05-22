import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AuthPage.scss";
import {
    BrowserRouter as Router,
    Route, Switch,
    useHistory, useRouteMatch
} from 'react-router-dom'

import { CSSTransition } from "react-transition-group";
import Auth from '../../js/auth';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error';
import { Select, MenuItem, InputLabel } from '@material-ui/core';


function AuthForm() {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("");
    const [state, setstate] = useState("inputs");
    const history = useHistory();

    useEffect(() => {
        if (state == "log-in") {
            Auth.logIn(email, password)
                .then(res => {
                    window.location.reload();
                })
                .catch(err => {
                    console.error(err);
                    setstate("inputs");
                    seterror("Log In error. Check entered fields");
                });
        }
    }, [state]);

    return (
        <CSSTransition classNames="flow-bottom" timeout={800} in appear>
            <div className="form">
                {
                    state == "inputs" &&
                    <>
                        <div id="inputs">
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
                        </div>
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
                        <p style={{ alignSelf: "center" }}>or</p>
                        <Button variant="contained" color="primary"
                            onClick={() => history.push("/sign-in")}>
                            Sign In
                        </Button>
                    </>
                }
                {
                    state == "log-in" &&
                    <CircularProgress id="circular" color="primary" />
                }
            </div>
        </CSSTransition>
    )
}

function SignInForm() {
    const [name, setname] = useState("");
    const [surname, setsurname] = useState("");
    const [type, settype] = useState("STD");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("password-too-less");
    const history = useHistory();

    function register() {
        Auth.signUp({ name: name, surname: surname, type: type });
    }

    return (
        <CSSTransition classNames="flow-bottom" timeout={800} in appear>
            <div id="sign-in-form" className="form">
                <div id="inputs">
                    <TextField
                        label="name"
                        value={name}
                        onChange={handle => setname(handle.target.value)}
                    />
                    <TextField
                        label="surname"
                        value={surname}
                        onChange={handle => setsurname(handle.target.value)}
                    />
                    <Select labelId="user-type"
                        classes={{ selectMenu: "select" }} value={type} onChange={handle => settype(handle.target.value)}>
                        <MenuItem value="TCH">Teacher</MenuItem>
                        <MenuItem value="STD">Student</MenuItem>
                    </Select>

                    <TextField
                        label="password"
                        type="password"
                        value={password}
                        onChange={handle => setpassword(handle.target.value)}
                    />
                    <TextField
                        label="confirm password"
                        type="password"
                        onChange={handle => seterror(handle.target.value != password ? "password-incorrect" : "")}
                    />
                </div>
                <Button variant="contained" color="primary"
                    disabled={error !== ""}
                    onClick={register}>
                    Register
                </Button>
            </div>
        </CSSTransition>
    )
}

export default function AuthPage() {
    return (
        <div className="big-page">
            <Switch>
                <Route exact path={`/`} component={AuthForm} />
                <Route exact path={`/sign-in`} component={SignInForm} />
                <AuthForm />
            </Switch>
        </div>
    )
}