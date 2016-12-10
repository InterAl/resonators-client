import React from 'react';
import {bindActionCreators} from 'redux';
import {actions} from '../../../actions/resonatorActions';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import NavButtons from './navButtons';

export default ({
    formName,
    noNext = false,
    noBack = false,
    validate = (() => ({}))}) => Component => {
    let StepBase = props => {
        function handleSubmit(formData) {
            props.updateCreationStep(formData);
            props.onNext();
        }

        return (
            <form onSubmit={props.handleSubmit(handleSubmit)}>
                <Component {...props} />
                <NavButtons noNext={noNext} noBack={noBack} onBack={props.onBack} />
            </form>
        );
    };

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            updateCreationStep: actions.updateCreationStep
        }, dispatch);
    }

    function mapStateToProps() {
        return {};
    }

    StepBase = connect(mapStateToProps, mapDispatchToProps)(StepBase);
    StepBase = reduxForm({ form: formName, validate })(StepBase);
    return StepBase;
}
