import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/followersActions';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
import navigationInfoSelector from '../selectors/navigationSelector';


class EditFollowerModal extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        let editCfg = {
            title: 'Edit Follower',
            doneBtn: 'Update'
        };

        let newCfg = {
            title: 'Create Follower',
            doneBtn: 'Create'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cfg = props.editMode ? editCfg : newCfg;
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(formData) {
        if (this.props.editMode)
            this.props.update({ ...formData, id: this.props.followerId });
        else
            this.props.create(formData);

        this.props.onClose();
    }

    renderModalButtons() {
        return [
            <Button color="primary" onClick={this.handleClose}>
                Cancel
            </Button>,
            <Button
                onClick={this.props.handleSubmit(this.handleSubmit)}
                color="primary"
                variant="contained"
                className='create-follower-btn'>
                {this.cfg.doneBtn}
            </Button>
        ];
    }

    renderRegisterControls() {
        return [
            <Field type='password'
                placeholder='Password'
                name='password'
                component={TextField} />
            //     ,

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
        ];
    }

    renderForm() {
        return (
            <form autoComplete='off'>
                <Field type='text'
                    placeholder='Name'
                    name='name'
                    component={TextField} />

                <Field type='email'
                    placeholder='Email'
                    name='email'
                    component={TextField} />

                {!this.props.editMode && this.renderRegisterControls()}
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className='edit-follower-modal'>
                <DialogTitle>{this.cfg.title}</DialogTitle>
                <DialogContent>
                    {this.renderForm()}
                </DialogContent>
                <DialogActions>
                    {this.renderModalButtons()}
                </DialogActions>
            </Dialog>
        );
    }
}

let Form = reduxForm({
    form: 'editFollower',
    validate: (formData) => {
        let errors = {};

        if (!formData.name)
            errors.name = 'Required';

        if (!formData.email) {
            errors.email = 'Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            errors.email = 'Invalid email address'
        }

        if (!formData.password)
            errors.password = 'Required'

        // if (!formData.clinic)
        //     errors.clinic = 'Required';

        return errors;
    }
})(EditFollowerModal);

function mapStateToProps(state) {
    let { modalProps: { followerId, editMode } } = navigationInfoSelector(state);
    let follower = _.find(state.followers.followers, f => f.id === followerId);
    let clinics = state.clinics.clinics;
    let current_clinic_id = state.leaders.leaders.current_clinic_id;

    let ret = {
        follower,
        clinics,
        editMode
    };

    if (follower) {
        ret.initialValues = {
            name: follower.user.name,
            email: follower.user.email
        };
    }
    else {
        ret.initialValues = {
            clinic: current_clinic_id
        };
    }
    return ret;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        update: actions.update,
        create: actions.create
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
