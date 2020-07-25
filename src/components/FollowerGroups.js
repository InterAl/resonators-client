import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/followerGroupsActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import followerGroupsSelector from '../selectors/followerGroupsSelector';
import SelectField from 'material-ui/SelectField';
import EntityTable from './EntityTable';
import {Link} from 'react-router-dom';
import MoreOptionsMenu from './MoreOptionsMenu';
import MenuItem from 'material-ui/MenuItem';
import './FollowerGroups.scss';

class FollowerGroups extends Component {
    constructor() {
        super();

        this.state = {
            openedMoreOptionsMenuFollowerGroupId: null
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectFollowerGroup = this.handleSelectFollowerGroup.bind(this);
        this.handleEditFollowerGroup = this.handleEditFollowerGroup.bind(this);
        this.handleRemoveFollowerGroup = this.handleRemoveFollowerGroup.bind(this);
        this.handleAddFollowerGroup = this.handleAddFollowerGroup.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    handleSelectFollowerGroup(followerGroupId) {
        this.props.selectFollowerGroup(followerGroupId);
    }

    handleAddFollowerGroup() {
        this.props.showCreateFollowerGroupModal();
    }

    handleEditFollowerGroup(id) {
        this.props.showEditFollowerGroupModal(id);
    }

    handleRemoveFollowerGroup(id) {
        this.props.showDeleteFollowerGroupPrompt(id);
    }

    handleFreezeFollowerGroup(id) {
        this.props.showFreezeFollowerGroupPrompt(id);
    }

    toggleMoreOptionsMenu(followerGroupId) {
        if (!followerGroupId && !this.state.openedMoreOptionsMenuFollowerGroupId)
            return; //prevent stack overflow

        this.setState({
            openedMoreOptionsMenuFollowerGroupId: followerGroupId
        });
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
        return ['Name', 'Clinic'];
    }

    getRows() {
        return _.reduce(this.props.followerGroups, (acc, fg) => {
            const cols = [
                <Link to={`/followerGroups/${fg.id}/resonators`}
                    style={{
                        color: fg.frozen ? 'rgb(157, 155, 155)' : ''
                    }}>
                    {fg.group_name}
                </Link>,
                fg.clinicName,
            ];
            acc[fg.id] = cols;
            return acc;
        }, {});
    }

    getToolbox() {
        const moreOptions = [];

        if (this.props.displayFrozen)
            moreOptions.push('showFrozen');

        return {
            // left: [
            //     this.renderClinicFilter()
            // ],
            right: [
                <MoreOptionsMenu multiple value={moreOptions}>
                    <MenuItem onTouchTap={() => this.props.toggleDisplayFrozen()}
                        primaryText={this.props.displayFrozen ? 'Hide Deactivated' : 'Show Deactivated'} value='showFrozen'/>
                </MoreOptionsMenu>
            ]
        };
    }

    renderMoreOptionsMenu() {
        return followerGroupId => {
            const followerGroup = this.props.getFollowerGroup(followerGroupId);

            const freezeUnfreezeMenuItem = followerGroup.frozen ? (
                <MenuItem
                    primaryText='Activate'
                    onTouchTap={() => this.props.unfreezeFollowerGroup(followerGroupId)}
                />
            ) : (
                <MenuItem
                    primaryText='Deactivate'
                    onTouchTap={() => this.handleFreezeFollowerGroup(followerGroupId)}
                />
            );

            return (
                <MoreOptionsMenu
                    className='more-options-btn'
                >
                    <MenuItem
                        className='edit-followerGroup-btn'
                        primaryText='Edit'
                        onTouchTap={() => this.handleEditFollowerGroup(followerGroupId)}
                    />
                    {freezeUnfreezeMenuItem}
                    <MenuItem
                        className='delete-followerGroup-btn'
                        primaryText='Delete'
                        onTouchTap={() => this.handleRemoveFollowerGroup(followerGroupId)}
                        style={{color: 'red'}}
                    />
                </MoreOptionsMenu>
            );
        }
    }

    render() {
        const header = this.getHeader();
        const rows = this.getRows();
        const toolbox = this.getToolbox();
        const moreOptionsMenu = this.renderMoreOptionsMenu();

        return (
            <EntityTable
                header={header}
                rows={rows}
                toolbox={toolbox}
                addButton={true}
                rowActions={[moreOptionsMenu]}
                className='followerGroups'
                onAdd={this.handleAddFollowerGroup}
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
        filterByClinicId: actions.filterByClinicId,
        toggleDisplayFrozen: actions.toggleDisplayFrozen,
        showEditFollowerGroupModal: followerGroupId => navigationActions.showModal({
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
        showDeleteFollowerGroupPrompt: followerGroupId => navigationActions.showModal({
            name: 'deleteFollowerGroup',
            props: {
                followerGroupId
            }
        }),
        showFreezeFollowerGroupPrompt: followerGroupId => navigationActions.showModal({
            name: 'freezeFollowerGroup',
            props: {
                followerGroupId
            }
        }),
        selectFollowerGroup: actions.selectFollowerGroup,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(FollowerGroups);
