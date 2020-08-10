import React from "react";
import { ExpandMore } from "@material-ui/icons";
import { makeStyles, Fab, CircularProgress, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    loadMoreButton: {
        margin: theme.spacing(2, 0),
    },
    loadMoreSpinner: {
        color: theme.palette.action.disabled,
    },
    loadMoreText: {
        margin: theme.spacing(0, 1),
    },
}));

export default ({ loading, loadMore, text }) => {
    const classes = useStyles();

    return (
        <Grid container justify="center">
            <Grid item>
                <Fab
                    color="primary"
                    variant="extended"
                    onClick={loadMore}
                    disabled={loading}
                    className={classes.loadMoreButton}
                >
                    {loading ? <CircularProgress size={20} className={classes.loadMoreSpinner} /> : <ExpandMore />}
                    <span className={classes.loadMoreText}>{text}</span>
                </Fab>
            </Grid>
        </Grid>
    );
};
