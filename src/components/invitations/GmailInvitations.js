import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../../actions/invitationsActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as navigationActions } from "../../actions/navigationActions";
import invitationsSelector from "../../selectors/invitationsSelector";
import { Typography } from "@material-ui/core";
import EntityTable from "../EntityTable";
import { rowAction } from "../RowActions";
import { Edit, Delete, Done, DoneAll} from "@material-ui/icons";
import Cookies from 'js-cookie';

class GmailInvitations extends Component {
    constructor() {
        super();

        this.handleEditInvitation = this.handleEditInvitation.bind(this);
        this.handleRemoveInvitation = this.handleRemoveInvitation.bind(this);
        this.handleAddInvitation = this.handleAddInvitation.bind(this);
        this.handleSetDefaultInvitation = this.handleSetDefaultInvitation.bind(this);
        this.state = {
            defaultInvitation: Cookies.get('defaultInvitation') || null
        };
    }

    handleAddInvitation() {
        this.props.showCreateInvitationModal();
    }

    handleEditInvitation(id) {
        this.props.showEditInvitationModal(id);
    }

    handleRemoveInvitation(id) {
        this.props.showDeleteInvitationPrompt(id);
    }

    handleSetDefaultInvitation(id) {
        this.setState({ defaultInvitation: id });
        Cookies.set('defaultInvitation', id);
    }

    getHeader() {
        const header = [];
        header.push("Subject");
        return header;
    }

    getRows() {
        return _.reduce(
            this.props.invitations,
            (acc, f) => {
                let cols = [];
                cols.push(<span>{f.displayTitle ? f.displayTitle : f.subject}</span>);
                acc[f.id] = cols;
                return acc;
            },
            {}
        );
    }

    getToolbox() {
        return {
            left: <Typography variant="h6">GMail Invitation Templates</Typography>
        };
    }

    getRowActions() {
        return [
            rowAction({
                title: "Edit",
                icon: <Edit />,
                onClick: this.handleEditInvitation,
                isAvailable: (invitationId) => !this.props.invitations.find(i => i.id === invitationId).system
            }),
            rowAction({
                title: "Remove",
                icon: <Delete />,
                onClick: this.handleRemoveInvitation,
                isAvailable: (invitationId) => !this.props.invitations.find(i => i.id === invitationId).system
            }),
            rowAction({
                title: (invitationId) => (this.state.defaultInvitation === invitationId) ? "Default" : "Make Default",
                icon: (invitationId) => (this.state.defaultInvitation === invitationId) ? <DoneAll color="primary"/> : <Done />,
                onClick: this.handleSetDefaultInvitation,
            })
        ];
    }

    render() {
        return (
            <EntityTable
                addButton={true}
                rows={this.getRows()}
                header={this.getHeader()}
                toolbox={this.getToolbox()}
                rowActions={this.getRowActions()}
                onAdd={this.handleAddInvitation}
                className="invitations"
                addText="Add Invitation"
            />
        );
    }
}

function mapStateToProps(state) {
    return invitationsSelector(state);
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            editInvitation: actions.edit,
            showEditInvitationModal: (invitationId) =>
                navigationActions.showModal({
                    name: "editInvitation",
                    props: {
                        invitationId,
                        editMode: true,
                    },
                }),
            showCreateInvitationModal: () =>
                navigationActions.showModal({
                    name: "editInvitation",
                    props: {
                        editMode: false,
                    },
                }),
            showDeleteInvitationPrompt: (invitationId) =>
                navigationActions.showModal({
                    name: "deleteInvitation",
                    props: {
                        invitationId,
                    },
                }),
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(GmailInvitations);
