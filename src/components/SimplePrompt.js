import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


export default class SimplePrompt extends Component {
    static propTypes = {
        onAccept: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        acceptText: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        className: PropTypes.string
    }

    constructor() {
        super();

        this.handleAcceptClick = this.handleAcceptClick.bind(this);
    }

    handleAcceptClick() {
        this.props.onClose(this.props.onAccept);
    }

    renderModalButtons() {
        return [
            <Button
                onClick={this.props.onClose}
                color="primary"
                keyboardFocused={true}>
                Cancel
            </Button>,
            <Button
                onClick={this.handleAcceptClick}
                color="primary"
                variant="contained"
                className='confirmBtn'>
                {this.props.acceptText}
            </Button>
        ];
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                className={this.props.className}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>{this.props.text}</DialogContent>
                <DialogActions>{this.renderModalButtons()}</DialogActions>
            </Dialog>
        );
    }
}
