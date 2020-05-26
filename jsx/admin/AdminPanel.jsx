import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import Database from '../../js/db';
import {
    BrowserRouter as Router, Switch,
    Route, useRouteMatch
} from 'react-router-dom'

import "./AdminPanel.scss";
import StudentEditor from './students/StudentsEditor';
import ScheduleEditor from './schedule/ScheduleEditor';
import GroupEditor from './groups/GroupEditor';
import LessonEditor from './lessons/LessonEditor';

export default function AdminPanel() {
    const [lessons, setlessons] = useState();
    const path = useRouteMatch().path;

    useEffect(() => {
        const db = new Database();
        db.table("lessons").get()
            .then(data => { setlessons(data) })
    }, []);

    return (
        <div id='admin-panel' className="full-page big-page">
            <Switch>
                <Route path={`${path}/students`} component={StudentEditor} />
                <Route path={`${path}/groups`} component={GroupEditor} />
                <Route path={`${path}/schedule`} component={ScheduleEditor} />
                <Route path={`${path}/lessons`} component={LessonEditor} />
            </Switch>
        </div>
    )
}