import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { LinearProgress } from "@material-ui/core";
import Database from '../../../js/db';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { CSSTransition } from "react-transition-group";
import EditTableMenu from '../../customElements/EditTableMenu/EditTableMenu';

const useStyles = makeStyles({
    LinearProgress: {
        width: "100%",
        marginTop: "0",
        transition: "800ms"
    }
})

export default function LessonEditor() {
    const db = new Database();
    const [lessons, setlessons] = useState([]);
    const [dataFetched, setdataFetched] = useState(false);

    function getData() {
        setdataFetched(false);
        db.table("lessons").get()
            .then(data => {
                setdataFetched(true);
                setlessons(data);
            })
            .catch(err => console.error(err))
    }

    function saveChanges(data, previousData) {
        db.table("lessons").id(previousData.id).update(data)
            .then(() => {
                setdataFetched(false);
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function deleteById(id) {
        console.log("dete ", id);
        db.table("lessons").id(id).delete()
            .then(() => {
                setdataFetched(false);
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function addLesson(data) {
        db.table("lessons").add(data)
            .then(() => {
                setdataFetched(false);
                setTimeout(() => {
                    getData();
                }, 800);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const classes = useStyles();

    return (
        <div id="lesson-editor">
            <CSSTransition in={!dataFetched} classNames="opacity" timeout={800}>
                <div style={{ alignSelf: "stretch" }}>
                    <LinearProgress className={classes.LinearProgress} />
                </div>
            </CSSTransition>
            <EditTableMenu dataFetched={dataFetched} saveChanges={saveChanges} data={lessons}
                headers={["ID", "Title", "Description", "Credits"]}
                addToTable={(data) => addLesson(data)}
                deleteById={deleteById}
                editables={[
                    { label: "Title", key: "title", type: "text" },
                    { label: "Description", key: "description", type: "text" },
                    { label: "Credits", key: "credit_price", type: "number" },
                ]} />
        </div>
    )
}