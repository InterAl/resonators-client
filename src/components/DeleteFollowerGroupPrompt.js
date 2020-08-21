import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../actions/followerGroupsActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';
import { Typography } from '@material-ui/core';

class DeleteFollowerGroupPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.deleteFollowerGroup(this.props.followerGroup.id);
    }

    render() {
        if (!this.props.followerGroup) return null;

        const { followerGroup } = this.props;

        return (
            <SimplePrompt
                className='delete-followerGroup-modal'
                title='Delete Follower Group'
                acceptText='Delete'
                text={
                    <Typography>
                        {`Delete ${followerGroup.group_name}?`}
                        <br />
                        <br />
                        (Note: The group's resonators will be deleted from all members)
                    </Typography>
                }
                onAccept={this.handleRemoveClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let { modalProps: { followerGroupId } } = navigationInfoSelector(state);
    let followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);

    return {
        followerGroup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteFollowerGroup: actions.delete
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFollowerGroupPrompt);
