import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/followersActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import followersSelector from '../selectors/followersSelector';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import EntityTable from './EntityTable';
import {Link} from 'react-router-dom';
import MoreOptionsMenu from './MoreOptionsMenu';
import MenuItem from 'material-ui/MenuItem';
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
        return (
            <SelectField
                floatingLabelText='Clinic'
                value={this.props.clinicIdFilter}
                onChange={this.handleClinicFilterChange}
            >
                <MenuItem value='all' primaryText='All' />
                {
                    this.props.clinics.map((clinic, i) => (
                        <MenuItem value={clinic.id} primaryText={clinic.name} key={i} />
                    ))
                }
            </SelectField>
        );
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
            left: [
                this.renderClinicFilter()
            ],
            right: [
                <MoreOptionsMenu
                    multiple
                    value={moreOptions}
                >
                    <MenuItem onTouchTap={() => this.toggleShowEmails()} primaryText='Show Emails' value='showEmails'/>
                    <MenuItem onTouchTap={() => this.props.toggleDisplayFrozen()} primaryText='Show Deactivated' value='showFrozen'/>
                </MoreOptionsMenu>
            ]
        };
    }

    renderMoreOptionsMenu() {
        return followerId => {
            const follower = this.props.getFollower(followerId);

            const freezeUnfreezeMenuItem = follower.frozen ? (
                <MenuItem
                    primaryText='Activate'
                    onTouchTap={() => this.props.unfreezeFollower(followerId)}
                />
            ) : (
                <MenuItem
                    primaryText='Deactivate'
                    onTouchTap={() => this.handleFreezeFollower(followerId)}
                />
            );

            return (
                <MoreOptionsMenu
                    className='more-options-btn'
                >
                    <MenuItem
                        className='edit-follower-btn'
                        primaryText='Edit'
                        onTouchTap={() => this.handleEditFollower(followerId)}
                    />
                    {freezeUnfreezeMenuItem}
                    <MenuItem
                        className='delete-follower-btn'
                        primaryText='Delete'
                        onTouchTap={() => this.handleRemoveFollower(followerId)}
                        style={{color: 'red'}}
                    />
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
