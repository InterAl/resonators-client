import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../actions/followersActions";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import TextField from "./FormComponents/TextField";
import navigationInfoSelector from "../selectors/navigationSelector";
import Papa from 'papaparse';

class EditFollowerModal extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        let editCfg = {
            title: "Edit Follower",
            doneBtn: "Update",
        };

        let newCfg = {
            title: "Create Follower",
            doneBtn: "Create",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.importFollowers = this.importFollowers.bind(this);
        this.cfg = props.editMode ? editCfg : newCfg;
    }

    importFollowers(e) {
        const importFile = e.target.files[0];
        Papa.parse(importFile, {
            header: true,
            complete: ({ data }) => {
                if (_.every(data, (follower) => _.isEmpty(validateInput(follower)))) {
                    for (const follower of data) {
                        this.props.create({
                            ...follower,
                            clinic: this.props.initialValues.clinic
                        });
                    }
                    this.props.onClose();
                }
            }
        })


    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(formData) {
        if (this.props.editMode) this.props.update({ ...formData, id: this.props.followerId });
        else this.props.create(formData);

        this.props.onClose();
    }

    renderForm() {
        return (
            <form autoComplete="off">
                <Field type="text" placeholder="Name" name="name" component={TextField} />
                <Field type="email" placeholder="Email" name="email" component={TextField} />

                {!this.props.editMode && (
                    <Field type="password" placeholder="Password" name="password" component={TextField} />

                    // <Field name='clinic'
                    //        label='Clinic'
                    //        required={true}
                    //        component={SelectField}>
                    // {
                    //     this.props.clinics.map((clinic, idx) => (
                    //         <MenuItem
                    //             className={`select-clinic-option-${idx}`}
                    //             value={clinic.id}
                    //             primaryText={clinic.name}
                    //         />
                    //     ))
                    // }
                    // </Field>
                )}
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className="edit-follower-modal" onClose={this.props.onClose}>
                <DialogTitle>{this.cfg.title}</DialogTitle>
                <DialogContent>{this.renderForm()}</DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>
                    {!this.props.editMode && (
                        <React.Fragment>
                            <input
                                accept=".csv"
                                style={{ display: "none" }}
                                id="import-followers"
                                type="file"
                                onChange={this.importFollowers}
                            />
                            <label htmlFor="import-followers">
                                <Button component="span" variant="contained">
                                    Import
                                </Button>
                            </label>
                        </React.Fragment>
                    )}

                    <Button
                        onClick={this.props.handleSubmit(this.handleSubmit)}
                        color="primary"
                        variant="contained"
                        className="create-follower-btn"
                    >
                        {this.cfg.doneBtn}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function validateInput(data) {
    let errors = {};

    if (!data.name) errors.name = "Required";

    if (!data.email) {
        errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = "Invalid email address";
    }

    if (!data.password) errors.password = "Required";

    return errors;
}

let Form = reduxForm({
    form: "editFollower",
    validate: validateInput,
})(EditFollowerModal);

function mapStateToProps(state) {
    const {
        modalProps: { followerId, editMode },
    } = navigationInfoSelector(state);
    const follower = _.find(state.followers.followers, (f) => f.id === followerId);
    const clinics = state.clinics.clinics;
    const current_clinic_id = state.leaders.leaders.current_clinic_id;

    const ret = {
        follower,
        clinics,
        editMode,
    };

    if (follower) {
        ret.initialValues = {
            name: follower.user.name,
            email: follower.user.email,
        };
    } else {
        ret.initialValues = {
            clinic: current_clinic_id,
        };
    }
    return ret;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            update: actions.update,
            create: actions.create,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
