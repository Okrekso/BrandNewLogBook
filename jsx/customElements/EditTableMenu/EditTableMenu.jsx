import "./EditTableMenu.scss";
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Table, TableCell, Fab, MenuItem, TableContainer, TableBody, TableHead, TableRow, Paper, CircularProgress, LinearProgress, TextField, Button, ButtonGroup } from "@material-ui/core";
import Database from '../../../js/db';
import { makeStyles, ThemeProvider } from '@material-ui/styles';

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import YesIcon from "@material-ui/icons/Done";
import NoIcon from "@material-ui/icons/Close";

import { createMuiTheme } from "@material-ui/core/styles";
import { CSSTransition } from "react-transition-group";

import RedTheme from "@material-ui/core/colors/red";
import GreenTheme from "@material-ui/core/colors/green";


const useStyles = makeStyles({
    Paper: {
        alignSelf: "center",
        margin: "10px",
        maxWidth: "90%",
    },
    Fab: {
        alignSelf: "flex-start",
        margin: "10px"
    },
    Red: {
        backgroundColor: "red",
        color: "white",
    }
});

export default function EditTableMenu({ dataFetched, saveChanges, addToTable, deleteById, data, headers, editables }) {
    const [selected, setselected] = useState(null);
    const [transitionSelected, settranstionSelected] = useState(null);
    const [operation, setoperation] = useState("edit");
    const [hideLeftBlock, sethideLeftBlock] = useState(true);

    const animDuration = 1000;
    function handleChanges(params) {
        settranstionSelected({ ...transitionSelected, ...params });
    }

    function sendSaveChanges() {
        setselected(null);
        settranstionSelected(null);
        sethideLeftBlock(true);
        saveChanges(transitionSelected, selected);
    }

    function sendAdd() {
        settranstionSelected(null);
        sethideLeftBlock(true);
        addToTable(transitionSelected);
    }

    function changeOperation(op) {
        sethideLeftBlock(true);
        setoperation(op);
        setTimeout(() => {
            sethideLeftBlock(false);
        }, animDuration);
    }

    const classes = useStyles();

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: "#212170"
            },
            secondary: {
                main: "#0077ff"
            },
            error: {
                main: "#e61c1c"
            }
        }
    });
    const redTheme = createMuiTheme({
        palette: {
            primary: RedTheme
        }
    })
    const greenTheme = createMuiTheme({
        palette: {
            primary: GreenTheme,
            secondary: GreenTheme
        }
    })

    const valOrNullByKey = (val, key) => val ? val[key] : null;

    useEffect(() => {
        if (selected == null) {
            sethideLeftBlock(true);
            return settranstionSelected(null);
        }
        sethideLeftBlock(true);
        setoperation("edit");
        if (transitionSelected == null) {
            sethideLeftBlock(false);
            return settranstionSelected(selected);
        }
        settranstionSelected(null);
        setTimeout(() => {
            sethideLeftBlock(false);
            settranstionSelected(selected);
        }, animDuration);
    }, [selected]);

    useEffect(() => {
        if (operation == "add") {
            setselected(null);
            sethideLeftBlock(true);
            setTimeout(() => {
                const objectEdit = new Object();
                editables.map(editable => { objectEdit[editable.key] = null });
                settranstionSelected(objectEdit);
                sethideLeftBlock(false);
            }, animDuration);
        }
    }, [operation]);

    useEffect(() => {
        console.log("T", transitionSelected);
        if (transitionSelected)
            console.log("D", valOrNullByKey(transitionSelected, "learn_group"));
    }, [transitionSelected]);

    return (
        <div id="edit-table-menu">
            {
                operation === "delete" &&
                <CSSTransition classNames="flow-bottom" in={operation === "delete"} timeout={800}>
                    <div id="delete-form">
                        <h2>Are you sure you want to delete element {selected.id}</h2>
                        <div id="bottom-buttons">
                            <ThemeProvider theme={greenTheme}>
                                <Fab color="primary" style={{ margin: "0 10px" }}
                                    onClick={() => { deleteById(selected.id); sethideLeftBlock(true); }}>
                                    <YesIcon style={{ color: "white" }} />
                                </Fab>
                            </ThemeProvider>
                            <ThemeProvider theme={redTheme}>
                                <Fab color="primary" style={{ margin: "0 10px" }}>
                                    <NoIcon style={{ color: "white" }}
                                        onClick={() => { setoperation("edit"); sethideLeftBlock(true); setselected(null) }} />
                                </Fab>
                            </ThemeProvider>
                        </div>
                    </div>
                </CSSTransition>
            }
            <div id="table">
                <CSSTransition in={dataFetched} classNames="opacity" timeout={800}>
                    <div id="table-holder">
                        <div id="top-buttons">
                            <Fab variant="extended" className={classes.Fab} size="medium" color="primary"
                                onClick={() => changeOperation("add")}>
                                <AddIcon />
                            Add
                            </Fab>
                            <ThemeProvider theme={redTheme} >
                                <Fab variant="extended" className={classes.Fab} color="primary" size="medium"
                                    disabled={selected === null}
                                    onClick={() => setoperation("delete")}>
                                    <DeleteIcon />
                                Delete
                                </Fab>
                            </ThemeProvider>
                        </div>
                        <TableContainer className={classes.Paper} component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {
                                            headers.map((header, i) => <TableCell key={i}>{header}</TableCell>)
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data.length > 0 &&
                                        data.map((dataItem, i) => <TableRow
                                            selected={selected == dataItem}
                                            onClick={() => setselected(dataItem)}
                                            key={i} hover>
                                            {
                                                Object.keys(dataItem).map((key, vi) => <TableCell key={vi}>{dataItem[key]}</TableCell>)
                                            }
                                        </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </CSSTransition>
            </div>
            <CSSTransition classNames="left-move" unmountOnExit
                in={!hideLeftBlock && operation != "delete"}
                unmountOnExit
                timeout={800}>
                <div id="edit-form">
                    <ThemeProvider theme={theme}>
                        <CSSTransition classNames="opacity" in={transitionSelected != null} timeout={800}>
                            <h2>{operation == "add" ? "Adding new Item" : "Edit"}</h2>
                        </CSSTransition>
                        {
                            editables.map((edit, i) => {
                                return (
                                    <>
                                        {
                                            ((edit.addOnly && operation == "add") || (!edit.addOnly)) &&
                                            <>
                                                {
                                                    edit.type == "text" &&
                                                    <TextField label={edit.label}
                                                        key={i}
                                                        value={valOrNullByKey(transitionSelected, edit.key)}
                                                        onChange={handle => handleChanges({ [edit.key]: handle.target.value })} />
                                                }
                                                {
                                                    edit.type == "dropdown" &&
                                                    <TextField label={edit.label}
                                                        key={i} select
                                                        value={valOrNullByKey(transitionSelected, edit.key)}
                                                        onChange={handle => handleChanges({ [edit.key]: handle.target.value })} >
                                                        {
                                                            edit.null != null ?
                                                                [
                                                                    { id: "", label: edit.null, key: "" },
                                                                    ...edit.variants
                                                                ].map((variant, vi) => <MenuItem key={vi} value={variant.id}>{variant.label ? variant.label : variant.id}</MenuItem>)
                                                                :
                                                                edit.variants.map((variant, vi) => <MenuItem key={vi} value={variant.id}>{variant.label ? variant.label : variant.id}</MenuItem>)
                                                        }
                                                    </TextField>
                                                }
                                                {
                                                    edit.type == "button-select" &&
                                                    <ButtonGroup
                                                        key={i}
                                                        style={{ marginTop: "10px" }}
                                                        variant="contained" color="primary">
                                                        {
                                                            edit.variants.map((variant, vi) => <Button key={vi} disabled={transitionSelected && transitionSelected.type == variant}>{variant}</Button>)
                                                        }
                                                    </ButtonGroup>
                                                }
                                                 {
                                                    edit.type == "number" &&
                                                    <TextField label={edit.label}
                                                    type="number"
                                                    key={i}
                                                    value={valOrNullByKey(transitionSelected, edit.key)}
                                                    onChange={handle => handleChanges({ [edit.key]: handle.target.value })} />
                                                }
                                            </>
                                        }
                                    </>
                                )
                            })
                        }
                    </ThemeProvider>

                    <Button disabled={transitionSelected === selected}
                        onClick={operation != "add" ? sendSaveChanges : sendAdd}
                        variant="contained" color="secondary" style={{ marginTop: "20px" }}>
                        {operation != "add" ? "Save changes" : "Add to table"}
                    </Button>
                </div>
            </CSSTransition>
        </div >
    )
}