import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../../actions/resonatorCreationActions";
import { Field } from "redux-form";
import BackButton from "./backButton";
import { Button, Checkbox, FormControlLabel, FormControl, FormLabel, FormGroup } from "@material-ui/core";
import TimePicker from "../../FormComponents/TimePicker";

import StepBase from "./stepBase";
import moment from "moment";

var selectedDayIndex = -1;

class EditResonatorSchedule extends Component {
    static propTypes = {
        updateIntractionType: PropTypes.func,
    };

    constructor() {
        super();

        this.handleCreate = this.handleCreate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSelectTime = this.handleSelectTime.bind(this);

        this.state = {
            bla: new Date(),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.resonatorCreated && nextProps.resonatorCreated) this.props.onNext();
    }

    handleCreate(formData) {
        this.props.updateCreationStep(formData);
        this.props.createResonator();
    }

    handleUpdate(formData) {
        this.props.updateCreationStep(formData);
        this.props.onNext();
    }

    handleSelectTime(dateTime) {
        const now = moment();
        if (!dateTime) {
            dateTime = now;
        }
        if (dateTime <= now) {
            // So the server won't immediately send it
            dateTime = now.add(1, "d").set({ hour: dateTime.get("hour"), minute: dateTime.get("minute") });
        }
        return dateTime.toDate();
    }

    handleSelectDay(checked, onChange, selectedIndex) {
        selectedDayIndex = selectedIndex;
        onChange(checked);
    }

    renderDays() {
        return (
            <FormControl>
                <FormLabel>Active days</FormLabel>
                <FormGroup row>
                    {[0, 1, 2, 3, 4, 5, 6].map((number) => (
                        <Field
                            key={number}
                            name={`day${number}`}
                            component={({ input: { onChange, value }, meta, ...custom }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={!!value}
                                            onChange={(e, checked) => this.handleSelectDay(checked, onChange, number)}
                                            {...custom}
                                        />
                                    }
                                    label={moment().startOf("w").add(number, "d").format("ddd")}
                                />
                            )}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        );
    }

    renderTimeSelector() {
        return (
            <Field
                name="time"
                component={TimePicker}
                label="Time of day (24h format)"
                style={{ width: "max-content" }}
                normalize={this.handleSelectTime}
            />
        );
    }

    handleSelectOneOff(value, onChange) {
        let result = value === "on" ? "off" : "on";
        onChange(result);
    }

    renderOneOff() {
        return (
            <Field
                name="oneOff"
                component={({ input: { onChange, value }, meta, ...custom }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={value === "on"}
                                onChange={() => this.handleSelectOneOff(value, onChange)}
                                {...custom}
                            />
                        }
                        label="Send only once"
                        style={{ marginTop: 8 }}
                    />
                )}
            />
        );
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {this.renderDays()}
                {this.renderTimeSelector()}
                {this.renderOneOff()}
                {!this.props.editMode && (
                    <div className="navButtons">
                        <BackButton onClick={this.props.onBack} style={{ marginRight: 8 }} />
                        {
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginRight: 8 }}
                                disabled={this.props.invalid}
                                onClick={this.props.handleSubmit(
                                    this.props.resonatorCreated ? this.handleUpdate : this.handleCreate
                                )}
                            >
                                Next
                            </Button>
                        }
                    </div>
                )}
            </div>
        );
    }
}

EditResonatorSchedule = StepBase({
    noNext: true,
    noBack: true,
    validate(formData /* props */) {
        let errors = {};

        // TODO: This is a horrible solution. Component logic shouldn't be put in the form
        // validation. This should be inside a day-picker component and the one-off field.
        // It will be possible once we create a dedicated day-picker. See below TODO for more info.
        if (formData.oneOff === "on") {
            var selectedOne = false;
            [0, 1, 2, 3, 4, 5, 6].forEach((item, i) => {
                if (formData[`day${item}`] && !selectedOne && selectedDayIndex >= 0 && selectedDayIndex == i)
                    selectedOne = true;
                else formData[`day${item}`] = false;
            });
        }

        if (formData.time && !formData.time.valueOf()) errors.time = "Invalid time";

        if (![0, 1, 2, 3, 4, 5, 6].some((day) => formData[`day${day}`])) {
            // TODO: This is a temporary patch to make the Next button disabled.
            // A correct implementation would separate the week day selection as a separate component
            // which can be used inside a redux-form Field, and would handle everything internally.
            // This means that day checkboxes will no longer be separate Fields, and so the saga logic
            // handling their aggregation (and unpacking from server data) will have to be moved to the
            // new component.
            // This approach will also allow to display a selection-wide error message, which is currently
            // not displayed.
            errors.day0 = "No day selected";
        }

        // props.updateIntractionType(parseInt(formData.interactionType));

        return errors;
    },
})(EditResonatorSchedule);

EditResonatorSchedule = connect(
    (state) => ({
        resonatorCreated: state.resonatorCreation.resonator,
    }),
    (dispatch) =>
        bindActionCreators(
            {
                createResonator: actions.create,
                updateCreationStep: actions.updateCreationStep,
            },
            dispatch
        )
)(EditResonatorSchedule);

export default EditResonatorSchedule;
