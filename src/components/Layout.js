import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as followersActions } from '../actions/followersActions';
import { MuiThemeProvider, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import SideMenu from './SideMenu';
import ModalDisplayer from './ModalDisplayer';
import navigationSelector from '../selectors/navigationSelector';
import { actions as menuActions } from '../actions/menuActions';
import { withRouter } from 'react-router';
import HeaderLogo from './HeaderLogo';
import renderBreadcrumbs from './routes/breadcrumbs';
import isMobile from './isMobile';
import classNames from 'classnames';
import './app.scss';


class Layout extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className='mainContainer'>
                    <AppBar>
                        <Toolbar>
                            {this.props.navigationInfo.showHamburger}
                                ? <IconButton onClick={this.props.toggleMenu} edge="start"><Menu /></IconButton>
                                : {null}
                            <Typography variant="h1" style={{ flexGrow: 1 }}>{this.props.breadcrumbs}</Typography>
                            <HeaderLogo style={{ margin: 'auto', display: isMobile() ? 'none' : 'block' }} />
                        </Toolbar>
                    </AppBar>
                    <SideMenu />
                    <div className={classNames('screenWrapper', {
                        menuClosed: !this.props.navigationInfo.menuOpen
                    })}>
                        {this.props.children}
                        <ModalDisplayer modal={this.props.navigationInfo.modal} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(connect(state => ({
    navigationInfo: navigationSelector(state),
    breadcrumbs: renderBreadcrumbs(state)
}), dispatch => bindActionCreators({
    toggleMenu: menuActions.toggleMenu,
    fetchFollowerResonators: followersActions.fetchFollowerResonators
}, dispatch))(Layout));
