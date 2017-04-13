import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class SimplePrompt extends Component {
    static propTypes: {
        onAccept: React.PropTypes.func.isRequired,
        text: React.PropTypes.string.isRequired,
        acceptText: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
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
            <FlatButton
                onTouchTap={this.props.onClose}
                label="Cancel"
                primary={true}
                keyboardFocused={true}
            />,
            <FlatButton
                onTouchTap={this.handleAcceptClick}
                label={this.props.acceptText}
                primary={true}
                className='confirmBtn'
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
                className={this.props.className}
            >
                {this.props.text}
            </Dialog>
        );
    }
}
