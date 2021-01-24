import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/invitationsActions';
import SimplePrompt from './SimplePrompt';
import navigationInfoSelector from "../selectors/navigationSelector";
import _ from "lodash";

class DeleteInvitationPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.deleteInvitation(this.props.invitationId);
    }

    render() {
        if (!this.props.invitationId) return null;

        return (
            <SimplePrompt
                className='delete-follower-modal'
                title='Delete invitation?'
                acceptText='Delete'
                text=''
                onAccept={this.handleRemoveClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let {modalProps: {invitationId}} = navigationInfoSelector(state);
    let invitation = _.find(state.invitations.invitations, i => i.id === invitationId);

    return {
        invitation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteInvitation: actions.delete
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteInvitationPrompt);
