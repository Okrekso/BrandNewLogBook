import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { LinearProgress } from "@material-ui/core";
import Database from '../../../js/db';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { CSSTransition } from "react-transition-group";
import EditTableMenu from '../../customElements/EditTableMenu/EditTableMenu';
import { Auth } from '../../../js/auth';

const useStyles = makeStyles({
    LinearProgress: {
        width: "100%",
        marginTop: "0",
        transition: "800ms"
    }
})

export default function TeachersEditor() {
    const db = new Database();
    const [teachers, setteachers] = useState({ data: [], fetched: false });
    const [admins, setadmins] = useState({ data: [], fetched: false });

    function getData() {
        db.table("users").where("type", "=", "TCH").get()
            .then(data => {
                setteachers({ fetched: true, data: data });
            })
        db.table("users").where("type", "=", "ADM")
            .get()
            .then(data => {
                setadmins({ fetched: true, data: data.filter(e => e.id != new Auth().getUserId()) })
            })
    }

    function saveChanges(data) {
        db.table("users").id(data.id).update(data)
            .then(() => {
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
        <div id="teachers-admins-editor">
            <CSSTransition in={!teachers.fetched || !admins.fetched} classNames="opacity" timeout={800}>
                <div style={{ alignSelf: "stretch" }}>
                    <LinearProgress className={classes.LinearProgress} />
                </div>
            </CSSTransition>
            <EditTableMenu dataFetched={teachers.fetched && admins.fetched} dataKeys={["id", "email", "name", "surname", "date_joined"]}
                saveChanges={saveChanges} data={[...admins.data, ...teachers.data]}
                headers={["ID", "Email", "Name", "Surname", "Date joined"]}
                editables={[
                    { label: "Name", key: "name", type: "text" },
                    { label: "Surname", key: "surname", type: "text" },
                    { label: "Email", key: "email", type: "text" },
                ]} />
        </div>
    )
}