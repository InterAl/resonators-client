import React from 'react';
import {bindActionCreators} from 'redux';
import {actions} from '../../../actions/resonatorCreationActions';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import NavButtons from './navButtons';

export default ({
    noNext = false,
    noBack = false,
    validate = (() => ({}))} = {}) => Component => {
    let StepBase = props => {
        function handleSubmit(formData) {
            props.updateCreationStep(formData);
            props.onNext();
        }

        return (
            <form onSubmit={props.handleSubmit(handleSubmit)}>
                <Component {...props} />
                {!props.editMode &&
                <NavButtons noNext={noNext} noBack={noBack} onBack={props.onBack}/>}
            </form>
        );
    };

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            updateCreationStep: actions.updateCreationStep,
        }, dispatch);
    }

    function mapStateToProps(state) {
        return {
            initialValues: state.resonatorCreation.formData,
            enableReinitialize: true
        };
    }

    StepBase = reduxForm({
        form: 'resonatorCreation',
        destroyOnUnmount: false,
        validate,
    })(StepBase);
    StepBase = connect(mapStateToProps, mapDispatchToProps)(StepBase);
    return StepBase;
}
