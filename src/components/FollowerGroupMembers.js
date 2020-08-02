import _ from 'lodash';
import React, { Component } from 'react';
import { actions as followersActions } from '../actions/followersActions';
import { actions as followerGroupsActions } from '../actions/followerGroupsActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as navigationActions } from '../actions/navigationActions';
import followersSelector from '../selectors/followersSelector';
import { Select, Checkbox, MenuItem, Button, Link as MuiLink, Typography } from '@material-ui/core';
import EntityTable from './EntityTable';
import { Link } from 'react-router-dom';
import MoreOptionsMenu from './MoreOptionsMenu';

class FollowerGroupMembers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false,
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);

    }

    componentWillMount() {
        if (this.props.followerGroup)
            this.props.fetchFollowerGroupMembers(this.props.followerGroup.id);
        this.setState({
            currentMemberIdList: this.props.members?.map(({ id }) => id),
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.followerGroup && !_.isEqual(this.props.followerGroup, nextProps.followerGroup))
            nextProps.fetchFollowerGroupMembers(nextProps.followerGroup.id);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.members, prevProps.members)) {
            this.setState({
                currentMemberIdList: this.props.members?.map(({ id }) => id),
            })
        }
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    toggleShowEmails() {
        this.setState({ showEmails: !this.state.showEmails });
    }

    toggleCheckbox(followerId) {
        this.setState({ currentMemberIdList: _.xor(this.state.currentMemberIdList, [followerId]) });
    }

    isSubmittable() {
        return !_.isEqual(this.state.currentMemberIdList, this.props.initialMemberIds);
    }

    isFollowerInMemberList(followerId) {
        return this.state.currentMemberIdList ? this.state.currentMemberIdList?.includes(followerId) : false
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
        let header = [];
        header.push('Name');
        this.state.showEmails && header.push('Email');
        header.push('Clinic');
        header.push('Member')
        return header;
    }

    getMemberRows(isMembers) {
        return _.reduce(
            _.filter(this.props.followers, (f) => isMembers === this.isFollowerInMemberList(f.id)),
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
                        {f.frozen ? <NotInterested fontSize="small" style={{ marginRight: 5 }} /> : null}
                        <span>{f.user.name}</span>
                    </MuiLink>
                );
                this.state.showEmails && cols.push(f.user.email);
                cols.push(f.clinicName);
                cols.push(
                    <Checkbox
                        color="primary"
                        checked={isMembers}
                        onClick={() => this.toggleCheckbox(f.id)} />
                );
                acc[f.id] = cols;
                return acc;
            },
            {}
        );
    }

    getRows() {
        return _.reduce(
            _.sortBy(this.props.followers, [(f) => !this.isFollowerInMemberList(f.id)]),
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
                        {f.frozen ? <NotInterested fontSize="small" style={{ marginRight: 5 }} /> : null}
                        <span>{f.user.name}</span>
                    </MuiLink>
                );
                this.state.showEmails && cols.push(f.user.email);
                cols.push(f.clinicName);
                cols.push(
                    <Checkbox
                        color="primary"
                        checked={this.isFollowerInMemberList(f.id)}
                        onClick={() => this.toggleCheckbox(f.id)} />
                );
                acc[f.id] = cols;
                return acc;
            },
            {}
        );
    }

    getToolbox() {
        return {
            left: (
                <Typography variant="h6">
                    {`${this.props.followerGroup && this.props.followerGroup.group_name}'s Members`}
                </Typography>
            ),
            right: (
                <MoreOptionsMenu>
                    <MenuItem onClick={() => this.toggleShowEmails()}>
                        {this.state.showEmails ? "Hide Emails" : "Show Emails"}
                    </MenuItem>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                        {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                    </MenuItem>
                </MoreOptionsMenu>
            ),
        };
    }

    render() {

        return (
            <div style={{textAlign: 'right'}}>
                <EntityTable
                    // header={this.getHeader()}
                    rows={this.getRows()}
                    toolbox={this.getToolbox()}
                    addButton={false}
                    className='members'
                    submitButton={true}
                    onSubmitClick={() => this.handleSubmit()}/>
                <Button style={{marginRight: '15%'}}
                    color="primary"
                    variant="contained"
                    onClick={console.log(`Sending ${this.state.currentMemberIdList}`)}
                    disabled={!this.isSubmittable()}>
                    Update
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state, { match: { params: { followerGroupId } } }) {
    if (!followerGroupId) return {};

    const followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);
    const followersData = followersSelector(state);

    const members = _.get(followerGroup, 'members');

    return {
        members,
        initialMemberIds: members?.map(({ id }) => id),
        followerGroup,
        ...followersData,
        getFollower: (followerId) => _.find(followersData.followers, (f) => f.id === followerId)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchFollowerGroupMembers: followerGroupsActions.fetchFollowerGroupMembers,
        toggleDisplayFrozen: followersActions.toggleDisplayFrozen,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FollowerGroupMembers);
