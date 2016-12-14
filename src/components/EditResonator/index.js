import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {actions} from '../../actions/resonatorCreationActions';
import BasicStep from './Steps/basic';
import ScheduleStep from './Steps/schedule';
import ActivationStep from './Steps/activation';
import MediaStep from './Steps/media';
import CriteriaStep from './Steps/Criteria';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Stepper, StepLabel, StepContent, Step
} from 'material-ui/Stepper';
import './index.scss';

class EditResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 4,
            noCreationStep: props.resonator,
            maxCompletedStep: null
        };

        this.steps = [
            this.renderBasic.bind(this),
            this.renderActivation.bind(this),
            this.renderSchedule.bind(this),
            this.renderMedia.bind(this),
            this.renderCriteria.bind(this),
            this.renderFinal.bind(this)
        ];

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.updateActiveStep = this.updateActiveStep.bind(this);
        this.handleFinalUpdate = this.handleFinalUpdate.bind(this);
    }

    componentDidMount() {
        this.props.reset(this.props.params.followerId);
    }

    handleNext() {
        this.updateActiveStep(this.state.activeStep + 1);
    }

    handleBack() {
        this.updateActiveStep(this.state.activeStep - 1);
    }

    handleFinalUpdate() {
        this.props.updateFinal();
    }

    updateActiveStep(activeStep) {
        this.setState({
            activeStep,
            maxCompletedStep: Math.max(this.state.maxCompletedStep, activeStep - 1)
        })
    }

    renderBasic(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Basic
                </StepLabel>
                <StepContent>
                    <BasicStep
                        onNext={this.handleNext}
                    />
                </StepContent>
            </Step>
        );
    }

    renderActivation(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Activation
                </StepLabel>
                <StepContent>
                    <ActivationStep
                        onNext={this.handleNext}
                        onBack={this.handleBack}
                    />
                </StepContent>
            </Step>
        );
    }

    renderSchedule(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Schedule
                </StepLabel>
                <StepContent>
                    <ScheduleStep
                        onNext={this.handleNext}
                        onBack={this.handleBack}
                    />
                </StepContent>
            </Step>
        );
    }

    renderMedia(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Media
                </StepLabel>
                <StepContent>
                    <MediaStep
                        onNext={this.handleNext}
                        onBack={this.handleBack}
                    />
                </StepContent>
            </Step>
        );
    }

    renderCriteria(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Criteria
                </StepLabel>
                <StepContent>
                    <CriteriaStep
                        onNext={this.handleNext}
                        onBack={this.handleBack}
                    />
                </StepContent>
            </Step>
        );
    }

    renderFinal(completed) {
        return (
            <Step completed={completed}>
                <StepLabel>
                    Final
                </StepLabel>
                <StepContent>
                    <RaisedButton label='Update' onClick={this.handleFinalUpdate} />
                </StepContent>
            </Step>
        );
    }

    render() {
        const {maxCompletedStep} = this.state;

        return (
            <div className='row edit-resonator'>
                <div className='col-sm-8 col-sm-offset-2'>
                    <Stepper
                        linear={false}
                        activeStep={this.state.activeStep}
                        orientation='vertical'>
                        {this.steps.map((step, idx) => step(idx <= maxCompletedStep))}
                    </Stepper>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFinal: actions.updateFinal,
        reset: actions.reset,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonator);
