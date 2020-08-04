import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { actions } from "../actions/followerGroupsActions";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions as resonatorActions } from "../actions/resonatorActions";
import ResonatorImage from "./ResonatorImage";
import { push } from "connected-react-router";
import * as utils from "./utils";
// import moment from 'moment';
import OverflowMenu from "./OverflowMenu";
import { MenuItem, Typography } from "@material-ui/core";

class FollowerGroupResonators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDisabled: true,
        };

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
        this.toggleShowInactive = this.toggleShowInactive.bind(this);
    }

    componentDidMount() {
        if (this.props.followerGroup)
            this.props.fetchFollowerGroupResonators(this.props.followerGroup.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.followerGroup)
            nextProps.fetchFollowerGroupResonators(nextProps.followerGroup.id);
    }

    getHeader() {
        return ['Resonator'];
    }

    handleRemoveResonator(id) {
        this.props.showDeleteResonatorPrompt(id);
    }

    renderColumn(resonator) {
        const dir = utils.getResonatorDirection(resonator);

        return (
            <div style={{ display: "flex", alignItems: "center", filter: resonator.pop_email ? "" : "grayscale(1)" }}>
                <ResonatorImage width={80} height={80} resonator={resonator} />
                <div style={{
                    direction: dir,
                    margin: "0 15px",
                    textAlign: dir === "rtl" ? "right" : "left",
                    color: resonator.pop_email ? "" : "grey",
                }}>
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
                <OverflowMenu>
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
        this.props.activateGroupResonator({ followerGroupId, resonator });
    }

    handleDeactivateResonator(id) {
        const resonator = _.find(this.props.resonators, (r) => r.id === id);
        resonator.pop_email = false;
        const followerGroupId = resonator.follower_group_id;
        this.props.activateGroupResonator({ followerGroupId, resonator });
    }

    renderOverflowMenu() {
        return (resonatorId) => {
            const resonator = _.find(this.props.resonators, (r) => r.id === resonatorId);
            if (!resonator) return;

            const freezeUnfreezeMenuItem = resonator.pop_email ? (
                <MenuItem onClick={() => this.handleDeactivateResonator(resonatorId)}>Deactivate</MenuItem>
            ) : (
                    <MenuItem onClick={() => this.handleActivateResonator(resonatorId)}>Activate</MenuItem>
                );

            return (
                <OverflowMenu key="more" className="more-options-btn">
                    {freezeUnfreezeMenuItem}
                </OverflowMenu>
            );
        };
    }


    render() {
        const rows = this.getRows();
        const header = this.getHeader();
        const addRoute = `/followerGroups/${this.props.match.params.followerGroupId}/resonators/new`;
        const getEditRoute = (id) => `/followerGroups/${this.props.match.params.followerGroupId}/resonators/${id}/edit`;
        const showRoute = (id) => `/followerGroups/${this.props.match.params.followerGroupId}/resonators/${id}/show`;
        const toolbox = this.getToolbox();
        const overflowMenu = this.renderOverflowMenu();

        return (
            <EntityTable
                onAdd={() => this.props.push(addRoute)}
                onEdit={(id) => this.props.push(getEditRoute(id))}
                onRemove={this.handleRemoveResonator}
                onShow={(id) => this.props.push(showRoute(id))}
                addButton={true}
                rowActions={["show", "edit", "remove", overflowMenu]}
                header={header}
                toolbox={toolbox}
                rows={rows} />
        );
    }
}

function mapStateToProps(state, { match: { params: { followerGroupId } } }) {
    if (!followerGroupId) return {};

    const followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);

    return {
        resonators: _.get(followerGroup, 'resonators'),
        followerGroup
    };
}

function mapDispatchToProps(dispatch, /* {params: {followerGroupId}} */) {
    return bindActionCreators({
        fetchFollowerGroupResonators: actions.fetchFollowerGroupResonators,
        activateResonator: resonatorActions.activate,
        showDeleteResonatorPrompt: resonatorId => navigationActions.showModal({
            name: "deleteResonator",
            props: {
                resonatorId
            }
        }),

        push
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerGroupResonators);
