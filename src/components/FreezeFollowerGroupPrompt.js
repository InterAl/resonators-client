import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/followerGroupsActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';

class FreezeFollowerGroupPrompt extends Component {
    constructor() {
        super();

        this.handleFreezeClick = this.handleFreezeClick.bind(this);
    }

    handleFreezeClick() {
        this.props.freezeFollowerGroup(this.props.followerGroup.id);
    }

    render() {
        if (!this.props.followerGroup) return null;

        const {followerGroup} = this.props;

        return (
            <SimplePrompt
                title='Deactivate Follower Group'
                acceptText='Confirm'
                text={
                <div>
                    {`${followerGroup.group_name}'s members will no longer receive Resonators assigned by you. Continue?`}
                    <br/>
                    <br/>
                    (Note: inactive follower groups can be filtered in/out at the top of this page)
                </div>}
                onAccept={this.handleFreezeClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let {modalProps: {followerGroupId}} = navigationInfoSelector(state);
    let followerGroup = _.find(state.followerGroups.followerGroups, f => f.id === followerGroupId);

    return {
        followerGroup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        freezeFollowerGroup: actions.freeze
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FreezeFollowerGroupPrompt);
