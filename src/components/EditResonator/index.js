import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../actions/resonatorCreationActions";
import BasicStep from "./Steps/basic";
import ScheduleStep from "./Steps/schedule";
import ActivationStep from "./Steps/activation";
import MediaStep from "./Steps/media";
import CriteriaStep from "./Steps/Criteria";
import InteractionTypes from "./Steps/InteractionTypes";
import { Typography, Button, CircularProgress, Stepper, Step, StepLabel, StepContent } from "@material-ui/core";
import Questionnaire from "./Steps/Questionnaire";
import DailyDiary from "./Steps/DailyDiary";
import BackButton from "./Steps/backButton";
import followersSelector from "../../selectors/followersSelector";
import _ from "lodash";

class EditResonator extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
    };

    static defaultProps = {
        editMode: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            noCreationStep: props.resonator,
            interactionTypeUsed: 0,
            oneOffValue: "off",
            maxCompletedStep: 0,
        };

        this.steps = [
            this.renderBasic.bind(this),
            this.renderSchedule.bind(this),
            this.renderMedia.bind(this),
            this.renderInteractionTypes.bind(this),
            this.renderInteraction.bind(this),
            this.renderFinal.bind(this),
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
        const { followerId, followerGroupId, resonatorId } = this.props.match.params;
        this.props.reset({
            targetType: followerId ? 'follower' : 'followerGroup',
            targetId: followerId || followerGroupId,
            resonatorId,
        });
    }

    handleNext() {
        this.updateActiveStep(this.state.activeStep + 1);
    }

    handleBack() {
        this.updateActiveStep(this.state.activeStep - 1);
    }

    handleFinalUpdate() {
        const { followerId } = this.props.match.params;
        this.props.updateFinal({ targetType: followerId ? 'follower' : 'followerGroup' });
    }

    updateActiveStep(activeStep) {
        this.setState({
            activeStep,
            maxCompletedStep: Math.max(this.state.maxCompletedStep, activeStep - 1),
        });
    }

    updateIntractionType = (interactionTypeUsed) => {
        this.setState({ interactionTypeUsed });
        if (this.formData !== undefined) this.formData.interactionType = interactionTypeUsed;
    };

    updateOneOff = (oneOffValue) => {
        this.setState({ oneOffValue });
    };

    renderBasic() {
        return {
            label: "Basic",
            content: <BasicStep editMode={this.props.editMode} onNext={this.handleNext} />,
        };
    }

    renderActivation() {
        return {
            label: "Activation",
            content: (
                <ActivationStep editMode={this.props.editMode} onNext={this.handleNext} onBack={this.handleBack} />
            ),
        };
    }

    renderSchedule() {
        const { followerId } = this.props.match.params;
        if (this.props.getFollower(followerId)?.is_system) return false;
        return {
            label: "Schedule",
            content: (
                <ScheduleStep
                    editMode={this.props.editMode}
                    onNext={this.handleNext}
                    onBack={this.handleBack}
                    updateOneOff={this.updateOneOff}
                    targetType={followerId ? 'follower' : 'followerGroup'}
                />
            ),
        };
    }

    renderMedia() {
        return {
            label: "Media",
            content: <MediaStep editMode={this.props.editMode} onNext={this.handleNext} onBack={this.handleBack} />,
        };
    }

    renderInteractionTypes() {
        return {
            label: "Interaction Type",
            content: (
                <InteractionTypes
                    editMode={this.props.editMode}
                    onNext={this.handleNext}
                    onBack={this.handleBack}
                    updateIntractionType={this.updateIntractionType}
                />
            ),
        };
    }

    renderInteraction() {
        if (this.state.interactionTypeUsed === undefined || this.state.interactionTypeUsed == 0)
            return this.renderCriteria();
        else if (this.state.interactionTypeUsed == 1) return this.renderQuestionnaire();
        else if (this.state.interactionTypeUsed == 2) return this.renderDailyDiary();
    }

    renderCriteria() {
        return {
            label: "Criteria",
            content: <CriteriaStep editMode={this.props.editMode} onNext={this.handleNext} onBack={this.handleBack} />,
        };
    }

    renderQuestionnaire() {
        return {
            label: "Questionnaire",
            content: <Questionnaire editMode={this.props.editMode} onNext={this.handleNext} onBack={this.handleBack} />,
        };
    }

    renderDailyDiary() {
        return {
            label: "Daily Diary",
            content: <DailyDiary editMode={this.props.editMode} onNext={this.handleNext} onBack={this.handleBack} />,
        };
    }

    renderFinal() {
        const { followerId } = this.props.match.params;

        return {
            label: "Final",
            content: (
                <div>
                    {(!this.props.getFollower(followerId)?.is_system) && <ActivationStep /> }
                    <div className="navButtons">
                        {!this.props.editMode && (
                            <BackButton
                                onClick={this.handleBack}
                                style={{ marginRight: 8 }}
                                disabled={this.props.showSpinnerFinalUpdate}
                            />
                        )}
                        <span style={{ position: "relative", width: "max-content" }}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.handleFinalUpdate}
                                disabled={this.props.showSpinnerFinalUpdate}
                            >
                                {this.props.editMode ? "Update" : "Finish"}
                            </Button>
                            {this.props.showSpinnerFinalUpdate && (
                                <CircularProgress
                                    size={24}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        marginTop: -12,
                                        marginLeft: -12,
                                    }}
                                />
                            )}
                        </span>
                    </div>
                </div>
            ),
        };
    }

    renderStep(index, { label, content }) {
        return (
            <Step
                key={index}
                completed={this.props.editMode || index <= this.state.maxCompletedStep}
                active={this.props.editMode || index === this.state.activeStep}
            >
                <StepLabel>{label}</StepLabel>
                <StepContent>{content}</StepContent>
            </Step>
        );
    }

    render() {
        return (
            <div style={{ flex: 1, padding: "10px 20px" }}>
                <Typography variant="h5">{this.props.editMode ? "Edit Resonator" : "Create Resonator"}</Typography>
                <Stepper nonLinear={true} activeStep={this.state.activeStep} orientation="vertical">
                    {this.steps.filter(step => step().content).map((step, index) => this.renderStep(index, step()))}
                </Stepper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let followersData = followersSelector(state);
    const systemFollowers = state.followers.systemFollowers;

    return {
        resonator: state.resonatorCreation.resonator,
        editMode: state.resonatorCreation.editMode,
        interactionType: state.resonatorCreation.interactionType,
        showSpinnerFinalUpdate: state.resonatorCreation.showSpinnerFinalUpdate,
        formData: state.resonatorCreation.formData,
        getFollower: (followerId) => _.find(followersData.followers, (f) => f.id === followerId) || _.find(systemFollowers, (f) => f.id === followerId),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateFinal: actions.updateFinal,
            reset: actions.reset,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonator);
