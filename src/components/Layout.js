import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as followersActions} from '../actions/followersActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SideMenu from './SideMenu';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import ModalDisplayer from './ModalDisplayer';
import navigationSelector from '../selectors/navigationSelector';
import {actions as menuActions} from '../actions/menuActions';
import './app.css';

class Layout extends Component {
    componentDidUpdate({params: {followerId} = {}}) {
        if (followerId) {
            this.props.fetchFollowerResonators(followerId);
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className='mainContainer'>
                    <AppBar
                      showMenuIconButton={this.props.navigationInfo.showHamburger}
                      iconElementLeft={
                          <IconButton onTouchTap={this.props.toggleMenu}>
                              <Hamburger />
                          </IconButton>
                      }
                      title={this.props.navigationInfo.title}/>
                    <SideMenu />
                    <div className='screenWrapper'>
                        {this.props.children}
                        <ModalDisplayer modal={this.props.navigationInfo.modal} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default connect(state => ({
    navigationInfo: navigationSelector(state)
}), dispatch => bindActionCreators({
    toggleMenu: menuActions.toggleMenu,
    fetchFollowerResonators: followersActions.fetchFollowerResonators
}, dispatch))(Layout);
