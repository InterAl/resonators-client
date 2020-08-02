import React from 'react';
import { connect } from "react-redux";
import { Menu } from "@material-ui/icons";
import { bindActionCreators } from "redux";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";

import isMobile from "./isMobile";
import HeaderLogo from "./HeaderLogo";
import renderBreadcrumbs from "./breadcrumbs";
import { actions } from "../actions/menuActions";
import navigationSelector from "../selectors/navigationSelector";

function TopBar(props) {
    return (
        <AppBar>
            <Toolbar>
                {props.navigationInfo.showHamburger ? (
                    <IconButton onClick={props.toggleMenu} color="inherit" edge="start">
                        <Menu />
                    </IconButton>
                ) : null}
                {props.breadcrumbs}
                {isMobile() ? null : <HeaderLogo />}
            </Toolbar>
        </AppBar>
    );
}

export default connect(
    (state) => ({
        navigationInfo: navigationSelector(state),
        breadcrumbs: renderBreadcrumbs(state),
    }),
    (dispatch) => bindActionCreators({ toggleMenu: actions.toggleMenu }, dispatch)
)(TopBar);
