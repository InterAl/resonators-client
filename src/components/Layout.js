import React, { Component } from "react";
import { connect } from "react-redux";
import { ThemeProvider, Toolbar } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import ModalDisplayer from "./ModalDisplayer";
import loginInfoSelector from "../selectors/loginInfo";
import navigationSelector from "../selectors/navigationSelector";
import { withRouter } from "react-router";
import theme from "./theme";
import "./app.scss";

class Layout extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="main-container">
                        <TopBar />
                        {this.props.loggedIn ? <SideMenu /> : null}
                        <div className="screenWrapper">
                            <Toolbar /> {/* placeholder to keep the main content below the app bar */}
                            {this.props.children}
                            <ModalDisplayer modal={this.props.modal} />
                        </div>
                    </div>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    modal: navigationSelector(state).modal,
    loggedIn: loginInfoSelector(state).loggedIn,
});

export default withRouter(connect(mapStateToProps, null)(Layout));
