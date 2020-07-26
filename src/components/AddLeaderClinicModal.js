import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/leaderClinicsActions';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
import navigationInfoSelector from '../selectors/navigationSelector';


class AddLeaderClinicModal extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        let newCfg = {
            title: 'Add Leader to Clinic',
            doneBtn: 'Add'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cfg = newCfg;
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(formData) {
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
                keyboardFocused={true}
                className='create-follower-btn'>
                {this.cfg.doneBtn}
            </Button>
        ];
    }

    renderForm() {
        return (
            <form autoComplete='off'>
                <Field
                    type='email'
                    placeholder='Email'
                    name='email'
                    component={TextField} />
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
    form: 'addLeaderToClinic',
    validate: (formData) => {
        let errors = {};

        if (!formData.email) {
            errors.email = 'Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            errors.email = 'Invalid email address'
        }
        return errors;
    }
})(AddLeaderClinicModal);

function mapStateToProps(state) {
    let { modalProps: { clinicId } } = navigationInfoSelector(state);

    let ret = {};
    ret.initialValues = {
        clinic_id: clinicId
    };
    return ret;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        create: actions.create
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
