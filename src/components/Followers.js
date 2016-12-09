import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/followersActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import followersSelector from '../selectors/followersSelector';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import EntityTable from './EntityTable';
import {Link} from 'react-router';
import './Followers.scss';

class Followers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false
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

    renderClinicFilter() {
        return (
            <SelectField
                floatingLabelText='Clinic'
                value={this.props.clinicIdFilter}
                onChange={this.handleClinicFilterChange}
            >
                <MenuItem value='all' primaryText='All' />
            {
                this.props.clinics.map(clinic => (
                    <MenuItem value={clinic.id} primaryText={clinic.name} />
                ))
            }
            </SelectField>
        );
    }

    renderShowEmailsToggle() {
        return (
            <Toggle
                toggled={this.state.showEmails}
                style={{top: 8}}
                label="Show emails"
                labelPosition='right'
                onToggle={() => this.setState({showEmails: !this.state.showEmails})} />
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
            cols.push(<Link to={`/react/followers/${f.id}/resonators`}>{f.user.name}</Link>);
            this.state.showEmails && cols.push(f.user.email);
            cols.push(f.clinicName);
            acc[f.id] = cols;
            return acc;
        }, {});
    }

    getToolbox() {
        return {
            left: [this.renderClinicFilter(), this.renderShowEmailsToggle()]
        };
    }

    render() {
        let header = this.getHeader();
        let rows = this.getRows();
        let toolbox = this.getToolbox();

        return (
            <EntityTable
                header={header}
                rows={rows}
                toolbox={toolbox}
                addButton={true}
                rowActions={['edit', 'remove']}
                className='followers'
                onAdd={this.handleAddFollower}
                onEdit={this.handleEditFollower}
                onRemove={this.handleRemoveFollower}
            />
        );
    }
}

function mapStateToProps(state) {
    let followersData = followersSelector(state);

    return {
        ...followersData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editFollower: actions.edit,
        filterByClinicId: actions.filterByClinicId,
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
        selectFollower: actions.selectFollower
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
