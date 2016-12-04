import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as navigationActions} from '../actions/navigationActions';
import EditFollowerModal from './EditFollowerModal';

const modalMap = {
    'editFollower': EditFollowerModal
};

class ModalDisplayer extends Component {
    getModal(modal) {
        let Modal = modalMap[modal.name];

        if (Modal)
            return <Modal open={true}
                          onClose={this.props.hideModal}
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
