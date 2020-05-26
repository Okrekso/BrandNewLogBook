import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { LinearProgress } from "@material-ui/core";
import Database from '../../../js/db';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { CSSTransition } from "react-transition-group";
import EditTableMenu from '../../customElements/EditTableMenu/EditTableMenu';
import RenderIf from '../../customElements/RenderIf/RenderIf';

const useStyles = makeStyles({
    LinearProgress: {
        width: "100%",
        marginTop: "0",
        transition: "800ms"
    }
})

export default function LessonEditor() {
    const db = new Database();
    const [lessons, setlessons] = useState({ data: [], fetched: false });
    const [teachers, setteachers] = useState({ data: [], fetched: false });

    function getData() {
        setlessons({ data: [], fetched: false })
        setteachers({ data: [], fetched: false })
        db.table("users")
            .where("type", "=", "ADM")
            .get()
            .then(data => {
                const adminData = data;
                db.table("users")
                    .where("type", "=", "TCH")
                    .get()
                    .then(data => setteachers({ fetched: true, data: [...adminData, ...data] }))
            })

        db.table("lessons").get()
            .then(data => setlessons({ fetched: true, data: data }))
            .catch(err => console.error(err))
    }

    function saveChanges(data, previousData) {
        db.table("lessons").id(previousData.id).update(data)
            .then(() => {
                setlessons({ data: [], fetched: false })
                setteachers({ data: [], fetched: false })
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function deleteById(id) {
        console.log("dete ", id);
        db.table("lessons").id(id).delete()
            .then(() => {
                setlessons({ data: [], fetched: false })
                setteachers({ data: [], fetched: false })
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function addLesson(data) {
        db.table("lessons").add(data)
            .then(() => {
                setlessons({ data: [], fetched: false })
                setteachers({ data: [], fetched: false })
                setTimeout(() => {
                    getData();
                }, 800);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log(teachers);
    }, [teachers]);

    const classes = useStyles();

    return (
        <div id="lesson-editor">
            <CSSTransition in={!lessons.fetched || !teachers.fetched} classNames="opacity" timeout={800}>
                <div style={{ alignSelf: "stretch" }}>
                    <LinearProgress className={classes.LinearProgress} />
                </div>
            </CSSTransition>
            <RenderIf condition={lessons.fetched && teachers.fetched}>
                <EditTableMenu dataFetched={lessons.fetched && teachers.fetched} saveChanges={saveChanges} data={lessons.data}
                    headers={["ID", "Title", "Description", "Credits", "Teacher"]}
                    addToTable={(data) => addLesson(data)}
                    deleteById={deleteById}
                    editables={[
                        { label: "Title", key: "title", type: "text" },
                        { label: "Description", key: "description", type: "text" },
                        { label: "Credits", key: "credit_price", type: "number" },
                        { label: "Teacher", null: "немає викладача", key: "teacher_id", type: "dropdown", variants: teachers.data, showValue: "email" },
                    ]} />
            </RenderIf>
        </div>
    )
}