import React from "react";
import { connect } from "react-redux";
import MomentUtils from "@date-io/moment";
import { SnackbarProvider } from "notistack";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider, Toolbar, Grid } from "@material-ui/core";

import "./app.scss";
import theme from "./theme";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import { useBelowBreakpoint } from "./hooks";
import ModalDisplayer from "./ModalDisplayer";
import loginInfoSelector from "../selectors/loginInfo";
import navigationSelector from "../selectors/navigationSelector";

const Layout = (props) => (
    <ThemeProvider theme={theme}>
        <SnackbarProvider dense={useBelowBreakpoint("sm")}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <TopBar />
                <Toolbar />
                <Grid container wrap="nowrap">
                    {props.loggedIn ? (
                        <Grid item>
                            <SideMenu />
                        </Grid>
                    ) : null}
                    <Grid item xs container justify="center" style={{ padding: 30 }}>
                        <Grid item xs md={10} xl={8}>
                            {props.children}
                        </Grid>
                    </Grid>
                </Grid>
                <ModalDisplayer modal={props.modal} />
            </MuiPickersUtilsProvider>
        </SnackbarProvider>
    </ThemeProvider>
);

const mapStateToProps = (state) => ({
    modal: navigationSelector(state).modal,
    loggedIn: loginInfoSelector(state).loggedIn,
});

export default connect(mapStateToProps, null)(Layout);
