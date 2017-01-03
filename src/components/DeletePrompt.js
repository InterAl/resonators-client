import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/followersActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class DeletePrompt extends Component {
    static propTypes: {
        onDelete: React.PropTypes.func.isRequired,
        text: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired
    }

    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.onClose(this.props.onDelete);
    }

    renderModalButtons() {
        return [
            <FlatButton
                onTouchTap={this.props.onClose}
                label="Cancel"
                primary={true}
            />,
            <FlatButton
                onTouchTap={this.handleRemoveClick}
                label="Remove"
                primary={true}
                keyboardFocused={true}
            />
        ];
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                title={this.props.title}
                modal={false}
                actions={this.renderModalButtons()}
                onRequestClose={this.props.onClose}
            >
                {this.props.text}
            </Dialog>
        );
    }
}
