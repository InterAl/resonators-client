import React from "react";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflowY: "auto",
    },
    content: {
        padding: theme.spacing(4, 0),
    },
}));

export default ({ children, className = "", ...rest }) => {
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="center" className={`${classes.container} ${className}`} {...rest}>
            <Grid item xs={10} sm={8} md={6} lg={5} xl={4} className={classes.content}>
                {children}
            </Grid>
        </Grid>
    );
};
