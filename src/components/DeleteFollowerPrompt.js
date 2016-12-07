import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/followersActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class DeleteFollowerPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.onClose(() => this.props.deleteFollower(this.props.follower.id))
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
        if (!this.props.follower) return null;

        let {follower: {user: {name}}} = this.props;

        return (
            <Dialog
                open={this.props.open}
                title='Delete Follower'
                modal={false}
                actions={this.renderModalButtons()}
                onRequestClose={this.props.onClose}
            >
                {`Delete ${name}?`}
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    let {modalProps: {followerId}} = navigationInfoSelector(state);
    let follower = _.find(state.followers.followers, f => f.id === followerId);

    return {
        follower
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteFollower: actions.delete
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFollowerPrompt);
