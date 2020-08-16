import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { rowAction } from './RowActions';
import { actions } from "../actions/followerGroupsActions";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions as resonatorActions } from "../actions/resonatorActions";
import { push } from "connected-react-router";
import * as utils from "./utils";
import OverflowMenu from "./OverflowMenu";
import getResonatorImage from "../selectors/getResonatorImage";
import { MenuItem, Typography, Avatar } from "@material-ui/core";
import { RemoveRedEye, PauseCircleFilled, PlayCircleFilled } from "@material-ui/icons";

class FollowerGroupResonators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDisabled: true,
        };

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
        this.toggleShowInactive = this.toggleShowInactive.bind(this);
        this.handleActivateResonator = this.handleActivateResonator.bind(this);
        this.handleDeactivateResonator = this.handleDeactivateResonator.bind(this);
    }

    componentDidMount() {
        if (this.props.followerGroup) this.props.fetchFollowerGroupResonators(this.props.followerGroup.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.followerGroup && this.props.followerGroup && nextProps.followerGroup.id !== this.props.followerGroup.id)
            nextProps.fetchFollowerGroupResonators(nextProps.followerGroup.id);
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
                    <Typography color="textSecondary">{_.truncate(resonator.content, { length: 50 })}</Typography>
                </div>
            </div>
        );
    }

    getRows() {
        const orderedResonators = _.orderBy(this.props.resonators, (r) => !r.pop_email);
        return _.reduce(
            orderedResonators,
            (acc, r) => {
                if ((this.state.showDisabled && !r.pop_email) || r.pop_email)
                    acc[r.id] = [this.renderColumn(r)];

                return acc;
            },
            {}
        );
    }

    toggleShowInactive() {
        this.setState({ showDisabled: !this.state.showDisabled });
    }
    getToolbox() {
        return {
            left: (
                <Typography variant="h6">
                    {`${this.props.followerGroup && this.props.followerGroup.group_name}'s Resonators`}
                </Typography>
            ),
            right: (
                <OverflowMenu keepOpen>
                    <MenuItem onClick={this.toggleShowInactive}>
                        {this.state.showDisabled ? "Hide Inactive Resonators" : "Show Inactive Resonators"}
                    </MenuItem>
                </OverflowMenu>
            ),
        };
    }

    handleActivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = true;
        const followerGroupId = resonator.follower_group_id;
        this.props.activateResonator({ targetId: followerGroupId, targetType: 'followerGroup', resonator });
    }

    handleDeactivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = false;
        const followerGroupId = resonator.follower_group_id;
        this.props.activateResonator({ targetId: followerGroupId, targetType: 'followerGroup', resonator });
    }

    getPreviewRoute(resonatorId) {
        return `/followerGroups/${this.props.match.params.followerGroupId}/resonators/${resonatorId}/show`;
    }

    getEditRoute(resonatorId) {
        return `/followerGroups/${this.props.match.params.followerGroupId}/resonators/${resonatorId}/edit`;
    }

    getAddRoute() {
        return `/followerGroups/${this.props.match.params.followerGroupId}/resonators/new`;
    }

    getRowActions() {
        return [
            rowAction({
                title: "Preview",
                icon: <RemoveRedEye />,
                onClick: (resonatorId) => this.props.push(this.getPreviewRoute(resonatorId)),
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
                icon: <PauseCircleFilled />,
                title: "Deactivate",
                onClick: this.handleDeactivateResonator,
                isAvailable: (resonatorId) => this.getResonator(resonatorId).pop_email,
            }),
            rowAction({
                icon: <PlayCircleFilled />,
                title: "Activate",
                onClick: this.handleActivateResonator,
                isAvailable: (resonatorId) => !this.getResonator(resonatorId).pop_email,
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
                onAdd={() => this.props.push(this.getAddRoute())}
                addText="Create Group Resonator"
            />
        );
    }
}

function mapStateToProps(
    state,
    {
        match: {
            params: { followerGroupId },
        },
    }
) {
    if (!followerGroupId) return {};

    const followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);

    return {
        resonators: _.get(followerGroup, "resonators"),
        followerGroup,
    };
}

function mapDispatchToProps(dispatch /* {params: {followerGroupId}} */) {
    return bindActionCreators({
        fetchFollowerGroupResonators: actions.fetchFollowerGroupResonators,
        activateResonator: resonatorActions.activate,
        showDeleteResonatorPrompt: (resonatorId) =>
            navigationActions.showModal({
                name: "deleteResonator",
                props: {
                    resonatorId,
                    isGroup: true,
                },
            }),

        push,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerGroupResonators);
