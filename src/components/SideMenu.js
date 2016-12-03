import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/menuActions';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import FollowerIcon from 'material-ui/svg-icons/maps/directions-walk';
import ClinicIcon from 'material-ui/svg-icons/content/weekend';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';
import navigationInfoSelector from '../selectors/navigationSelector';
import './SideMenu.css';

class SideMenu extends Component {
    render() {
        return (
            <Drawer
                open={this.props.navigationInfo.menuOpen}
            >
                <div>
                    <AppBar
                        iconElementLeft={
                            <IconButton onClick={this.props.toggleMenu}>
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                    <List>
                        <ListItem onClick={() => this.props.clickMenuItem('followers')}
                                  primaryText='Followers'
                                  leftIcon={<FollowerIcon/>} />
                        <ListItem onClick={() => this.props.clickMenuItem('clinic')}
                                  primaryText='Clinic'
                                  leftIcon={<ClinicIcon/>}/>
                        <ListItem onClick={() => this.props.clickMenuItem('logout')}
                                  primaryText='Logout'
                                  style={{color: '#ff4444'}}
                                  leftIcon={<LogoutIcon color='#ff4444'/>}/>
                    </List>
                </div>
            </Drawer>
        );
    }
}

export default connect(
    state => ({
        navigationInfo: navigationInfoSelector(state)
    }),
    dispatch => bindActionCreators({
        toggleMenu: actions.toggleMenu,
        clickMenuItem: actions.clickMenuItem
    }, dispatch))(SideMenu);
