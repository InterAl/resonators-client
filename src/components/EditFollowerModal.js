import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../actions/followersActions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
import SelectField from './FormComponents/SelectField';
import navigationInfoSelector from '../selectors/navigationSelector';

const {PropTypes} = React;

class EditFollowerModal extends Component {
    static propTypes: {
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

    handleSubmit() {
        this.props.onClose(this.props.handleSubmit);
    }

    renderModalButtons() {
        return [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                onTouchTap={this.handleSubmit}
                label={this.cfg.doneBtn}
                primary={true}
                keyboardFocused={true}
            />
        ];
    }

    renderRegisterControls() {
        return [
            <Field type='password'
                placeholder='Password'
                name='password'
                component={TextField} />,

            <Field name='clinic'
                   label='Clinic'
                   required={true}
                   component={SelectField}>
            {
                this.props.clinics.map(clinic => (
                    <MenuItem value={clinic.id} primaryText={clinic.name} />
                ))
            }
            </Field>
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
            <Dialog
                open={this.props.open}
                title={this.cfg.title}
                modal={false}
                actions={this.renderModalButtons()}
            >
                {this.renderForm()}
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

        if (!formData.clinic)
            errors.clinic = 'Required';

        return errors;
    }
})(EditFollowerModal);

function mapStateToProps(state) {
    let {modalProps: {followerId, editMode}} = navigationInfoSelector(state);
    let follower = _.find(state.followers.followers, f => f.id === followerId);
    let clinics = state.clinics.clinics;

    return {
        follower,
        clinics,
        editMode
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        update: actions.update,
        create: actions.create
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(props => {
    function handleCreateSubmit(formData) {
        props.create(formData);
    }

    function handleUpdateSubmit(formData) {
        props.update({...formData, id: props.followerId});
    }

    function handleSubmit(formData) {
        if (props.editMode)
            handleUpdateSubmit(formData);
        else
            handleCreateSubmit(formData);
    }

    return (
        <Form onSubmit={handleSubmit}
              initialValues={props.follower && {
                  name: props.follower.user.name,
                  email: props.follower.user.email
              }} {...props} />
    );
})
