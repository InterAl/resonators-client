import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/clinicActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import EntityTable from './EntityTable';
// import './Clinics.scss';

class Clinics extends Component {
    constructor() {
        super();

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
        this.handleSelectClinic = this.handleSelectClinic.bind(this);
        this.handleEditClinic = this.handleEditClinic.bind(this);
        this.handleRemoveClinic = this.handleRemoveClinic.bind(this);
        this.handleAddClinic = this.handleAddClinic.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    handleSelectClinic(clinicId) {
        this.props.selectClinic(clinicId);
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
        header.push('Clinic name');
        return header;
    }

    getRows() {
        return _.reduce(this.props.clinics, (acc, c) => {
            let cols = [];
            cols.push(<span>{c.name}</span>);
            acc[c.id] = cols;
            return acc;
        }, {});
    }

    render() {
        let header = this.getHeader();
        let rows = this.getRows();

        return (
            <EntityTable
                header={header}
                rows={rows}
                addButton={true}
                rowActions={['edit', 'remove']}
                className='clinics'
                onAdd={this.handleAddClinic}
                onEdit={this.handleEditClinic}
                onRemove={this.handleRemoveClinic}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        clinics: state.clinics.clinics
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
