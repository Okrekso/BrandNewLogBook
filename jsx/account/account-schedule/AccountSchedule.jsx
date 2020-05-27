import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, NavLink, useHistory, useRouteMatch, useParams } from 'react-router-dom';
import "./AccountSchedule.scss";
import moment from "moment";
import Database from "../../../js/db";
import { Auth } from '../../../js/auth';
import RenderIf from '../../customElements/RenderIf/RenderIf';
import { CSSTransition } from "react-transition-group";
import { CircularProgress } from '@material-ui/core';
moment.locale("uk");
const db = new Database();

function Lesson({ data, selectedDate, timings, onClick, selected }) {
    const [lesson, setlesson] = useState(data.lesson);
    const [schedule, setschedule] = useState(() => { let tempData = { ...data }; delete tempData.lesson; return tempData });
    const [startTime, setstartTime] = useState(
        moment(selectedDate).startOf("day")
            .add(schedule.start_at.split(":")[0], "h")
            .add(schedule.start_at.split(":")[1], "m")
    );
    const [endTime, setEndTime] = useState(startTime.clone().add(timings.lessonDuration + timings.breakDuration, "m"));
    const [teacher, setteacher] = useState({});
    useEffect(() => {
        if (lesson.teacher_id)
            db.table("users").where("id", "=", lesson.teacher_id)
                .get()
                .then(data => { setteacher(data[0]) });
    }, []);
    return <div className={`schedule-lesson ${selected ? "selected" : ""}`} onClick={onClick}>
        <RenderIf condition={lesson != null && Object.keys(lesson).length > 0} loadingColor="black">
            <h2>{lesson.title}</h2>
        </RenderIf>
        <p>{startTime.format("HH:mm")} - {endTime.format("HH:mm")}</p>
        {
            lesson && lesson.teacher_id ?
                <RenderIf condition={Object.keys(teacher).length > 0} loadingColor="black">
                    <p className="teacher-name">{teacher.name} {teacher.surname}</p>
                </RenderIf>
                :
                lesson ?
                    <p className="teacher-name">не зазначений викладач</p>
                    :
                    <CircularProgress style={{ margin: "10px", alignSelf: "center", color: "black" }} />
        }
    </div>
}

export default function AccountSchedule({ timings = { lessonDuration: 90, breakDuration: 20 } }) {
    const params = useParams();
    const [lessons, setlessons] = useState({ data: [], fetched: false });
    const [scheduleItems, setscheduleItems] = useState({ data: [], fetched: false });
    const weekDays = (() => {
        let daysArr = [];
        for (let i = 0; i < 7; i++) daysArr.push(moment(new Date()).startOf("week").add(i, "day"))
        return daysArr;
    })();
    const [todaySchedule, settodaySchedule] = useState([]);
    const [selectedDay, setselectedDay] = useState(() => {
        if (params.month && params.date)
            return moment(new Date()).month(Number(params.month) - 1).date(Number(params.date));
        else
            return moment(new Date())
    });
    const [selectedLesson, setselectedLesson] = useState();
    const [selectedLessonData, setselectedLessonData] = useState({});

    const history = useHistory();
    const location = useRouteMatch().path;

    useEffect(() => {
        setselectedDay(() => {
            if (params.month && params.date)
                return moment(new Date()).month(Number(params.month) - 1).date(Number(params.date));
            else
                return moment(new Date())
        });
    }, [params]);

    useEffect(() => {
        if (todaySchedule.length > 0)
            setselectedLessonData(todaySchedule.find(item => item.id == selectedLesson));
    }, [selectedLesson]);

    function getData() {
        db.table("scheduleItems").where("group_id", "=", new Auth().authParams.group)
            .get()
            .then(data => {
                setscheduleItems({ data: data, fetched: true });
            });
        db.table("lessons").get()
            .then(data => { setlessons({ data: data, fetched: true }) });
    }

    function duration2moment(duration) {
        return moment(new Date()).startOf('day').add(duration.split(":")[0], "h").add(duration.split(":")[1], "m")
    }

    function updateTodayScehdule() {
        const selectedDayString = moment(selectedDay).clone().locale("en").format("dddd").toUpperCase();
        settodaySchedule(
            scheduleItems.data.filter(item => item.day == selectedDayString)
                .map(scheduleData => {
                    return { ...scheduleData, lesson: lessons.data.find(lesson => lesson.id == scheduleData.lesson_id) }
                })
                .sort((b, a) => duration2moment(b.start_at) - duration2moment(a.start_at))
        );
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (scheduleItems.fetched)
            updateTodayScehdule();
    }, [scheduleItems]);

    useEffect(() => {
        if (lessons.fetched && scheduleItems.fetched)
            updateTodayScehdule();
    }, [selectedDay]);

    useEffect(() => {
    }, [todaySchedule]);

    return (
        <div id="account-schedule">
            <div id="week-schedule">
                {weekDays.map(day => <div className={`week-day ${day.date() == selectedDay.date() ? "selected" : ""}`}
                    onClick={() => history.push(`/schedule/${day.clone().format("MM/DD")}`)}>
                    <p className="date">{day.format("DD/MM")}</p>
                    <p className="day-of-the-week">{day.format("dddd")}</p>
                </div>)}
            </div>
            <RenderIf condition={lessons.fetched && scheduleItems.fetched}>
                <div id="schedule-bottom">
                    <div id="day-schedule">
                        {
                            todaySchedule.length > 0 ?
                                todaySchedule
                                    .map(data => <CSSTransition classNames="flow-top" in appear timeout={800}>
                                        <Lesson selected={selectedLesson == data.id} data={data} timings={timings} selectedDate={selectedDay} onClick={() => setselectedLesson(data.id)} />
                                    </CSSTransition>)
                                :
                                <p className="info">У вас немає пар {selectedDay.format("MM/DD/YYYY")}</p>
                        }
                    </div>
                    <div id="lesson-info" className={selectedLesson ? "selected" : ""}>
                        <RenderIf condition={Object.keys(selectedLessonData).length > 0} loading={false}>
                            {
                                selectedLessonData.lesson &&
                                <>
                                    <h2>{selectedLessonData.lesson.title}</h2>
                                    <p>{selectedLessonData.lesson.description}</p>
                                </>
                            }
                        </RenderIf>
                    </div>
                </div>
            </RenderIf>
        </div>
    )
}