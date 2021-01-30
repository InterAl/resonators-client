import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Select,
    InputLabel,
    MenuItem,
    Snackbar
} from "@material-ui/core";
import { reduxForm } from "redux-form";
import navigationInfoSelector from "../../selectors/navigationSelector";
import {bindActionCreators} from "redux";
import {actions as followerGroupsActions} from "actions/followerGroupsActions";
import {push} from "connected-react-router";
import Cookies from 'js-cookie';

import "../EditFollowerModal.scss";

class EditFollowerModal extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.inviteGmail = this.inviteGmail.bind(this);
        this.copyInvitation = this.copyInvitation.bind(this);
        this.selectInvitation = this.selectInvitation.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.cfg = {
            title: "Invite Follower",
            doneBtn: "Send With GMail",
        };
        this.state = {
            invitation: this.props.invitations.length ? this.props.invitations[0] : null,
            snackbarCopyInvitationState: false
        }
    }

    componentWillMount() {
        if (this.props.followerGroup)
            this.props.fetchFollowerGroupMembers(this.props.followerGroup.id);
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit() {
        const email = this.props.follower ? this.props.follower.user.email : "";
        this.inviteGmail(email);
        this.props.onClose();
    }

    inviteGmail(email) {
        const emails = this.props.members ? this.props.members.map(m => _.find(this.props.followers, (f) => f.id === m.id).user.email).join(',') : "";
        const subject = encodeURIComponent(this.state.invitation.subject);
        const body = encodeURIComponent(this.state.invitation.body);
        window.open("https://mail.google.com/mail/u/0/?view=cm&fs=1&to="+email+"&su="+subject+"&body="+body+"&tf=1&bcc="+emails, "_blank");
    }

    copyInvitation() {
        if (navigator) {
            navigator.clipboard.writeText(this.state.invitation.body).then(() => {
                this.setState({snackbarCopyInvitationState: true})
            }, (err) => {
                window.prompt("Copy to clipboard: Ctrl+C, Enter", this.state.invitation.body);
            });
        } else {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", this.state.invitation.body);
        }
    }

    selectInvitation(event) {
        this.setState({ invitation: this.props.invitations.find(x => x.id === event.target.value)});
    }

    renderForm() {
        return (
            <form autoComplete="off">

                {!this.props.editMode && (
                    <div>
                        {this.props.invitations.length > 0 && (
                            <Grid container justify="space-between" alignItems="center" direction="column" id="inviteGmail">
                                <Grid item>
                                    <InputLabel id="select_invitation-label">Invitation Template</InputLabel>
                                    <Select
                                        id="select_invitation"
                                        labelId="select_invitation-label"
                                        defaultValue={Cookies.get('defaultInvitation') ? Cookies.get('defaultInvitation') : this.props.invitations[0].id}
                                        style={{ width: "100%", marginBottom: "20px" }}
                                        onChange={this.selectInvitation}
                                    >
                                        {this.props.invitations.map((invitation, i) => (
                                            <MenuItem value={invitation.id} key={i}>
                                                {invitation.title ? invitation.title : invitation.subject}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <Button component="span" variant="contained" onClick={this.copyInvitation}>Copy Invitation</Button>
                                    <Snackbar
                                        open={this.state.snackbarCopyInvitationState}
                                        onClose={() => this.setState({snackbarCopyInvitationState: false})}
                                        autoHideDuration={1000}
                                        message="Copied to clipboard!"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </div>
                )}
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className="edit-follower-modal" onClose={this.props.onClose}>
                <DialogTitle>{this.cfg.title}</DialogTitle>
                <DialogContent>{this.renderForm()}</DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={this.handleSubmit}
                        color="primary"
                        variant="contained"
                        className="create-follower-btn"
                    >
                        {this.cfg.doneBtn}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

let Form = reduxForm({
    form: "inviteFollower"
})(EditFollowerModal);

function mapStateToProps(state) {
    const {
        modalProps: { followerId, followerGroupId },
    } = navigationInfoSelector(state);

    const follower = followerId ? _.find(state.followers.followers, (f) => f.id === followerId) : null;
    const followers = state.followers.followers;
    const invitations = state.invitations.invitations;

    const followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);
    const members = _.get(followerGroup, 'members');

    return {
        follower,
        followers,
        followerGroup,
        members,
        invitations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchFollowerGroupMembers: followerGroupsActions.fetchFollowerGroupMembers,
        push,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
