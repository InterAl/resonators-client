import React, { Component } from "react";
import { connect } from "react-redux";
import { ThemeProvider, Toolbar } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SideMenu from "./SideMenu";
import TopBar from "./TopBar";
import ModalDisplayer from "./ModalDisplayer";
import navigationSelector from "../selectors/navigationSelector";
import { withRouter } from "react-router";
import classNames from "classnames";
import theme from "./theme";
import "./app.scss";

class Layout extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="main-container">
                        <TopBar />
                        <SideMenu />
                        <div
                            className={classNames("screenWrapper", {
                                menuClosed: !this.props.navigationInfo.menuOpen,
                            })}
                        >
                            <Toolbar /> {/* placeholder to keep the main content below the app bar */}
                            {this.props.children}
                            <ModalDisplayer modal={this.props.navigationInfo.modal} />
                        </div>
                    </div>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({ navigationInfo: navigationSelector(state) });

export default withRouter(connect(mapStateToProps, null)(Layout));
