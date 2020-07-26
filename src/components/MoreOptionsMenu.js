import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IconButton, Menu } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

class MoreOptionsMenu extends Component {
    static propTypes = {
        onBlur: PropTypes.func,
        className: PropTypes.string
    }

    static defaultProps = {
        onBlur: _.noop
    }

    constructor(props) {
        super(props);
        this.state = {
            menuAnchor: null
        }
    }

    openMenu(event) {
        this.setState({ menuAnchor: event.currentTarget })
    }

    closeMenu(event) {
        this.setState({ menuAnchor: null })
    }

    render() {
        return (
            <div>
                <IconButton onClick={this.openMenu}>
                    <MoreVert />
                </IconButton>
                <Menu
                    keepMounted
                    anchorEl={this.state.menuAnchor}
                    open={Boolean(this.state.menuAnchor)}
                    onClose={this.closeMenu}
                    {..._.omit(this.props, 'children')}>
                    {this.props.children}
                </Menu>
            </div>
        );
    }
}

export default MoreOptionsMenu;
