import React from "react";
import { Add } from "@material-ui/icons";
import { Fab, Tooltip, makeStyles } from "@material-ui/core";
import { useBelowBreakpoint } from "./hooks";

const useStyles = makeStyles((theme) => ({
    fab: {
        position: "fixed",
        [theme.breakpoints.up("xs")]: {
            right: "3%",
            bottom: "3%",
        },
        [theme.breakpoints.up("md")]: {
            right: "5%",
            bottom: "5%",
        },
        [theme.breakpoints.up("xl")]: {
            right: "10%",
            bottom: "10%",
        },
    },
    title: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export default ({ onClick, text = "" }) => {
    const classes = useStyles();
    const screenSmall = useBelowBreakpoint("xs");
    const displayExtended = text && !screenSmall;

    return (
        <Tooltip title={displayExtended ? "" : text}>
            <Fab
                color="primary"
                variant={displayExtended ? "extended" : "round"}
                onClick={onClick}
                className={classes.fab}
            >
                <Add />
                {displayExtended ? <span className={classes.title}>{text}</span> : null}
            </Fab>
        </Tooltip>
    );
};
