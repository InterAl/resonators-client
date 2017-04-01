import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/followersActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';

class FreezeFollowerPrompt extends Component {
    constructor() {
        super();

        this.handleFreezeClick = this.handleFreezeClick.bind(this);
    }

    handleFreezeClick() {
        this.props.freezeFollower(this.props.follower.id);
    }

    render() {
        if (!this.props.follower) return null;

        let {follower: {user: {name}}} = this.props;

        return (
            <SimplePrompt
                title='Freeze Follower'
                acceptText='Freeze'
                text={[<div>
                    {`Freeze ${name}?`}
                </div>,
                <br/>,
                <div>
                    You will no longer see him in your followers list (by default), and no resonators will be sent to him.
                </div>]}
                onAccept={this.handleFreezeClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
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
        freezeFollower: actions.freeze
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FreezeFollowerPrompt);
