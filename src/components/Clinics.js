import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../actions/clinicActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import EntityTable from './EntityTable';
import MoreOptionsMenu from './MoreOptionsMenu';
import MenuItem from 'material-ui/MenuItem';
import {Field} from 'redux-form';
import CheckboxField from './FormComponents/CheckboxField';
import Checkbox from 'material-ui/Checkbox';
import PrimaryClinicIcon from 'material-ui/svg-icons/action/label';

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
      this.setState( { leader: updatedLeader });
    }

    handleAddLeaderToClinic(clinicId)
    {
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
            if(c.isPrimary)
            {
                cols.push(<div><div className='primaryClinic'><PrimaryClinicIcon className='primaryClinicIcon' color='#5DADE2'/></div><div>{c.name}</div></div>);
            }
            else
            {
                cols.push(<span className='secondaryClinic'>{c.name}</span>);
            }
            cols.push(
                <Checkbox disabled checked={c.isCurrentClinic}/>
            );
            acc[c.id] = cols;
            return acc;
        }, {});
    }

    render() {
        let header = this.getHeader();
        let rows = this.getRows();
        let moreOptionsMenu = this.renderMoreOptionsMenu();
        return (
            <EntityTable
                header={header}
                rows={rows}
                addButton={false}
                rowActions={[moreOptionsMenu]}
                className='clinics'
                onAdd={this.handleAddClinic}
            />
        );
    }

    
    renderMoreOptionsMenu() {
        return clinicId => {
            let clinic = _.find(this.props.clinics, f => f.id === clinicId);
            var showHideDetachClinciAction = this.props.leader.current_clinic_id === clinicId  && clinic.isPrimary == false ? (
                <MenuItem
                className='delete-follower-btn'
                primaryText='Detach Clinic'
                // onTouchTap={() => this.handleEditFollower(followerId)}
            />
            ) : ""
            var showHideAddClinciAction = clinic.isPrimary ? (
                <MenuItem
            className='add-follower-btn'
            primaryText='Add Leader to clinic'
            onTouchTap={() => this.handleAddLeaderToClinic(clinicId)}
            style={{color: 'red'}}
        />
            ) : ""
            var showMakeAsCurrentClinicAction = clinic.isCurrentClinic == false ? (
                <MenuItem
                    className='edit-follower-btn'
                    primaryText='Make as Current Clinic'
                    onTouchTap={() => this.handleSelectClinic(clinicId)}
                />
            ) : ""
            return (                  
                <MoreOptionsMenu
                    className='more-options-btn'
                >
                    {showMakeAsCurrentClinicAction}
                    {showHideDetachClinciAction}     
                    {showHideAddClinciAction}     
                </MoreOptionsMenu>
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
