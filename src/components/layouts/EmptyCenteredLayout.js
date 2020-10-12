import React from "react";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflowY: "auto",
    },
}));

export default ({ children, className = "", ...rest }) => {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={`${useStyles().container} ${className}`}
            {...rest}
        >
            <Grid item xs={10} sm={8} md={6} lg={5} xl={4}>
                {children}
            </Grid>
        </Grid>
    );
};
