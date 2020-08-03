import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../actions/followersActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as navigationActions } from "../actions/navigationActions";
import followersSelector from "../selectors/followersSelector";
import { MenuItem, Select, InputLabel, Link as MuiLink, Typography } from "@material-ui/core";
import { PlayCircleFilled, PauseCircleFilled } from "@material-ui/icons";
import EntityTable from "./EntityTable";
import { rowAction } from "./RowActions";
import { Link } from "react-router-dom";
import OverflowMenu from "./OverflowMenu";

class Followers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false,
            openedOverflowMenuFollowerId: null,
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectFollower = this.handleSelectFollower.bind(this);
        this.handleEditFollower = this.handleEditFollower.bind(this);
        this.handleRemoveFollower = this.handleRemoveFollower.bind(this);
        this.handleAddFollower = this.handleAddFollower.bind(this);
        this.handleFreezeFollower = this.handleFreezeFollower.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    handleSelectFollower(followerId) {
        this.props.selectFollower(followerId);
    }

    handleAddFollower() {
        this.props.showCreateFollowerModal();
    }

    handleEditFollower(id) {
        this.props.showEditFollowerModal(id);
    }

    handleRemoveFollower(id) {
        this.props.showDeleteFollowerPrompt(id);
    }

    handleFreezeFollower(id) {
        this.props.showFreezeFollowerPrompt(id);
    }

    toggleOverflowMenu(followerId) {
        if (!followerId && !this.state.openedOverflowMenuFollowerId) return; //prevent stack overflow

        this.setState({
            openedOverflowMenuFollowerId: followerId,
        });
    }

    toggleShowEmails() {
        this.setState({ showEmails: !this.state.showEmails });
    }

    renderClinicFilter() {
        return [
            <InputLabel id="clinic-filter-label">Clinic</InputLabel>,
            <Select
                labelId="clinic-filter-label"
                value={this.props.clinicIdFilter}
                onChange={this.handleClinicFilterChange}
            >
                <MenuItem value="all">All</MenuItem>
                {this.props.clinics.map((clinic, i) => (
                    <MenuItem value={clinic.id} key={i}>
                        {clinic.name}
                    </MenuItem>
                ))}
            </Select>,
        ];
    }

    getHeader() {
        const header = [];
        header.push("Name");
        this.state.showEmails && header.push("Email");
        header.push("Clinic");
        return header;
    }

    getRows() {
        return _.reduce(
            this.props.followers,
            (acc, f) => {
                let cols = [];
                cols.push(
                    <MuiLink
                        to={`/followers/${f.id}/resonators`}
                        component={Link}
                        style={{
                            color: f.frozen ? "rgb(157, 155, 155)" : "",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {f.frozen ? <PauseCircleFilled fontSize="small" style={{ marginRight: 5 }} /> : null}
                        <span>{f.user.name}</span>
                    </MuiLink>
                );
                this.state.showEmails && cols.push(f.user.email);
                cols.push(f.clinicName);
                acc[f.id] = cols;
                return acc;
            },
            {}
        );
    }

    getToolbox() {
        return {
            left: <Typography variant="h6">Your Followers</Typography>,
            right: (
                <OverflowMenu keepOpen>
                    <MenuItem onClick={() => this.toggleShowEmails()}>
                        {this.state.showEmails ? "Hide Emails" : "Show Emails"}
                    </MenuItem>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                        {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                    </MenuItem>
                </OverflowMenu>
            ),
        };
    }

    renderOverflowMenu() {
        return (followerId) => {
            const follower = this.props.getFollower(followerId);
            return (
                <OverflowMenu key="more-options">
                    {follower.frozen ? (
                        <MenuItem onClick={() => this.props.unfreezeFollower(followerId)}>Activate</MenuItem>
                    ) : (
                        <MenuItem onClick={() => this.handleFreezeFollower(followerId)}>Deactivate</MenuItem>
                    )}
                </OverflowMenu>
            );
        };
    }

    getRowActions() {
        return [rowAction.edit(this.handleEditFollower), rowAction.remove(this.handleRemoveFollower)];
    }

    getExtraRowActions() {
        return [
            rowAction({
                title: "Activate",
                icon: <PlayCircleFilled />,
                onClick: this.props.unfreezeFollower,
                isAvailable: (followerId) => this.props.getFollower(followerId).frozen,
            }),
            rowAction({
                title: "Deactivate",
                icon: <PauseCircleFilled />,
                onClick: this.handleFreezeFollower,
                isAvailable: (followerId) => !this.props.getFollower(followerId).frozen,
            }),
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
                extraRowActions={this.getExtraRowActions()}
                onAdd={this.handleAddFollower}
                className="followers"
            />
        );
    }
}

function mapStateToProps(state) {
    let followersData = followersSelector(state);

    return {
        ...followersData,
        getFollower: (followerId) => _.find(followersData.followers, (f) => f.id === followerId),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            editFollower: actions.edit,
            unfreezeFollower: actions.unfreeze,
            filterByClinicId: actions.filterByClinicId,
            toggleDisplayFrozen: actions.toggleDisplayFrozen,
            showEditFollowerModal: (followerId) =>
                navigationActions.showModal({
                    name: "editFollower",
                    props: {
                        followerId,
                        editMode: true,
                    },
                }),
            showCreateFollowerModal: () =>
                navigationActions.showModal({
                    name: "editFollower",
                    props: {
                        editMode: false,
                    },
                }),
            showDeleteFollowerPrompt: (followerId) =>
                navigationActions.showModal({
                    name: "deleteFollower",
                    props: {
                        followerId,
                    },
                }),
            showFreezeFollowerPrompt: (followerId) =>
                navigationActions.showModal({
                    name: "freezeFollower",
                    props: {
                        followerId,
                    },
                }),
            selectFollower: actions.selectFollower,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Followers);
