import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../actions/followerGroupsActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as navigationActions } from "../actions/navigationActions";
import followerGroupsSelector from '../selectors/followerGroupsSelector';
import { MenuItem, Select, InputLabel, Link as MuiLink, Typography } from "@material-ui/core";
import { NotInterested } from "@material-ui/icons";
import EntityTable from "./EntityTable";
import { Link } from "react-router-dom";
import MoreOptionsMenu from "./MoreOptionsMenu";
import './FollowerGroups.scss';

class FollowerGroups extends Component {
    constructor() {
        super();

        this.state = {
            openedMoreOptionsMenuFollowerGroupId: null,
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectFollowerGroup = this.handleSelectFollowerGroup.bind(this);
        this.handleEditFollowerGroup = this.handleEditFollowerGroup.bind(this);
        this.handleRemoveFollowerGroup = this.handleRemoveFollowerGroup.bind(this);
        this.handleAddFollowerGroup = this.handleAddFollowerGroup.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    handleSelectFollowerGroup(followerGroupId) {
        this.props.selectFollowerGroup(followerGroupId);
    }

    handleAddFollowerGroup() {
        this.props.showCreateFollowerGroupModal();
    }

    handleEditFollowerGroup(id) {
        this.props.showEditFollowerGroupModal(id);
    }

    handleRemoveFollowerGroup(id) {
        this.props.showDeleteFollowerGroupPrompt(id);
    }

    handleFreezeFollowerGroup(id) {
        this.props.showFreezeFollowerGroupPrompt(id);
    }

    toggleMoreOptionsMenu(followerGroupId) {
        if (!followerGroupId && !this.state.openedMoreOptionsMenuFollowerGroupId)
            return; //prevent stack overflow

        this.setState({
            openedMoreOptionsMenuFollowerGroupId: followerGroupId,
        });
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
        return ['Name', 'Clinic'];
    }

    getRows() {
        return _.reduce(this.props.followerGroups, (acc, fg) => {
            const cols = [
                <MuiLink
                    to={`/followerGroups/${fg.id}/resonators`}
                    component={Link}
                    style={{
                        color: fg.frozen ? 'rgb(157, 155, 155)' : '',
                        display: "flex",
                        alignItems: "center",
                    }}>
                    {fg.frozen && <NotInterested fontSize="small" style={{ marginRight: 5 }} />}
                    <span>{fg.group_name}</span>
                </MuiLink>,
                fg.clinicName,
            ];
            acc[fg.id] = cols;
            return acc;
        }, {});
    }

    getToolbox() {
        return {
            left: <Typography variant="h6">Your Follower Groups</Typography>,
            right: (
                <MoreOptionsMenu>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                        {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                    </MenuItem>
                </MoreOptionsMenu>
            ),
        };
    }

    renderMoreOptionsMenu() {
        return (followerGroupId) => {
            const followerGroup = this.props.getFollowerGroup(followerGroupId);

            const freezeUnfreezeMenuItem = followerGroup.frozen ? (
                <MenuItem onClick={() => this.props.unfreezeFollowerGroup(followerGroupId)}>Activate</MenuItem>
            ) : (
                <MenuItem onClick={() => this.props.handleFreezeFollowerGroup(followerGroupId)}>Deactivate</MenuItem>
            );

            return (
                <MoreOptionsMenu className='more-options-btn' key="more-options">
                    <MenuItem className="edit-followerGroup-btn" onClick={() => this.handleEditFollowerGroup(followerGroupId)}>
                        Edit
                    </MenuItem>
                    {freezeUnfreezeMenuItem}
                    <MenuItem
                        className="delete-followerGroup-btn"
                        onClick={() => this.handleRemoveFollowerGroup(followerGroupId)}
                        style={{ color: "red" }}>
                        Delete
                    </MenuItem>
                </MoreOptionsMenu>
            );
        }
    }

    render() {
        const header = this.getHeader();
        const rows = this.getRows();
        const toolbox = this.getToolbox();
        const moreOptionsMenu = this.renderMoreOptionsMenu();

        return (
            <EntityTable
                header={header}
                rows={rows}
                toolbox={toolbox}
                addButton={true}
                rowActions={[moreOptionsMenu]}
                className="followerGroups"
                onAdd={this.handleAddFollowerGroup}
            />
        );
    }
}

function mapStateToProps(state) {
    const followerGroupsData = followerGroupsSelector(state);

    return {
        ...followerGroupsData,
        getFollowerGroup: followerGroupId => _.find(followerGroupsData.followerGroups, (fg) => fg.id === followerGroupId)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editFollowerGroup: actions.edit,
        unfreezeFollowerGroup: actions.unfreeze,
        filterByClinicId: actions.filterByClinicId,
        toggleDisplayFrozen: actions.toggleDisplayFrozen,
        showEditFollowerGroupModal: (followerGroupId) => navigationActions.showModal({
            name: 'editFollowerGroup',
            props: {
                followerGroupId,
                editMode: true
            }
        }),
        showCreateFollowerGroupModal: () => navigationActions.showModal({
            name: 'editFollowerGroup',
            props: {
                editMode: false
            }
        }),
        showDeleteFollowerGroupPrompt: (followerGroupId) => navigationActions.showModal({
            name: 'deleteFollowerGroup',
            props: {
                followerGroupId
            }
        }),
        showFreezeFollowerGroupPrompt: followerGroupId => navigationActions.showModal({
            name: 'freezeFollowerGroup',
            props: {
                followerGroupId
            }
        }),
        selectFollowerGroup: actions.selectFollowerGroup,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(FollowerGroups);
