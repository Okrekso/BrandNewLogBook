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

export default function GroupEditor() {
    const db = new Database();
    const [groups, setgroups] = useState([]);
    const [dataFetched, setdataFetched] = useState(false);

    function getData() {
        setdataFetched(false);
        db.table("learnGroups").get()
            .then(data => {
                setdataFetched(true);
                setgroups(data);
            })
            .catch(err => console.error(err))
    }

    function saveChanges(data, previousData) {
        db.table("learnGroups").id(previousData.id).update(data)
            .then(() => {
                setdataFetched(false);
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function deleteById(id) {
        console.log("dete ", id);
        db.table("learnGroups").id(id).delete()
            .then(() => {
                setdataFetched(false);
                setTimeout(() => {
                    getData();
                }, 800);
            })
    }

    function addGroup(data) {
        db.table("learnGroups").add(data)
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
        <div id="group-editor">
            <CSSTransition in={!dataFetched} classNames="opacity" timeout={800}>
                <div style={{ alignSelf: "stretch" }}>
                    <LinearProgress className={classes.LinearProgress} />
                </div>
            </CSSTransition>
            <EditTableMenu dataFetched={dataFetched} saveChanges={saveChanges} data={groups}
                headers={["ID", "Course", "Strart on", "Ends on"]}
                addToTable={(data) => addGroup(data)}
                deleteById={deleteById}
                editables={[
                    { label: "ID", key: "id", type: "text", addOnly: true },
                    { label: "Course", key: "course", type: "text" },
                    { label: "Start on", key: "start_on", type: "date" },
                    { label: "Ends on", key: "ends_on", type: "date" },
                ]} />
        </div>
    )
}