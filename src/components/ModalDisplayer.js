import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import EditFollowerModal from './EditFollowerModal';
import DeleteFollowerPrompt from './DeleteFollowerPrompt';
import FreezeFollowerPrompt from './FreezeFollowerPrompt';
import EditFollowerGroupModal from './EditFollowerGroupModal';
import DeleteFollowerGroupPrompt from './DeleteFollowerGroupPrompt';
import FreezeFollowerGroupPrompt from './FreezeFollowerGroupPrompt';
import DeleteResonatorPrompt from './DeleteResonatorPrompt';
import DeleteCriterionPrompt from './DeleteCriterionPrompt';
import RegistrationModal from './RegistrationModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';
import AddLeaderClinicModal from './AddLeaderClinicModal'
import ResetResonatorPrompt from './ResetResonatorPrompt';
import FreezeCriterionPrompt from './FreezeCriterionPrompt';


const modalMap = {
    'editFollower': EditFollowerModal,
    'deleteFollower': DeleteFollowerPrompt,
    'freezeFollower': FreezeFollowerPrompt,
    'editFollowerGroup': EditFollowerGroupModal,
    'deleteFollowerGroup': DeleteFollowerGroupPrompt,
    'freezeFollowerGroup': FreezeFollowerGroupPrompt,
    'deleteResonator': DeleteResonatorPrompt,
    'deleteCriterion': DeleteCriterionPrompt,
    'registration': RegistrationModal,
    'forgotPassword': ForgotPasswordModal,
    'forgotPasswordSuccess': ForgotPasswordSuccess,
    'addLeaderToClinic' : AddLeaderClinicModal,
    'resetResonator': ResetResonatorPrompt,
    'freezeCriterion': FreezeCriterionPrompt,
};

class ModalDisplayer extends Component {
    constructor() {
        super();

        this.state = {
            transition: false
        };

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(cb) {
        cb = typeof cb === 'function' ? cb : _.noop;
        this.setState({ transition: true });

        setTimeout(() => {
            this.props.hideModal();
            cb();
            this.setState({ transition: false });
        }, 400);
    }

    getModal(modal) {
        let Modal = modalMap[modal.name];

        let open = !this.state.transition;

        if (Modal)
            return <Modal open={open}
                          onClose={this.handleClose}
                          {...modal.props}
                   />

        return null;
    }

    render() {
        const {modal} = this.props;
        return modal && this.getModal(modal);
    }
}

export default connect(() => ({}), dispatch => bindActionCreators({
    hideModal: navigationActions.hideModal
}, dispatch))(ModalDisplayer)
