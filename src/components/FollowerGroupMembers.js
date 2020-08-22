import _ from 'lodash';
import React, { Component } from 'react';
import { actions as followersActions } from '../actions/followersActions';
import { actions as followerGroupsActions } from '../actions/followerGroupsActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import followersSelector from '../selectors/followersSelector';
import { Select, Checkbox, MenuItem, Typography, Divider, Tooltip, TextField, InputAdornment } from '@material-ui/core';
import EntityTable from './EntityTable';
import { push } from "connected-react-router";
import OverflowMenu from './OverflowMenu';
import { NotInterested, Check, Search } from '@material-ui/icons';
import { isMobile } from './utils';

class FollowerGroupMembers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false,
            toggleAll: false,
            filter: '',
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleAllCheckboxes = this.toggleAllCheckboxes.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.filteredFollowers = this.filteredFollowers.bind(this);
    }

    componentWillMount() {
        if (this.props.followerGroup)
            this.props.fetchFollowerGroupMembers(this.props.followerGroup.id);
        this.setState({
            currentMemberIdList: this.props.members?.map(({ id }) => id),
            isMobile: isMobile(window.innerWidth),
        })
        window.addEventListener('resize', () => this.setState({ isMobile: isMobile(window.innerWidth) }));
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

    toggleAllCheckboxes(newState) {
        newState ?
            this.setState({
                currentMemberIdList: _.union(
                    this.state.currentMemberIdList,
                    this.filteredFollowers().map(({ id }) => id)
                ),
                toggleAll: true,
            }) :
            this.setState({
                currentMemberIdList: _.difference(
                    this.state.currentMemberIdList,
                    this.filteredFollowers().map(({ id }) => id)
                ),
                toggleAll: false
            });
    }

    isSubmittable() {
        return !_.isEqual(this.state.currentMemberIdList, this.props.initialMemberIds);
    }

    isFollowerInMemberList(followerId) {
        return this.state.currentMemberIdList ? this.state.currentMemberIdList?.includes(followerId) : false
    }

    filteredFollowers() {
        return this.state.filter === '' ?
            this.props.followers :
            this.props.followers.filter((f) =>
                f.user.name.includes(this.state.filter) ||
                (this.state.showEmails && f.user.email.includes(this.state.filter)));
    }

    handleSubmit() {
        const newMemberList = this.state.currentMemberIdList.map(
            (followerId) => this.props.getFollower(followerId));
        this.props.updateFollowerGroupMembers({
            newMemberList,
            followerGroupId: this.props.followerGroup.id,
        });
        this.props.push('/followerGroups/');
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
        header.push(
            <React.Fragment>
                <Tooltip title={this.state.toggleAll ? 'Remove All' : 'Select All'}>
                    <Checkbox
                        color="primary"
                        checked={this.state.toggleAll}
                        onClick={() => this.toggleAllCheckboxes(!this.state.toggleAll)} />
                </Tooltip>
                <span>Member</span >
            </React.Fragment>);
        return header;
    }

    getMemberRows(isMembers) {
        return _.reduce(
            _.filter(this.filteredFollowers(), (f) => isMembers === this.isFollowerInMemberList(f.id)),
            (acc, f) => {
                const cols = [];
                cols.push(
                    <React.Fragment>
                        {f.frozen ? <NotInterested fontSize="small" style={{ marginRight: 5 }} /> : null}
                        <span> {f.user.name}</span >
                    </React.Fragment>
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

    renderRows() {
        const memberRows = this.getMemberRows(true);
        const nonMemberRows = this.getMemberRows(false);
        return (
            <div style={{ justifyContent: 'space-around', display: 'flex', flexDirection: 'column' }}>
                <EntityTable
                    header={this.getHeader()}
                    rows={memberRows}
                    toolbox={this.getToolbox()}
                    addButton={true}
                    addText='Update Members'
                    addIcon={<Check />}
                    onAdd={this.handleSubmit}
                    addDisabled={!this.isSubmittable()}
                    className='members'
                    cellWidth='20vw' />
                {!_.isEmpty(nonMemberRows) &&
                    <React.Fragment>
                        <Divider style={{ marginBottom: '3vh' }} />
                        <EntityTable
                            rows={nonMemberRows}
                            addButton={false}
                            className='members'
                            cellWidth='20vw' />
                    </React.Fragment>
                }
            </div>
        )
    }

    renderSearch() {
        return <TextField
            label='Filter'
            variant='outlined'
            size='small'
            style={{
                marginTop: '0.5vh',
                // width: '15vw'
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
            onChange={(e) => this.setState({ filter: e.target.value })}
        />
    }

    getToolbox() {
        return {
            left: (
                this.state.isMobile ?
                    this.renderSearch() :
                    <Typography variant="h6">
                        {`${this.props.followerGroup && this.props.followerGroup.group_name}'s Members`}
                    </Typography>
            ),
            right: (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {!this.state.isMobile && this.renderSearch()}
                    <OverflowMenu>
                        <MenuItem onClick={() => this.toggleShowEmails()}>
                            {this.state.showEmails ? "Hide Emails" : "Show Emails"}
                        </MenuItem>
                        <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                            {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                        </MenuItem>
                    </OverflowMenu>
                </div>
            ),
        };
    }

    render() {
        return (
            <div style={{ textAlign: 'right' }}>
                {this.renderRows()}
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
        updateFollowerGroupMembers: followerGroupsActions.updateFollowerGroupMembers,
        toggleDisplayFrozen: followersActions.toggleDisplayFrozen,
        push,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FollowerGroupMembers);
