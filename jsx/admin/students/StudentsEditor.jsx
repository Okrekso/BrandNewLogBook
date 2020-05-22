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

export default function StudentEditor() {
    const db = new Database();
    const [students, setstudents] = useState([]);
    const [groups, setgroups] = useState([]);
    const [dataFetched, setdataFetched] = useState(false);

    function getData() {
        setdataFetched(false);
        db.table("users").where("type", "=", "STD").get()
            .then(data => {
                console.log("Students:", data);
                setstudents(data);
                db.table("learnGroups").get()
                    .then(groupsData => {
                        setgroups(groupsData);
                        setdataFetched(true);
                    })
            })
    }

    function saveChanges(data) {
        db.table("users").id(data.id).update(data)
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
        <div id="student-editor">
            <CSSTransition in={!dataFetched} classNames="opacity" timeout={800}>
                <div style={{ alignSelf: "stretch" }}>
                    <LinearProgress className={classes.LinearProgress} />
                </div>
            </CSSTransition>
            <EditTableMenu dataFetched={dataFetched} saveChanges={saveChanges} data={students}
                headers={["ID", "Name", "Surname", "Email", "Group", "Type", "Date joined"]}
                editables={[
                    { label: "Name", key: "name", type: "text" },
                    { label: "Surname", key: "surname", type: "text" },
                    { label: "group", key: "learn_group", type: "dropdown", variants: groups, null: "no group" },
                    { label: "Type", key: "type", type: "button-select", variants: ["STD", "TCH", "ADM"] },
                ]} />
        </div>
    )
}