import _ from 'lodash';
import React, { Component } from 'react';
import { actions } from '../actions/clinicActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as navigationActions } from '../actions/navigationActions';
import EntityTable from './EntityTable';
import OverflowMenu from './OverflowMenu';
import { MenuItem, Checkbox } from '@material-ui/core';
import { Label } from '@material-ui/icons';

import './Clinics.scss';

class Clinics extends Component {
    constructor() {
        super();

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectClinic = this.handleSelectClinic.bind(this);
        // this.handleEditClinic = this.handleEditClinic.bind(this);
        // this.handleRemoveClinic = this.handleRemoveClinic.bind(this);
        this.handleAddClinic = this.handleAddClinic.bind(this);
        this.handleAddLeaderToClinic = this.handleAddLeaderToClinic.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    handleSelectClinic(clinicId) {
        this.props.selectClinic(clinicId);
        var updatedLeader = this.props.leader;
        updatedLeader.current_clinic_id = clinicId;
        this.setState({ leader: updatedLeader });
    }

    handleAddLeaderToClinic(clinicId) {
        this.props.showAddLeaderToClinicModal(clinicId);
    }

    handleAddClinic() {
        this.props.showCreateClinicModal();
    }

    handleEditClinic(id) {
        this.props.showEditClinicModal(id);
    }

    handleRemoveClinic(id) {
        this.props.showDeleteClinicPrompt(id);
    }

    getHeader() {
        let header = [];
        header.push('Name');
        header.push('Current Clinic');
        return header;
    }

    getRows() {
        return _.reduce(this.props.clinics, (acc, c) => {
            let cols = [];
            if (c.isPrimary) {
                cols.push(
                    <div key={c.name} className='primary-clinic'>
                        <Label htmlColor="#5DADE2" fontSize="small" style={{marginRight: 5}} />
                        <span>{c.name}</span>
                    </div>
                );
            }
            else {
                cols.push(<span key={c.name} className='secondaryClinic'>{c.name}</span>);
            }
            cols.push(
                <Checkbox key={`${c.name}-primary`} disabled checked={c.isCurrentClinic} />
            );
            acc[c.id] = cols;
            return acc;
        }, {});
    }

    render() {
        let header = this.getHeader();
        let rows = this.getRows();
        let overflowMenu = this.renderOverflowMenu();
        return (
            <EntityTable
                header={header}
                rows={rows}
                addButton={false}
                rowActions={[overflowMenu]}
                className='clinics'
                onAdd={this.handleAddClinic}
            />
        );
    }


    renderOverflowMenu() {
        return clinicId => {
            let clinic = _.find(this.props.clinics, f => f.id === clinicId);
            var showHideDetachClinciAction = this.props.leader.current_clinic_id === clinicId && clinic.isPrimary == false ? (
                <MenuItem
                    // onClick={() => this.handleEditFollower(followerId)}
                    className='delete-follower-btn'>
                    Detach Clinic
                </MenuItem>
            ) : ""
            var showHideAddClinciAction = clinic.isPrimary ? (
                <MenuItem
                    className='add-follower-btn'
                    onClick={() => this.handleAddLeaderToClinic(clinicId)}
                    style={{ color: 'red' }}>
                    Add Leader to clinic
                </MenuItem>
            ) : ""
            var showMakeAsCurrentClinicAction = clinic.isCurrentClinic == false ? (
                <MenuItem
                    className='edit-follower-btn'
                    onClick={() => this.handleSelectClinic(clinicId)}>
                    Make as Current Clinic
                </MenuItem>
            ) : ""
            return (
                <OverflowMenu
                    key="more-options"
                    className='more-options-btn'>
                    {showMakeAsCurrentClinicAction}
                    {showHideDetachClinciAction}
                    {showHideAddClinciAction}
                </OverflowMenu>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        clinics: state.clinics.clinics,
        leader: state.leaders.leaders
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editClinic: actions.edit,
        filterByClinicId: actions.filterByClinicId,
        showEditClinicModal: clinicId => navigationActions.showModal({
            name: 'editClinic',
            props: {
                clinicId,
                editMode: true
            }
        }),
        showCreateClinicModal: () => navigationActions.showModal({
            name: 'editClinic',
            props: {
                editMode: false
            }
        }),
        showAddLeaderToClinicModal: clinicId => navigationActions.showModal({
            name: 'addLeaderToClinic',
            props: {
                clinicId
            }
        }),

        showDeleteClinicPrompt: clinicId => navigationActions.showModal({
            name: 'deleteClinic',
            props: {
                clinicId
            }
        }),
        selectClinic: actions.selectClinic
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Clinics);
