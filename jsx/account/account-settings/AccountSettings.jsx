import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import "./AccountSettings.scss";
import Button from '@material-ui/core/Button'
import Auth from "../../../js/auth";

export default function AccountSettings() {
    return (
        <div id="account-settings">
            <Button variant="contained" classes={{ root: "red-btn" }}
                onClick={() => { Auth.logOut(); window.location.reload(); }}>
                Log Out
            </Button>
        </div>
    )
}   