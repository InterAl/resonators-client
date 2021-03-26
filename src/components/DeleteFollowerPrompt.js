import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/followersActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';

class DeleteFollowerPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.deleteFollower(this.props.follower.id);
    }

    render() {
        if (!this.props.follower) return null;

        let {follower: {user: {name}}} = this.props;

        return (
            <SimplePrompt
                className='delete-follower-modal'
                title='Delete Follower'
                acceptText='Delete'
                text={`Delete ${name}?`}
                onAccept={this.handleRemoveClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let {modalProps: {followerId}} = navigationInfoSelector(state);
    let follower = _.find(state.followers.followers, f => f.id === followerId) || _.find(state.followers.systemFollowers, f => f.id === followerId);

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
