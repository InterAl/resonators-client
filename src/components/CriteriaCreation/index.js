import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../actions/criteriaActions';
import {reduxForm, formValueSelector} from 'redux-form';
// import ClinicSelect from '../FormComponents/ClinicSelect';
import TextBox from '../FormComponents/TextBox';
import Select from '../FormComponents/Select';
import { MenuItem, Paper, Button, Typography } from '@material-ui/core';
import NumericCreation from './NumericCreation';
import BooleanCreation from './BooleanCreation';
import ValueListCreation from './ValueListCreation';
import './index.scss';

const formSelector = formValueSelector('criteriaCreation');

class CriteriaCreation extends Component {
    constructor(props) {
        super(props);

        this.editMode = !!props.match.params.criterionId;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getCreationTypeControl() {
        const {formValues} = this.props;

        switch (formValues.question_kind) {
            case 'numeric':
                return NumericCreation;
            case 'boolean':
                return BooleanCreation;
            case 'valuelist':
                return ValueListCreation;
        }
    }

    handleSubmit(form) {
        if (this.editMode) {
            this.props.updateCriterion({
                criterionId: this.props.match.params.criterionId,
                ...form
            });
        } else {
            this.props.createCriterion(form);
        }
    }

    render() {
        const CriterionType = this.getCreationTypeControl();

        return (
            <div className='criteria-creation row col-xs-12 col-md-6 col-md-offset-3'>
                <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
                    <Paper className='card col-xs-12'>
                        <Typography variant="subtitle1">Criterion Creation</Typography>
                        {/* <ClinicSelect/> */}
                        <TextBox multiLine name='title' placeholder='Title'/>
                        <TextBox multiLine name='description' placeholder='Description'/>
                        <Select name='question_kind' label='Criteria Type'>
                            <MenuItem value='numeric'>Numeric</MenuItem>
                            <MenuItem value='boolean'>True / False</MenuItem>
                            {/* <MenuItem value='valuelist'>Value List</MenuItem> */}
                        </Select>
                    </Paper>
                    {CriterionType &&
                        <div>
                            <Paper className='card col-xs-12'>
                                <CriterionType formValues={this.props.formValues} />
                                <Button
                                    type='submit'
                                    className='submit'
                                    color="primary"
                                    variant="contained">
                                    {this.editMode ? 'Update' : 'Create'}
                                </Button>
                            </Paper>
                        </div>
                    }
                </form>
            </div>
        );
    }
}

function initializeNumeric(criterion, formValues) {
    const answers = _.reduce(criterion.answers, (acc, cur) => {
        acc[`num${cur.rank}`] = cur.body;
        return acc;
    }, {});

    let numMax = _(criterion.answers).map('rank').max();
    let numMin = _(criterion.answers).map('rank').min();

    return {answers, numMax, numMin};
}

function initializeBoolean(criterion) {
    const answers = _.reduce(criterion.answers, (acc, cur) => {
        if (cur.rank === 0)
            acc.false = cur.body;
        else
            acc.true = cur.body;

        return acc;
    }, {});

    return {answers};
}

function getInitialValues(criterion, formValues) {
    let answers, numMin, numMax;

    if (criterion.question_kind === 'numeric') {
        ({answers, numMin, numMax} = initializeNumeric(criterion, formValues));
    } else if (criterion.question_kind === 'boolean') {
        ({answers} = initializeBoolean(criterion));
    }

    return {
        title: criterion.title,
        description: criterion.description,
        clinic_id: criterion.clinic_id,
        question_kind: criterion.question_kind,
        answers,
        numMin,
        numMax
    };
}

function mapStateToProps(state, ownProps) {
    const criterion = _.find(state.criteria.criteria,
                             c => c.id === ownProps.match.params.criterionId);

    const formValues = formSelector(state,
                                 'title',
                                 'description',
                                 'question_kind',
                                 'answers',
                                 'numMin',
                                 'numMax');

    const initialValues = criterion !== undefined ? getInitialValues(criterion, formValues) : { clinic_id : state.leaders.leaders.current_clinic_id};
    return {
        initialValues,
        formValues
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createCriterion: actions.createCriterion,
        updateCriterion: actions.updateCriterion
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'criteriaCreation',
    validate(form) {
        let errors = {}

        if (!form.title)
            errors.title = 'Required';

        if (!form.description)
            errors.description = 'Required';

        if (!form.criteriaType)
            errors.criteriaType = 'Required';

        // if (!form.clinic)
        //     errors.clinic = 'Required';

        if (form.criteriaType === 'numeric') {
            if (!form.numMin)
                errors.numMin = 'Required';

            if (!form.numMax)
                errors.numMax = 'Required';
        }

        return errors;
    }
})(CriteriaCreation));
