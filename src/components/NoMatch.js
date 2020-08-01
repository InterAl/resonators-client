import React, { Component } from "react";
import { Typography } from "@material-ui/core";

export default class NoMatch extends Component {
    render() {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h4" style={{marginBottom: 8}}>Oops!</Typography>
                <Typography variant="h6" color="textSecondary">
                    The place you're looking for does not exist...
                </Typography>
            </div>
        );
    }
}
