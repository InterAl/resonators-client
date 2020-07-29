import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../actions/resonatorCreationActions';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';
import BackButton from './backButton';

import StepBase from './stepBase';

class EditResonatorInteractionTypes extends Component {

    static propTypes = {
        updateIntractionType: PropTypes.func
    }

    constructor() {
        super();

        this.state = {
            interactionType: 0
        };
    }


    handleInteractionTypeChange(value, onChange) {
        onChange(value);
        this.props.formData.interactionType = value;
        this.props.updateIntractionType(parseInt(value));
    }

    render() {
        return (
            <div>
                <div className='col-sm-12'>
                    <Field name='interactionType' component={({ input: { onChange, value }, meta, ...custom }) => (
                        <FormControl>
                            <RadioGroup
                                name='interactionType'
                                {...custom}
                                value={value}
                                onChange={(event, value) => this.handleInteractionTypeChange(value, onChange)}>
                                <FormControlLabel value="0" control={<Radio color="primary" />} label="Built-in Criteria" checked={true} />
                                <FormControlLabel value="1" control={<Radio color="primary" />} label="Questionnaire" disabled={true} />
                                <FormControlLabel value="2" control={<Radio color="primary" />} label="Follower Diary" disabled={true} />
                            </RadioGroup>
                        </FormControl>
                    )}></Field>
                    <br></br></div>
                {!this.props.editMode &&
                    <div className='navButtons'>
                        <BackButton onClick={this.props.onBack}
                            style={{ marginRight: 8 }} />
                        {<Button
                            color="primary"
                            variant="contained"
                            style={{ marginRight: 8 }}
                            onClick={this.props.onNext}>
                            Next
                        </Button>}
                    </div>}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator,
        editMode: state.resonatorCreation.editMode,
        formData: state.resonatorCreation.formData
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCreationStep: actions.updateCreationStep,
    }, dispatch);
}


EditResonatorInteractionTypes = StepBase({
    noBack: true,
    noNext: true,
    validate(formData, /* props */) {
        let errors = {};
        /*
        if (formData.interactionType === undefined) {
            if (formData.oneOff === undefined || formData.oneOff == 'off')
                formData.interactionType = '0';
            else
                formData.interactionType = '1';
        }
        props.updateIntractionType(parseInt(formData.interactionType));
        */
        formData.interactionType = '0';

        return errors;
    }
})(EditResonatorInteractionTypes);

EditResonatorInteractionTypes = connect(mapStateToProps, mapDispatchToProps)(EditResonatorInteractionTypes);
export default EditResonatorInteractionTypes;
