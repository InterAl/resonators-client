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
    MenuItem
} from "@material-ui/core";
import { reduxForm } from "redux-form";
import {bindActionCreators} from "redux";
import {actions as followerGroupsActions} from "actions/followerGroupsActions";
import {actions as resonatorCreationActions} from "actions/resonatorCreationActions";
import {push} from "connected-react-router";

import "./CopyResonatorModal.scss";

class CopyResonatorModal extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleCopyToFollower = this.handleCopyToFollower.bind(this);
        this.handleCopyToGroup = this.handleCopyToGroup.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.selectFollower = this.selectFollower.bind(this);
        this.selectFollowerGroup = this.selectFollowerGroup.bind(this);
        this.cfg = {
            title: "Copy Resonator",
            doneBtn: "Copy",
        };
        this.state = {
            selectedFollower: this.props.followers.find(x => !x.frozen) ? this.props.followers.find(x => !x.frozen).id : false,
            selectedFollowerGroup: this.props.followerGroups.find(x => !x.frozen) ? this.props.followerGroups.find(x => !x.frozen).id : false
        };
    }

    handleClose() {
        this.props.onClose();
    }

    handleCopyToFollower() {
        this.props.copyResonatorTo({
            targetType: 'follower',
            resonatorId: this.props.resonatorId,
            followerId: this.state.selectedFollower
        });
        this.props.onClose();
    }

    handleCopyToGroup() {
        this.props.copyResonatorTo({
            targetType: 'followerGroup',
            resonatorId: this.props.resonatorId,
            groupId: this.state.selectedFollowerGroup
        });
        this.props.onClose();
    }

    selectFollower(event) {
        this.setState({
            selectedFollower: event.target.value
        });
    }

    selectFollowerGroup(event) {
        this.setState({
            selectedFollowerGroup: event.target.value
        });
    }

    renderForm() {
        return (
            <form autoComplete="off">
                <Grid container justify="space-between" alignItems="center" direction="column">
                    <Grid container justify="space-between" alignItems="flex-end" direction="row">
                        <Grid item>
                            <InputLabel id="select_follower-label">To Follower</InputLabel>
                            <Select
                                id="select_follower"
                                labelId="select_follower-label"
                                defaultValue={this.state.selectedFollower}
                                onChange={this.selectFollower}
                            >
                                {this.props.followers.map((follower, i) => !follower.frozen && (
                                    <MenuItem value={follower.id} key={i}>{follower.user.name}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={this.handleCopyToFollower}
                                color="primary"
                                variant="contained"
                                className="create-follower-btn"
                            >
                                {this.cfg.doneBtn}
                            </Button>
                        </Grid>
                    </Grid>
                    {this.props.followerGroups.length > 0 && (
                        <>
                            <Grid item>
                                <p>OR</p>
                            </Grid>
                            <Grid container justify="space-between" alignItems="flex-end" direction="row">
                                <Grid item>
                                    <InputLabel id="select_follower_group-label">To Group</InputLabel>
                                    <Select
                                        id="select_follower_group"
                                        labelId="select_follower_group-label"
                                        defaultValue={this.state.selectedFollowerGroup}
                                        onChange={this.selectFollowerGroup}
                                    >
                                        {this.props.followerGroups.map((group, i) => !group.frozen && (
                                            <MenuItem value={group.id} key={i}>{group.group_name}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={this.handleCopyToGroup}
                                        color="primary"
                                        variant="contained"
                                        className="create-follower-btn"
                                    >
                                        {this.cfg.doneBtn}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className="copy-resonator-modal" onClose={this.props.onClose}>
                <DialogTitle>{this.cfg.title}</DialogTitle>
                <DialogContent color="primary">{this.renderForm()}</DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

let Form = reduxForm({
    form: "copyResonator"
})(CopyResonatorModal);

function mapStateToProps(state) {
    const followers = state.followers.followers;
    const followerGroups = state.followerGroups.followerGroups;

    return {
        followers,
        followerGroups,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        copyResonatorTo: resonatorCreationActions.copyTo,
        fetchFollowerGroupMembers: followerGroupsActions.fetchFollowerGroupMembers,
        push,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
