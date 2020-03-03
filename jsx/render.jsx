import React from 'react';
import ReactDOM from 'react-dom';
import "../scss/global.scss";
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import Header from './header/header';


export default function render(to) {
    ReactDOM.render(<Site />, to);
}

function Site(props) {
    return (
        <Router>
            <Header />
            <Switch>
                <Route to="/" exact>
                    <AuthPage />
                </Route>
            </Switch>
        </Router>
    );
}