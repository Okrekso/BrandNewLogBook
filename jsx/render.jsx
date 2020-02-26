import React from 'react';
import ReactDOM from 'react-dom';
import "../scss/global.scss";
import {
    BrowserRouter as Router,
    Route, Switch
} from 'react-router-dom';
import Auth from './auth/auth';


export default function render(to) {
    ReactDOM.render(<Site />, to);
}

function Site(props) {
    return (
        <Router>
            <Switch>
                <Route to="/" exact>
                    <Auth />
                </Route>
            </Switch>
        </Router>
    );
}