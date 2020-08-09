import React from "react";
import { Close } from "@material-ui/icons";
import { Snackbar, IconButton } from "@material-ui/core";

export default ({ open, close, message, hideAfter = 5000, ...other }) => {
    const closeToast = (event, reason) => {
        if (reason !== "clickaway") close();
    };

    return (
        <Snackbar
            open={open}
            message={message}
            onClose={closeToast}
            autoHideDuration={hideAfter}
            action={
                <IconButton color="inherit" onClick={closeToast}>
                    <Close />
                </IconButton>
            }
            {...other}
        />
    );
};
