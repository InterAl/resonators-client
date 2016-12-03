import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/menuActions';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
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
        toggleMenu: actions.toggleMenu
    }, dispatch))(SideMenu);
