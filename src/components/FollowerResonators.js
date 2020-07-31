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
import MoreOptionsMenu from "./MoreOptionsMenu";
import { MenuItem, Typography } from "@material-ui/core";

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
                        color: resonator.pop_email === false ? "grey" : "",
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
            left: <Typography variant="h6">{`${this.props.follower.user.name}'s Resonators`}</Typography>,
            right: (
                <MoreOptionsMenu>
                    <MenuItem onClick={this.toggleShowInactive}>
                        {this.state.showDisabled ? "Hide Inactive Resonators" : "Show Inactive Resonators"}
                    </MenuItem>
                </MoreOptionsMenu>
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

    renderMoreOptionsMenu() {
        return (resonatorId) => {
            let resonator = _.find(this.props.resonators, (r) => r.id === resonatorId);
            if (!resonator) return;

            const freezeUnfreezeMenuItem = resonator.pop_email ? (
                <MenuItem onClick={() => this.handleDeactivateResonator(resonatorId)}>Deactivate</MenuItem>
            ) : (
                <MenuItem onClick={() => this.handleActivateResonator(resonatorId)}>Activate</MenuItem>
            );

            return (
                <MoreOptionsMenu key="more" className="more-options-btn">
                    {freezeUnfreezeMenuItem}
                </MoreOptionsMenu>
            );
        };
    }

    render() {
        let rows = this.getRows();
        let header = this.getHeader();
        let addRoute = `/followers/${this.props.match.params.followerId}/resonators/new`;
        let getEditRoute = (id) => `/followers/${this.props.match.params.followerId}/resonators/${id}/edit`;
        let showRoute = (id) => `/followers/${this.props.match.params.followerId}/resonators/${id}/show`;
        let toolbox = this.getToolbox();
        let moreOptionsMenu = this.renderMoreOptionsMenu();

        return (
            <EntityTable
                onAdd={() => this.props.push(addRoute)}
                onEdit={(id) => this.props.push(getEditRoute(id))}
                onRemove={this.handleRemoveResonator}
                onShow={(id) => this.props.push(showRoute(id))}
                addButton={true}
                rowActions={["show", "edit", "remove", moreOptionsMenu]}
                header={header}
                toolbox={toolbox}
                rows={rows}
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
