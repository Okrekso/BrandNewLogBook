import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

export default function RenderIf({ loading = true, condition, children }) {
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
                                <CircularProgress style={{ margin: "10px", alignSelf: "center" }} />
                            </ThemeProvider> :
                            <></>)
                    :
                    children
            }
        </>
    )
}