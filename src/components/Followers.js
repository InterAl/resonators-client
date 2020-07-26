import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/followersActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import followersSelector from '../selectors/followersSelector';
import { MenuItem, Select, InputLabel } from '@material-ui/core';
import EntityTable from './EntityTable';
import {Link} from 'react-router-dom';
import MoreOptionsMenu from './MoreOptionsMenu';
import './Followers.scss';

class Followers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false,
            openedMoreOptionsMenuFollowerId: null
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectFollower = this.handleSelectFollower.bind(this);
        this.handleEditFollower = this.handleEditFollower.bind(this);
        this.handleRemoveFollower = this.handleRemoveFollower.bind(this);
        this.handleAddFollower = this.handleAddFollower.bind(this);
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

    toggleMoreOptionsMenu(followerId) {
        if (!followerId && !this.state.openedMoreOptionsMenuFollowerId)
            return; //prevent stack overflow

        this.setState({
            openedMoreOptionsMenuFollowerId: followerId
        });
    }

    toggleShowEmails() {
        this.setState({showEmails: !this.state.showEmails});
    }

    renderClinicFilter() {
        return [
            <InputLabel id="clinic-filter-label">Clinic</InputLabel>,
            <Select
                labelId="clinic-filter-label"
                value={this.props.clinicIdFilter}
                onChange={this.handleClinicFilterChange}>
                <MenuItem value='all'>All</MenuItem>
                {
                    this.props.clinics.map((clinic, i) => (
                        <MenuItem value={clinic.id} key={i}>{clinic.name}</MenuItem>
                    ))
                }
            </Select>
        ];
    }

    getHeader() {
        let header = [];
        header.push('Name');
        this.state.showEmails && header.push('Email');
        header.push('Clinic');
        return header;
    }

    getRows() {
        return _.reduce(this.props.followers, (acc, f) => {
            let cols = [];
            cols.push(
                <Link
                    to={`/followers/${f.id}/resonators`}
                    style={{
                        color: f.frozen ? 'rgb(157, 155, 155)' : ''
                    }}
                >
                    {f.user.name}
                </Link>
            );
            this.state.showEmails && cols.push(f.user.email);
            cols.push(f.clinicName);
            acc[f.id] = cols;
            return acc;
        }, {});
    }

    getToolbox() {
        const moreOptions = [];

        if (this.state.showEmails)
            moreOptions.push('showEmails');

        if (this.props.displayFrozen)
            moreOptions.push('showFrozen');

        return {
            // left: [
            //     this.renderClinicFilter()
            // ],
            right: [
                <MoreOptionsMenu
                    multiple
                    value={moreOptions}
                >
                    <MenuItem onClick={() => this.toggleShowEmails()} value='showEmails'>Show Emails</MenuItem>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()} value='showFrozen'>Show Deactivated</MenuItem>
                </MoreOptionsMenu>
            ]
        };
    }

    renderMoreOptionsMenu() {
        return followerId => {
            const follower = this.props.getFollower(followerId);

            const freezeUnfreezeMenuItem = follower.frozen ? (
                <MenuItem onClick={() => this.props.unfreezeFollower(followerId)}>Activate</MenuItem>
            ) : (
                <MenuItem onClick={() => this.handleFreezeFollower(followerId)}>Deactivate</MenuItem>
            );

            return (
                <MoreOptionsMenu
                    className='more-options-btn'
                >
                    <MenuItem
                        className='edit-follower-btn'
                        onClick={() => this.handleEditFollower(followerId)}>Edit</MenuItem>
                    {freezeUnfreezeMenuItem}
                    <MenuItem
                        className='delete-follower-btn'
                        onClick={() => this.handleRemoveFollower(followerId)}
                        style={{color: 'red'}}>Delete</MenuItem>
                </MoreOptionsMenu>
            );
        }
    }

    render() {
        let header = this.getHeader();
        let rows = this.getRows();
        let toolbox = this.getToolbox();
        let moreOptionsMenu = this.renderMoreOptionsMenu();

        return (
            <EntityTable
                header={header}
                rows={rows}
                toolbox={toolbox}
                addButton={true}
                rowActions={[moreOptionsMenu]}
                className='followers'
                onAdd={this.handleAddFollower}
            />
        );
    }
}

function mapStateToProps(state) {
    let followersData = followersSelector(state);

    return {
        ...followersData,
        getFollower: followerId => _.find(followersData.followers, f => f.id === followerId)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editFollower: actions.edit,
        unfreezeFollower: actions.unfreeze,
        filterByClinicId: actions.filterByClinicId,
        toggleDisplayFrozen: actions.toggleDisplayFrozen,
        showEditFollowerModal: followerId => navigationActions.showModal({
            name: 'editFollower',
            props: {
                followerId,
                editMode: true
            }
        }),
        showCreateFollowerModal: () => navigationActions.showModal({
            name: 'editFollower',
            props: {
                editMode: false
            }
        }),
        showDeleteFollowerPrompt: followerId => navigationActions.showModal({
            name: 'deleteFollower',
            props: {
                followerId
            }
        }),
        showFreezeFollowerPrompt: followerId => navigationActions.showModal({
            name: 'freezeFollower',
            props: {
                followerId
            }
        }),
        selectFollower: actions.selectFollower,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(Followers);
