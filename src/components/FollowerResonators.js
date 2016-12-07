import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';

class FollowerResonators extends Component {
    render() {
        return (
            <div>
                {this.props.follower.user.name}
            </div>
        );
    }
}

function mapStateToProps(state, {params: {followerId}}) {
    return {
        follower: _.find(state.followers.followers, f => f.id === followerId)
    };
}

function mapDispatchToProps(dispatch, {params: {followerId}}) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
