import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

export default function RenderIf({ loading = true, condition, children, loadingColor }) {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: "#ffffff"
            }
        }
    });

    return (
        <>
            {
                !condition ?
                    (
                        loading ?
                            <ThemeProvider theme={theme}>
                                <CircularProgress style={{ margin: "10px", alignSelf: "center", color: loadingColor ? loadingColor : "white" }} />
                            </ThemeProvider> :
                            <></>)
                    :
                    children
            }
        </>
    )
}