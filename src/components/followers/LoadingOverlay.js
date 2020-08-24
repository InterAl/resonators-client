import React from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    backdrop: {
        position: "absolute",
    },
}));

export default () => (
    <Backdrop open invisible className={useStyles().backdrop}>
        <CircularProgress />
    </Backdrop>
);
