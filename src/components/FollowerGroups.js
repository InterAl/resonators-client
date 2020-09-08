import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../actions/followerGroupsActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions as statsActions } from '../actions/resonatorStatsActions';
import followerGroupsSelector from '../selectors/followerGroupsSelector';
import { MenuItem, Link as MuiLink, Typography, Badge, withWidth } from "@material-ui/core";
import { NotInterested, Group, PlayCircleFilled, PauseCircleFilled, GetApp } from "@material-ui/icons";
import { rowAction } from './RowActions';
import EntityTable from "./EntityTable";
import { Link } from "react-router-dom";
import OverflowMenu from "./OverflowMenu";
import { push } from "connected-react-router";
import './FollowerGroups.scss';
import { isMobile } from "./utils";

class FollowerGroups extends Component {
    constructor() {
        super();

        this.state = {
            openedOverflowMenuFollowerGroupId: null,
        };

        this.handleSelectFollowerGroup = this.handleSelectFollowerGroup.bind(this);
        this.handleEditFollowerGroup = this.handleEditFollowerGroup.bind(this);
        this.handleRemoveFollowerGroup = this.handleRemoveFollowerGroup.bind(this);
        this.handleAddFollowerGroup = this.handleAddFollowerGroup.bind(this);
        this.handleManageFollowers = this.handleManageFollowers.bind(this);
        this.handleFreezeFollowerGroup = this.handleFreezeFollowerGroup.bind(this);
    }

    handleSelectFollowerGroup(followerGroupId) {
        this.props.selectFollowerGroup(followerGroupId);
    }

    handleAddFollowerGroup() {
        this.props.showCreateFollowerGroupModal();
    }

    handleManageFollowers(followerGroupId) {
        this.props.push(`/followerGroups/${followerGroupId}/members`);
    }

    handleEditFollowerGroup(followerGroupId) {
        this.props.showEditFollowerGroupModal(followerGroupId);
    }

    handleRemoveFollowerGroup(followerGroupId) {
        this.props.showDeleteFollowerGroupPrompt(followerGroupId);
    }

    handleFreezeFollowerGroup(followerGroupId) {
        this.props.showFreezeFollowerGroupPrompt(followerGroupId);
    }

    toggleOverflowMenu(followerGroupId) {
        if (!followerGroupId && !this.state.openedOverflowMenuFollowerGroupId)
            return; //prevent stack overflow

        this.setState({
            openedOverflowMenuFollowerGroupId: followerGroupId,
        });
    }

    getMembersRoute(followerGroupId) {
        return `/followerGroups/${followerGroupId}/members`;
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
                <OverflowMenu>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                        {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                    </MenuItem>
                </OverflowMenu>
            ),
        };
    }

    getRowActions() {
        return [
            rowAction({
                title: "Add/Remove Members",
                icon: (followerGroupId) => (
                    <React.Fragment>
                        <Typography color='primary' style={{ marginRight: !isMobile(this.props.width) && '0.5vw' }}>
                            ({this.props.getFollowerGroup(followerGroupId).memberCount})
                        </Typography>
                        <Group color='primary' />
                    </React.Fragment>
                ),
                onClick: (followerGroupId) => this.props.push(this.getMembersRoute(followerGroupId)),
            }),
            rowAction({
                title: "Download All Stats as CSV",
                icon: <GetApp />,
                onClick: (followerGroupId) => this.props.downloadGroupStats({ followerGroupId }),
            }),
            rowAction.edit(this.handleEditFollowerGroup),
        ];
    }

    getExtraRowActions() {
        return [
            rowAction.remove(this.handleRemoveFollowerGroup),
            rowAction({
                title: "Activate",
                icon: <PlayCircleFilled />,
                onClick: this.props.unfreezeFollowerGroup,
                isAvailable: (followerGroupId) => this.props.getFollowerGroup(followerGroupId).frozen,
            }),
            rowAction({
                title: "Deactivate",
                icon: <PauseCircleFilled />,
                onClick: this.handleFreezeFollowerGroup,
                isAvailable: (followerGroupId) => !this.props.getFollowerGroup(followerGroupId).frozen,
            }),
        ];
    }

    render() {
        return (
            <EntityTable
                header={this.getHeader()}
                rows={this.getRows()}
                toolbox={this.getToolbox()}
                addButton={true}
                rowActions={this.getRowActions()}
                extraRowActions={this.getExtraRowActions()}
                className='followerGroups'
                onAdd={this.handleAddFollowerGroup}
                addText="Create Follower Group"
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
        showFreezeFollowerGroupPrompt: (followerGroupId) => navigationActions.showModal({
            name: 'freezeFollowerGroup',
            props: {
                followerGroupId
            }
        }),
        selectFollowerGroup: actions.selectFollowerGroup,
        downloadGroupStats: statsActions.downloadGroupStats,
        push
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(withWidth()(FollowerGroups));
