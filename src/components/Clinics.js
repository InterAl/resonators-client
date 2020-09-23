import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../actions/clinicActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as navigationActions } from "../actions/navigationActions";
import EntityTable from "./EntityTable";
import { rowAction } from './RowActions';
import { Checkbox } from "@material-ui/core";
import { Label, PersonAdd } from "@material-ui/icons";

import "./Clinics.scss";

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
        return ["Name", "Current Clinic"];
    }

    getRows() {
        return _.reduce(
            this.props.clinics,
            (acc, c) => {
                let cols = [];
                if (c.is_primary) {
                    cols.push(
                        <div key={c.name} className="primary-clinic">
                            <Label htmlColor="#5DADE2" fontSize="small" style={{ marginRight: 5 }} />
                            <span>{c.name}</span>
                        </div>
                    );
                } else {
                    cols.push(
                        <span key={c.name} className="secondaryClinic">
                            {c.name}
                        </span>
                    );
                }
                cols.push(<Checkbox key={`${c.name}-primary`} disabled checked={c.isCurrentClinic} />);
                acc[c.id] = cols;
                return acc;
            },
            {}
        );
    }

    render() {
        return (
            <EntityTable
                addButton={false}
                className="clinics"
                rows={this.getRows()}
                header={this.getHeader()}
                onAdd={this.handleAddClinic}
                extraRowActions={this.getExtraRowActions()}
            />
        );
    }

    getExtraRowActions() {
        return [
            // rowAction({
            //     title: "Detach Clinic",
            //     onClick: _.noop,
            //     isAvailable: (clinicId) =>
            //         this.props.leader.current_clinic_id === clinicId && !this.getClinic(clinicId).is_primary,
            // }),
            rowAction({
                icon: <PersonAdd />,
                title: "Add Leader to Clinic",
                onClick: this.handleAddLeaderToClinic,
                isAvailable: (clinicId) => this.getClinic(clinicId).is_primary,
            }),
            rowAction({
                icon: <Label />,
                title: "Make as Current Clinic",
                onClick: this.handleSelectClinic,
                isAvailable: (clinicId) => !this.getClinic(clinicId).isCurrentClinic
            })
        ];
    }

    getClinic(clinicId) {
        return this.props.clinics.find((clinic) => clinic.id === clinicId);
    }
}

function mapStateToProps(state) {
    return {
        clinics: state.clinics.clinics,
        leader: state.leaders.leaders,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            editClinic: actions.edit,
            filterByClinicId: actions.filterByClinicId,
            showEditClinicModal: (clinicId) =>
                navigationActions.showModal({
                    name: "editClinic",
                    props: {
                        clinicId,
                        editMode: true,
                    },
                }),
            showCreateClinicModal: () =>
                navigationActions.showModal({
                    name: "editClinic",
                    props: {
                        editMode: false,
                    },
                }),
            showAddLeaderToClinicModal: (clinicId) =>
                navigationActions.showModal({
                    name: "addLeaderToClinic",
                    props: {
                        clinicId,
                    },
                }),

            showDeleteClinicPrompt: (clinicId) =>
                navigationActions.showModal({
                    name: "deleteClinic",
                    props: {
                        clinicId,
                    },
                }),
            selectClinic: actions.selectClinic,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Clinics);
