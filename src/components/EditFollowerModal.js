import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../actions/followersActions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form';
import TextField from './FormComponents/TextField';
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

        this.cfg = props.editMode ? editCfg : newCfg;
    }

    handleSubmit() {
        this.props.update();
    }

    handleClose() {
        this.props.onClose();
    }

    renderModalButtons() {
        return [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onClose}
            />,
            <FlatButton
                type='submit'
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
                component={TextField} />
        ];
    }

    renderForm() {
        return (
            <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
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
                open={true}
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
})(EditFollowerModal);

function mapStateToProps(state) {
    let props = _.get(navigationInfoSelector(state), 'modal.props');
    let follower = _.find(state.followers.followers, f => f.id === props.followerId);
    let clinics = state.clinics.clinics;

    return {
        follower,
        clinics,
        editMode: props.editMode
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        update: actions.update,
        create: actions.create
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(props => (
    <Form initialValues={props.follower && {
            name: props.follower.user.name,
            email: props.follower.user.email
        }} {...props} />
))
