import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { actions } from "../actions/followersActions";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions as resonatorActions } from "../actions/resonatorActions";
import ResonatorImage from "./ResonatorImage";
import { push } from "connected-react-router";
import * as utils from "./utils";
// import moment from 'moment';
import OverflowMenu from "./OverflowMenu";
import { MenuItem, Typography, Tooltip, IconButton } from "@material-ui/core";
import { RemoveRedEye } from "@material-ui/icons";

class FollowerResonators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDisabled: true,
        };

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
        this.toggleShowInactive = this.toggleShowInactive.bind(this);
    }

    componentDidMount() {
        if (this.props.follower) this.props.fetchFollowerResonators(this.props.follower.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.follower) nextProps.fetchFollowerResonators(nextProps.follower.id);
    }

    getHeader() {
        return ["Resonator"];
    }

    handleRemoveResonator(id) {
        this.props.showDeleteResonatorPrompt(id);
    }

    renderColumn(resonator) {
        const dir = utils.getResonatorDirection(resonator);

        return (
            <div style={{ display: "flex", alignItems: "center", filter: resonator.pop_email ? "" : "grayscale(1)" }}>
                <ResonatorImage width={80} height={80} resonator={resonator} />
                <div
                    style={{
                        direction: dir,
                        margin: "0 15px",
                        textAlign: dir === "rtl" ? "right" : "left",
                        color: resonator.pop_email ? "" : "grey",
                    }}
                >
                    <Typography style={{ fontWeight: "bold" }}>{resonator.title}</Typography>
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
        return {
            left: (
                <Typography variant="h6">
                    {`${this.props.follower && this.props.follower.user.name}'s Resonators`}
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
        const followerId = resonator.follower_id;
        this.props.activateResonator({ followerId, resonator });
    }

    handleDeactivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = false;
        const followerId = resonator.follower_id;
        this.props.activateResonator({ followerId, resonator });
    }

    renderOverflowMenu() {
        return (resonatorId) => {
            let resonator = _.find(this.props.resonators, (r) => r.id === resonatorId);
            if (!resonator) return;

            const freezeUnfreezeMenuItem = resonator.pop_email ? (
                <MenuItem onClick={() => this.handleDeactivateResonator(resonatorId)}>Deactivate</MenuItem>
            ) : (
                <MenuItem onClick={() => this.handleActivateResonator(resonatorId)}>Activate</MenuItem>
            );

            return <OverflowMenu key="more">{freezeUnfreezeMenuItem}</OverflowMenu>;
        };
    }

    renderPreviewAction(resonatorId) {
        return (
            <Tooltip title="Preview" key="preview">
                <IconButton onClick={() => this.props.push(this.getPreviewRoute(resonatorId))}>
                    <RemoveRedEye />
                </IconButton>
            </Tooltip>
        );
    }

    getPreviewRoute(resonatorId) {
        return `/followers/${this.props.match.params.followerId}/resonators/${resonatorId}/show`;
    }

    render() {
        const addRoute = `/followers/${this.props.match.params.followerId}/resonators/new`;
        const getEditRoute = (id) => `/followers/${this.props.match.params.followerId}/resonators/${id}/edit`;

        return (
            <EntityTable
                onAdd={() => this.props.push(addRoute)}
                onEdit={(id) => this.props.push(getEditRoute(id))}
                onRemove={this.handleRemoveResonator}
                addButton={true}
                rowActions={[this.renderPreviewAction.bind(this), "edit", "remove", this.renderOverflowMenu()]}
                header={this.getHeader()}
                toolbox={this.getToolbox()}
                rows={this.getRows()}
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

    let follower = _.find(state.followers.followers, (f) => f.id === followerId);

    return {
        resonators: _.get(follower, "resonators"),
        follower,
    };
}

function mapDispatchToProps(dispatch /* {params: {followerId}} */) {
    return bindActionCreators(
        {
            fetchFollowerResonators: actions.fetchFollowerResonators,
            activateResonator: resonatorActions.activate,
            showDeleteResonatorPrompt: (resonatorId) =>
                navigationActions.showModal({
                    name: "deleteResonator",
                    props: {
                        resonatorId,
                    },
                }),

            push,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
