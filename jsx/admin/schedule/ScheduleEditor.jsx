import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import "./ScheduleEditor.scss";
import Button from '@material-ui/core/Button'
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';

import Database from "../../../js/db";
import moment from "moment";
import uk from "moment/locale/uk";
import TextField from '@material-ui/core/TextField'
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, Menu, MenuItem } from '@material-ui/core';
import RenderIf from '../../customElements/RenderIf/RenderIf';
import { CSSTransition } from 'react-transition-group';
import { Helmet } from 'react-helmet';
moment.locale('uk');

const useStyles = makeStyles({
    centered: {
        alignSelf: "center",
        color: "white"
    }
})

const whiteTheme = createMuiTheme({
    palette: {
        primary: { main: "#000000" },
        secondary: { main: "#000000" }
    }
})

function Lesson({ index, lessonData, deleteLesson, timings,
    updateTimeByIndex, previousLessonData, lessonTitle = ["пара", "пари", "пару"] }) {
    const [lesson, setlesson] = useState(lessonData.lesson);
    const [type, settype] = useState(lesson == null ? "break" : "lesson");
    const [time, settime] = useState(lessonData.time);

    useEffect(() => {
        console.log("time lesson:", lessonData);
        updateTimeByIndex(index, time);
    }, [time]);

    useEffect(() => {
        if (lessonData.lesson == null)
            settype("break");
        setlesson(lessonData.lesson);
    }, [lessonData]);

    useEffect(() => {
        settype(lesson == null ? "break" : "lesson");
    }, [lesson]);

    if (type == "break")
        return <div className="schedule-lesson" onClick={() => deleteLesson(index)}>
            <FreeBreakfastIcon fontSize="large" />
            <p>перерва</p>
            <p>{moment(time).format("HH:mm")} - {moment(time).clone().add(timings.lessonDuration + timings.breakDuration, "m").format("HH:mm")}</p>
            <p className="small-text">Натисніть, щоби видалити картку</p>
        </div>

    return (
        <div className="schedule-lesson" onClick={() => deleteLesson(index)}>
            <h2>{lesson.title}</h2>
            <p>{moment(time).format("HH:mm")} - {moment(time).clone().add(timings.lessonDuration, "m").format("HH:mm")}</p>
            <p className="small-text">Натисніть, щоби зробити перервою</p>
        </div>
    )
}

function LessonCard({ lessonData, onClick }) {
    const [lessonType, setlessonType] = useState(() => {
        return lessonData.description.toLowerCase().indexOf("гум") > -1 ? "humanitary" : "technic";
    });
    return (
        <CSSTransition in appear classNames="pop" timeout={400}>
            <div className={`lesson-card ${lessonType}`} onClick={onClick}>
                <p className="lesson-id">#{lessonData.id}</p>
                <h3 className="lesson-title">{lessonData.title}</h3>
                <p className="lesson-description">{lessonData.description}</p>
                <h3 className="lesson-credit">{lessonData.credit_price ? lessonData.credit_price : "?"} Кр.</h3>
            </div>
        </CSSTransition>
    )
}

export default function ScheduleEditor({ maxPairs = 7, lessonTitle = ["пара", "пари", "пару"], timings = { lessonDuration: 90, breakDuration: 20 } }) {
    const [groupSearch, setgroupSearch] = useState("");
    const [groups, setgroups] = useState({ data: [], fetched: false });
    const [lessons, setlessons] = useState({ data: [], fetched: false });
    const [selectedGroup, setselectedGroup] = useState({});
    const [selectedDate, setselectedDate] = useState(moment(new Date()));
    const [selectedScheduelItems, setselectedScheduelItems] = useState([]);
    const [lessonScheduleItems, setlessonScheduleItems] = useState([]);
    const [showSearchResults, setshowSearchResults] = useState(false);
    const [deletedLessons, setdeletedLessons] = useState([]);

    const db = new Database();
    const classes = useStyles();

    function getData() {
        db.table("learnGroups").get()
            .then(data => {
                setgroups({ data: data, fetched: true });
            });
        db.table("lessons").get()
            .then(data => {
                setlessons({ data: data, fetched: true });
            });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log(selectedScheduelItems);
    }, [deletedLessons]);

    useEffect(() => {
        setshowSearchResults(true);
    }, [groupSearch]);

    useEffect(() => {
        setshowSearchResults(false);
        if (Object.keys(selectedGroup).length > 0)
            db.table("scheduleItems")
                .where("day", "=", selectedDate.clone().locale('en').format("dddd").toUpperCase())
                .where("group_id", "=", selectedGroup.id)
                .get()
                .then(data => {
                    data = data.map(dataItem => {
                        const dataTime = {
                            hours: dataItem.start_at.split(":")[0],
                            minutes: dataItem.start_at.split(":")[1],
                        }
                        return {
                            schedule_id: dataItem.id,
                            lesson: lessons.data.find(lesson => lesson.id == dataItem.lesson_id),
                            id: dataItem.id,
                            time: moment(new Date()).startOf("d").add(dataTime.hours, "h").add(dataTime.minutes, "m")
                        }
                    }).sort((a, b) => a.time - b.time);

                    let tempData = [...data];
                    console.log("temp:", tempData);
                    if (data.length > 0)
                        for (let i = moment(data[0].time.clone()); i.unix() < moment(data[data.length - 1].time.clone()).unix(); i.add((timings.lessonDuration + timings.breakDuration), "m")) {
                            console.log("time", i.format("HH:mm"));
                            console.log(tempData);
                            if (!tempData.find(e => e.time.unix() == i.unix()))
                                tempData.push({ time: i.clone() });
                        }
                    setselectedScheduelItems(tempData.sort((a, b) => a.time - b.time));
                })
    }, [selectedGroup, selectedDate]);

    useEffect(() => {
        setlessonScheduleItems(selectedScheduelItems.filter(item => item.lesson != null));
    }, [selectedScheduelItems]);

    useEffect(() => {
        console.log(lessonScheduleItems);
    }, [lessonScheduleItems]);

    function changeDate(date) {
        setselectedScheduelItems([]);
        setselectedDate(moment(date));
    }

    function saveScheduel() {
        const data = lessonScheduleItems
            .filter(e => !e.schedule_id)
            .map(item => {
                return {
                    lesson_id: item.lesson.id, group_id: selectedGroup.id,
                    start_at: moment(item.time).format("HH:mm:00"),
                    end_at: moment(item.time).clone().add(timings.lessonDuration, "m").format("HH:mm:00"),
                    day: moment(selectedDate).clone().locale('en').format("dddd").toUpperCase()
                }
            });
        data.map(dataItem => db.table("scheduleItems").add(dataItem));
        const updateData = lessonScheduleItems
            .filter(e => e.schedule_id != null)
            .map(item => {
                return {
                    id: item.schedule_id,
                    data: {
                        lesson_id: item.lesson.id, group_id: selectedGroup.id,
                        start_at: moment(item.time).format("HH:mm:00"),
                        end_at: moment(item.time).clone().add(timings.lessonDuration, "m").format("HH:mm:00"),
                        day: moment(selectedDate).clone().locale('en').format("dddd").toUpperCase()
                    }
                }
            });
        console.log(updateData);
        updateData.map(dataItem => db.table("scheduleItems").id(dataItem.id).update(dataItem.data));
        deletedLessons.map(deletedId => db.table("scheduleItems").id(deletedId).delete());
    }

    function deleteScheduelItem(index) {
        let temp = selectedScheduelItems.filter((_, i) => i != index);
        let iterator = 0;

        if (selectedScheduelItems[index].schedule_id)
            setdeletedLessons([...deletedLessons, selectedScheduelItems[index].schedule_id])
        console.log('temp', temp);
        if (temp.length > 1)
            for (let i = moment(temp[0].time.clone()); i.unix() < moment(temp[0].time.clone()).add((temp.length) * (timings.breakDuration + timings.lessonDuration), "m").unix(); i.add(timings.lessonDuration + timings.breakDuration, "m")) {
                console.log(i.format("HH:mm"));
                temp[iterator].time = i.clone();
                iterator += 1;
            }
        setselectedScheduelItems(temp);
    }

    function getDificulty() {
        if (lessonScheduleItems.length <= 2)
            return "low";
        if (lessonScheduleItems.length > 2 && lessonScheduleItems.length <= 4)
            return "medium";
        if (lessonScheduleItems.length > 4)
            return "high";
    }

    function updateTimeByIndex(index, time) {
        let tempScheduleItems = selectedScheduelItems;
        tempScheduleItems[index].time = time;
        console.log(time.format("HH:mm"));
        setselectedScheduelItems(tempScheduleItems);
    }

    return (
        <div id="lesson-editor" className="full-page">
            <Helmet>
                <title>Розклад {selectedDate.format("DD MMMM")}</title>
            </Helmet>
            <ThemeProvider theme={whiteTheme}>
                <RenderIf condition={groups.fetched}>
                    <div id="group-search">
                        <div id="group-search-input">
                            <TextField
                                id="gourp-search-input-root" label="пошук групи"
                                className={classes.TextField}
                                color="primary"
                                value={groupSearch}
                                onBlur={() => setshowSearchResults(false)}
                                onFocus={() => setshowSearchResults(true)}
                                variant="standard"
                                onChange={handle => setgroupSearch(handle.target.value)}
                            />
                        </div>
                        <CSSTransition in={groupSearch.length > 0 && showSearchResults} unmountOnExit classNames="pop" timeout={500}>
                            <div id="group-search-results">
                                {
                                    groups.data.filter(group => group.id.toLowerCase().indexOf(groupSearch.toLowerCase()) > -1)
                                        .map(group => <Button key={group.id} onClick={() => setselectedGroup(group)}>{group.id}</Button>)
                                }
                            </div>
                        </CSSTransition>
                    </div>
                </RenderIf>
            </ThemeProvider>

            <div className="centered flex info-block">
                {
                    selectedScheduelItems.length == 0 ?
                        <>
                            <h2>{lessonTitle[1]} доступні для групи {selectedGroup.id}</h2>
                            <p className="small-text">натисніть на карточку предмету, щоби додати його у розклад</p>
                        </>
                        :
                        <div id="control-panel">
                            <div id="dificulty">
                                <h2>Загрузка студентів:</h2>
                                <div className={`round-divs digits-${getDificulty()}`}>
                                    <div className={selectedScheduelItems.length > 0 ? "filled" : ""} />
                                    <div className={["medium", "high"].indexOf(getDificulty()) > -1 ? "filled" : ""} />
                                    <div className={getDificulty() == "high" ? "filled" : ""} />
                                </div>
                            </div>
                            <Button id="save-button" color="primary" disabled={lessonScheduleItems.length < 1}
                                variant="contained" onClick={saveScheduel}>Зберегти внесені зміни</Button>
                        </div>
                }
            </div>

            <div id="schedule">
                <Button variant="contained" color="primary" onClick={() => changeDate(moment(selectedDate.clone().subtract(1, "day")))}>
                    <LeftIcon />
                    <p>{moment(selectedDate.clone().subtract(1, "day")).format("ddd (DD MMM.)")}</p>
                </Button>
                <div id="schedule-day">
                    {
                        selectedScheduelItems.length > 0 ?
                            selectedScheduelItems.map((item, i) => <Lesson key={i} timings={timings} lessonData={item} key={i} updateTimeByIndex={updateTimeByIndex}
                                index={i}
                                deleteLesson={deleteScheduelItem}
                                previousLessonData={selectedScheduelItems.length > 1 ? selectedScheduelItems[i - 1] : null} />)
                            :
                            <div className="flex centered" style={{ flex: 1, alignSelf: "stretch" }}>
                                <h2>немає розкладу на {moment(selectedDate).format("DD MMMM")}</h2>
                            </div>
                    }

                    <RenderIf loading={false} condition={Object.keys(selectedGroup).length > 0}>
                        <div id="add-button" onClick={() => setselectedScheduelItems([...selectedScheduelItems,
                        { time: moment(moment(selectedDate).clone().startOf("D").hour(9)).add((timings.lessonDuration + timings.breakDuration) * selectedScheduelItems.length, "m") }])}>
                            <FreeBreakfastIcon fontSize="large" />
                            <p>Додати перерву</p>
                        </div>
                    </RenderIf>
                </div>
                <Button variant="contained" color="primary" onClick={() => changeDate(moment(selectedDate.clone().add(1, "day")))}>
                    <p>{moment(selectedDate.clone().add(1, "day")).format("ddd (DD MMM.)")}</p>
                    <RightIcon />
                </Button>
            </div>

            <div id="lessons">
                <RenderIf loading={false} condition={Object.keys(selectedGroup) == 0}>
                    <div className="flex centered">
                        <SearchIcon style={{ fontSize: "5em" }} />
                        <h2>Оберіть групу для складання розкладу вище</h2>
                    </div>
                </RenderIf>
                <RenderIf loading={false} condition={Object.keys(selectedGroup) != 0}>
                    <div className="flex centered" id="lesson-selector">

                        <div className="lesson-list">
                            {
                                lessons.data.map(lesson => <LessonCard key={lesson.id}
                                    onClick={() => setselectedScheduelItems([...selectedScheduelItems, {
                                        lesson: lesson,
                                        time: moment(moment(selectedDate).clone().startOf("D").hour(9)).add((timings.lessonDuration + timings.breakDuration) * selectedScheduelItems.length, "m")
                                    }])} lessonData={lesson} />)
                            }
                        </div>
                    </div>
                </RenderIf>
            </div>
        </div >
    )
}