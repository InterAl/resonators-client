import _ from "lodash";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../actions/criteriaActions";
import { reduxForm, formValueSelector, Field } from "redux-form";
// import ClinicSelect from '../FormComponents/ClinicSelect';
import TextField from "../FormComponents/TextField";
import { MenuItem, Card, Button, Typography, CardActions, CardContent, Collapse, TextField as MuiTextField } from "@material-ui/core";
import NumericCreation from "./NumericCreation";
import BooleanCreation from "./BooleanCreation";
import ValueListCreation from "./ValueListCreation";

const formSelector = formValueSelector("criteriaCreation");

class CriteriaCreation extends Component {
    constructor(props) {
        super(props);

        this.editMode = !!props.match.params.criterionId;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getCreationTypeControl() {
        const { formValues } = this.props;

        switch (formValues.question_kind) {
            case "numeric":
                return NumericCreation;
            case "boolean":
                return BooleanCreation;
            case "valuelist":
                return ValueListCreation;
        }
    }

    handleSubmit(form) {
        if (this.editMode) {
            this.props.updateCriterion({
                criterionId: this.props.match.params.criterionId,
                ...form,
            });
        } else {
            this.props.createCriterion(form);
        }
    }

    renderTypeSelector({ input: { value, onChange }, meta: { touched, error }, ...custom }) {
        return (
            <MuiTextField
                select
                fullWidth
                onChange={(event) => onChange(event.target.value)}
                inputProps={{value}}
                error={touched && error}
                {...custom}
            >
                <MenuItem value="numeric">Numeric</MenuItem>
                <MenuItem value="boolean">Yes / No</MenuItem>
            </MuiTextField>
        );
    }

    render() {
        const CriterionType = this.getCreationTypeControl();

        return (
            <Card style={{ margin: "30px 30%", maxHeight: "100%" }}>
                <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
                    <CardContent>
                        <Typography variant="h6">Create a New Criterion</Typography>
                        {/* <ClinicSelect/> */}
                        <Field name="title" label="Name" component={TextField} />
                        <Field name="description" label="Description" multiline component={TextField} />
                        <Field name="question_kind" label="Type" component={this.renderTypeSelector} />
                    </CardContent>
                    <Collapse in={Boolean(this.props.formValues.question_kind)} unmountOnExit>
                        <CardContent>
                            {CriterionType && <CriterionType formValues={this.props.formValues} />}
                        </CardContent>
                    </Collapse>
                    <CardActions style={{ justifyContent: "end" }}>
                        <Button type="submit" color="primary" variant="contained" disabled={this.props.invalid}>
                            {this.editMode ? "Update" : "Create"}
                        </Button>
                    </CardActions>
                </form>
            </Card>
        );
    }
}

function initializeNumeric(criterion, formValues) {
    const answers = _.reduce(
        criterion.answers,
        (acc, cur) => {
            acc[`num${cur.rank}`] = cur.body;
            return acc;
        },
        {}
    );

    let numMax = _(criterion.answers).map("rank").max();
    let numMin = _(criterion.answers).map("rank").min();

    return { answers, numMax, numMin };
}

function initializeBoolean(criterion) {
    const answers = _.reduce(
        criterion.answers,
        (acc, cur) => {
            if (cur.rank === 0) acc.false = cur.body;
            else acc.true = cur.body;

            return acc;
        },
        {}
    );

    return { answers };
}

function getInitialValues(criterion, formValues) {
    let answers, numMin, numMax;

    if (criterion.question_kind === "numeric") {
        ({ answers, numMin, numMax } = initializeNumeric(criterion, formValues));
    } else if (criterion.question_kind === "boolean") {
        ({ answers } = initializeBoolean(criterion));
    }

    return {
        title: criterion.title,
        description: criterion.description,
        clinic_id: criterion.clinic_id,
        question_kind: criterion.question_kind,
        answers,
        numMin,
        numMax,
    };
}

function mapStateToProps(state, ownProps) {
    const criterion = _.find(state.criteria.criteria, (c) => c.id === ownProps.match.params.criterionId);

    const formValues = formSelector(state, "title", "description", "question_kind", "answers", "numMin", "numMax");

    const initialValues =
        criterion !== undefined
            ? getInitialValues(criterion, formValues)
            : { clinic_id: state.leaders.leaders.current_clinic_id };
    return {
        initialValues,
        formValues,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createCriterion: actions.createCriterion,
            updateCriterion: actions.updateCriterion,
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    reduxForm({
        form: "criteriaCreation",
        validate(form) {
            let errors = {};

            if (!form.title) errors.title = "Required";

            if (!form.description || !form.description.trim()) errors.description = "Required";

            if (!form.question_kind) errors.question_kind = "Required";

            // if (!form.clinic)
            //     errors.clinic = 'Required';

            if (form.question_kind === "numeric") {
                if (!form.numMin) errors.numMin = "Required";
                if (!form.numMax) errors.numMax = "Required";
                if (form.numMin && form.numMax) {
                    const [min, max] = [parseInt(form.numMin), parseInt(form.numMax)];
                    if (min >= max) {
                        errors.numMin = "Should be smaller than the maximum";
                        errors.numMax = "Should be larger then the minimum";
                    }
                }
            }

            if (form.question_kind === "boolean") {
                errors.answers = {};
                if (!(form.answers && form.answers.true)) errors.answers.true = "Required";
                if (!(form.answers && form.answers.false)) errors.answers.false = "Required";
            }

            return errors;
        },
    })(CriteriaCreation)
);
