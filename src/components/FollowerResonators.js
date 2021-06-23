import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { rowAction } from './RowActions';
import { actions } from "../actions/followersActions";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions as resonatorActions } from "../actions/resonatorActions";
import { push } from "connected-react-router";
import * as utils from "./utils";
// import moment from 'moment';
import OverflowMenu from "./OverflowMenu";
import getResonatorImage from "../selectors/getResonatorImage";
import { MenuItem, Typography, Avatar } from "@material-ui/core";
import { RemoveRedEye, PauseCircleFilled, PlayCircleFilled, Autorenew, Group, FileCopy } from "@material-ui/icons";

class FollowerResonators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDisabled: true,
        };

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
        this.toggleShowInactive = this.toggleShowInactive.bind(this);
        this.handleCopyResonator = this.handleCopyResonator.bind(this);
        this.handleActivateResonator = this.handleActivateResonator.bind(this);
        this.handleDeactivateResonator = this.handleDeactivateResonator.bind(this);
        this.handleResetResonator = this.handleResetResonator.bind(this);
    }

    componentDidMount() {
        if (this.props.follower) this.props.fetchFollowerResonators(this.props.follower.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.follower && this.props.follower && nextProps.follower.id !== this.props.follower.id)
            nextProps.fetchFollowerResonators(nextProps.follower.id);
    }


    getHeader() {
        return ["Resonator"];
    }

    handleRemoveResonator(id) {
        this.props.showDeleteResonatorPrompt(id);
    }

    renderColumn(resonator) {
        const dir = utils.getResonatorDirection(resonator);
        const resonatorImage = getResonatorImage(resonator);

        return (
            <div style={{ display: "flex", alignItems: "center", filter: resonator.pop_email ? "" : "grayscale(1)" }}>
                {resonatorImage ? <Avatar src={resonatorImage} variant="rounded" /> : null}
                <div
                    style={{
                        direction: dir,
                        margin: "0 15px",
                        textAlign: dir === "rtl" ? "right" : "left",
                        color: resonator.pop_email ? "" : "grey",
                    }}
                >
                    <Typography style={{ fontWeight: "bold" }}>{_.truncate(resonator.title, { length: 50 })}</Typography>
                    <Typography color="textSecondary">
                        {_.truncate(
                            _.unescape(resonator.content)
                                .replace(/<[^>]*>?/gm, '')
                                .replace(/&nbsp;/g,' '),
                            { length: 50 })
                        }
                    </Typography>
                </div>
                {resonator.parent_resonator_id ?
                    <Group variant="rounded" fontSize="small" style={{
                        marginLeft: 5,
                        color: resonator.pop_email ? "" : "grey",
                    }} /> :
                    null
                }
            </div>
        );
    }

    getRows() {
        const orderedResonators = _.orderBy(this.props.resonators, (r) => !r.pop_email);
        return _.reduce(
            orderedResonators,
            (acc, r) => {
                if ((this.state.showDisabled && !r.pop_email) || r.pop_email) acc[r.id] = [this.renderColumn(r)];

                return acc;
            },
            {}
        );
    }

    toggleShowInactive() {
        this.setState({ showDisabled: !this.state.showDisabled });
    }
    getToolbox() {
        const toolbox = {};

        toolbox.left = (
            <Typography variant="h6">
                {`${this.props.follower && this.props.follower.user.name}'s Resonators`}
            </Typography>
        );

        if (!this.props.follower?.is_system) {
            toolbox.right = (
                <OverflowMenu keepOpen>
                    <MenuItem onClick={this.toggleShowInactive}>
                        {this.state.showDisabled ? "Hide Inactive Resonators" : "Show Inactive Resonators"}
                    </MenuItem>
                </OverflowMenu>
            );
        }

        return toolbox;
    }

    handleCopyResonator(resonatorId) {
        this.props.showCopyResonatorModal(resonatorId);
    }

    handleActivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = true;
        const followerId = resonator.follower_id;
        this.props.activateResonator({ targetId: followerId, targetType: 'follower', resonator });
    }

    handleDeactivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = false;
        const followerId = resonator.follower_id;
        this.props.activateResonator({ targetId: followerId, targetType: 'follower', resonator });
    }

    handleResetResonator(id) {
        this.props.showResetResonatorPrompt(id);
    }

    getPreviewRoute(resonatorId) {
        return `/followers/${this.props.match.params.followerId}/resonators/${resonatorId}/show`;
    }

    getEditRoute(resonatorId) {
        return `/followers/${this.props.match.params.followerId}/resonators/${resonatorId}/edit`;
    }

    getAddRoute() {
        return `/followers/${this.props.match.params.followerId}/resonators/new`;
    }

    getRowActions() {
        if (this.props.follower?.is_system && !this.props.isAdmin) return [];
        return [
            rowAction({
                title: "Preview",
                icon: <RemoveRedEye />,
                onClick: (resonatorId) => this.props.push(this.getPreviewRoute(resonatorId))
            }),
            rowAction.edit((resonatorId) => this.props.push(this.getEditRoute(resonatorId))),
            rowAction.remove(this.handleRemoveResonator),
        ];
    }

    getResonator(resonatorId) {
        return _.find(this.props.resonators, (resonator) => resonator.id === resonatorId);
    }

    getExtraRowActions() {
        return [
            rowAction({
                icon: <FileCopy />,
                title: "Copy To...",
                onClick: this.handleCopyResonator
            }),
            rowAction({
                icon: <PauseCircleFilled />,
                title: "Deactivate",
                onClick: this.handleDeactivateResonator,
                isAvailable: (resonatorId) => !this.props.follower.is_system && this.getResonator(resonatorId).pop_email,
            }),
            rowAction({
                icon: <PlayCircleFilled />,
                title: "Activate",
                onClick: this.handleActivateResonator,
                isAvailable: (resonatorId) => !this.props.follower.is_system && !this.getResonator(resonatorId).pop_email,
            }),
            rowAction({
                icon: <Autorenew />,
                title: "Reset",
                onClick: this.handleResetResonator,
                isAvailable: (resonatorId) => !this.props.follower.is_system && Boolean(this.getResonator(resonatorId).parent_resonator_id),
            }),
        ];
    }

    render() {
        return (
            <EntityTable
                addButton={(!this.props.follower?.is_system || this.props.isAdmin)}
                rows={this.getRows()}
                header={this.getHeader()}
                toolbox={this.getToolbox()}
                rowActions={this.getRowActions()}
                extraRowActions={this.getExtraRowActions()}
                onAdd={() => this.props.push(this.getAddRoute())}
                addText="Create Resonator"
            />
        );
    }
}

function mapStateToProps(
    state,
    {
        match: {
            params: { followerId },
        },
    }
) {
    if (!followerId) return {};

    const follower = _.find(state.followers.followers, (f) => f.id === followerId) || _.find(state.followers.systemFollowers, (f) => f.id === followerId);
    const isAdmin = state.leaders.leaders.admin_permissions;

    return {
        resonators: _.get(follower, "resonators"),
        follower,
        isAdmin
    };
}

function mapDispatchToProps(dispatch /* {params: {followerId}} */) {
    return bindActionCreators(
        {
            fetchFollowerResonators: actions.fetchFollowerResonators,
            activateResonator: resonatorActions.activate,
            showCopyResonatorModal: (resonatorId) =>
                navigationActions.showModal({
                    name: "copyResonator",
                    props: {
                        resonatorId,
                    },
                }),
            showResetResonatorPrompt: (resonatorId) =>
                navigationActions.showModal({
                    name: "resetResonator",
                    props: {
                        resonatorId,
                    },
                }),
            showDeleteResonatorPrompt: (resonatorId) =>
                navigationActions.showModal({
                    name: "deleteResonator",
                    props: {
                        resonatorId,
                        isGroup: false,
                    },
                }),
            push,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
