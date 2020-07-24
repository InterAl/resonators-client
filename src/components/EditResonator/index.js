import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {actions} from '../../actions/resonatorCreationActions';
import BasicStep from './Steps/basic';
import ScheduleStep from './Steps/schedule';
import ActivationStep from './Steps/activation';
import MediaStep from './Steps/media';
import CriteriaStep from './Steps/Criteria';
import InteractionTypes from './Steps/InteractionTypes';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {
    Stepper, StepLabel, StepContent, Step
} from 'material-ui/Stepper';
import './index.scss';
import Questionnaire from './Steps/Questionnaire';
import DailyDiary from './Steps/DailyDiary';

class EditResonator extends Component {
    static propTypes = {
        editMode: PropTypes.bool
    }

    static defaultProps = {
        editMode: true
    }

    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            noCreationStep: props.resonator,
            interactionTypeUsed: 0,
            oneOffValue: 'off',
            maxCompletedStep: null
        };

        this.steps = [
            this.renderBasic.bind(this),
            this.renderSchedule.bind(this),
            this.renderMedia.bind(this),
            this.renderInteractionTypes.bind(this),
            this.renderInteraction.bind(this),
            this.renderFinal.bind(this)
        ];

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.updateActiveStep = this.updateActiveStep.bind(this);
        this.handleFinalUpdate = this.handleFinalUpdate.bind(this);
        this.updateIntractionType = this.updateIntractionType.bind(this);
        this.updateOneOff = this.updateOneOff.bind(this);
        this.renderCriteria = this.renderCriteria.bind(this);
        this.renderQuestionnaire = this.renderQuestionnaire.bind(this);
        this.renderDailyDiary = this.renderDailyDiary.bind(this);

    }

    componentDidMount() {
        const {followerId, resonatorId} = this.props.match.params;
        this.props.reset({followerId, resonatorId});
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

    updateIntractionType = (interactionTypeUsed) => {
        this.setState({ interactionTypeUsed});
        if (this.formData !== undefined)
            this.formData.interactionType = interactionTypeUsed;
    }

    updateOneOff = (oneOffValue) => {
        this.setState({ oneOffValue });
    }

    renderBasic() {
        return {
            label: 'Basic',
            content: <BasicStep
                editMode={this.props.editMode}
                onNext={this.handleNext}
            />
        };
    }

    renderActivation() {
        return {
            label: 'Activation',
            content: <ActivationStep
                    editMode={this.props.editMode}
                    onNext={this.handleNext}
                    onBack={this.handleBack}
                />
        };
    }

    renderSchedule() {
        return {
            label: 'Schedule',
            content: <ScheduleStep
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
                updateOneOff={this.updateOneOff}
            />
        };
    }

    renderMedia() {
        return {
            label: 'Media',
            content: <MediaStep
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
            />
        };
    }

    renderInteractionTypes() {
        return {
            label: 'Interaction Type',
            content: <InteractionTypes
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
                updateIntractionType={this.updateIntractionType}
            />
        };
    }

    renderInteraction() {
        if ((this.state.interactionTypeUsed === undefined) || this.state.interactionTypeUsed == 0)
            return this.renderCriteria();
        else if (this.state.interactionTypeUsed == 1)
            return this.renderQuestionnaire()
        else if (this.state.interactionTypeUsed == 2)
            return this.renderDailyDiary()
    }

    renderCriteria() {
        return {
            label: 'Criteria',
            content: <CriteriaStep
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
            />
        };
    }

    renderQuestionnaire() {
        return {
            label: 'Questionnaire',
            content: <Questionnaire
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
            />
        };
    }

    renderDailyDiary() {
        return {
            label: 'Daily Diary',
            content: <DailyDiary
                editMode={this.props.editMode}
                onNext={this.handleNext}
                onBack={this.handleBack}
            />
        };
    }

    renderFinal() {
        return {
            label: 'Final',
            content: <div className='finalUpdateStep'>
                        <ActivationStep/>
                        <RaisedButton
                            primary={true}
                            label='Submit'
                            onTouchTap={this.handleFinalUpdate} />
                        {this.props.showSpinnerFinalUpdate &&
                         <CircularProgress size={30} thickness={3}/>}
                     </div>
        };
    }

    renderStep(idx, {label, content}) {
        let activeProp = this.props.editMode ? {active: true} : null;

        return (
            <Step key={idx} completed={idx <= this.state.maxCompletedStep}>
                <StepLabel>
                    {label}
                </StepLabel>
                <StepContent {...activeProp}>
                    {content}
                </StepContent>
            </Step>);
    }

    render() {
        return (
            <div className='row edit-resonator'>
                <div className='col-xs-8 col-sm-8 col-sm-offset-2'>
                    <Subheader>
                        {this.props.editMode ? 'Edit Resonator' : 'Create Resonator'}
                    </Subheader>
                    <Stepper
                        linear={false}
                        activeStep={this.state.activeStep}
                        orientation='vertical'>
                        {this.steps.map((step, idx) => this.renderStep(idx, step()))}
                    </Stepper>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator,
        editMode: state.resonatorCreation.editMode,
        interactionType: state.resonatorCreation.interactionType,
        showSpinnerFinalUpdate: state.resonatorCreation.showSpinnerFinalUpdate,
        formData: state.resonatorCreation.formData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFinal: actions.updateFinal,
        reset: actions.reset,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonator);
