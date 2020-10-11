import React from "react";
import { Toolbar, Grid } from "@material-ui/core";

import TopBar from "./TopBar";
import SideMenu from "./SideMenu";

export default (props) => (
    <>
        <TopBar />
        <Toolbar />
        <Grid container wrap="nowrap">
            <Grid item>
                <SideMenu />
            </Grid>
            <Grid item xs container justify="center" style={{ padding: 30 }}>
                <Grid item xs md={10} xl={8}>
                    {props.children}
                </Grid>
            </Grid>
        </Grid>
    </>
);
