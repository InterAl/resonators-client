import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";

export default ({ loading }) =>
    loading ? (
        <Backdrop open invisible>
            <CircularProgress />
        </Backdrop>
    ) : null;
