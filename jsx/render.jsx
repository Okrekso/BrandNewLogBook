import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import "../scss/global.scss";
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import Header from './header/header';
import AccountPage from './account/AccountPage';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/core/styles"
import blue from '@material-ui/core/colors/blue';
import Auth from '../js/auth';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#0066ff"
        },
        secondary: blue,
        error: {
            main: "#df3030"
        }
    },
});

export default function render(to) {
    ReactDOM.render(<Site />, to);
}

function Site(props) {
    const [authParams, setauthParams] = useState(Auth.auth().authParams);
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Header />
                <Switch>
                    <Route path="/" exact>
                        {
                            authParams.email === undefined ?
                                <AuthPage />
                                :
                                <AccountPage />
                        }
                    </Route>
                </Switch>
            </ThemeProvider>
        </Router>
    );
}