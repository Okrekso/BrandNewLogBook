import React from 'react';
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
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Header />
                <Switch>
                    <Route path="/" exact>
                        <AuthPage />
                    </Route>
                    <Route path="/account">
                        <AccountPage />
                    </Route>
                </Switch>
            </ThemeProvider>
        </Router>
    );
}