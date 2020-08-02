import React, { Component } from "react";
import { Field } from "redux-form";
import TextField from "../../FormComponents/TextField";
import StepBase from "./stepBase";

class EditResonatorBasic extends Component {
    render() {
        return (
            <div>
                <Field name="title" label="Title" component={TextField} />
                <Field
                    name="description"
                    label="Description"
                    multiline
                    rows={2}
                    rowsMax={10}
                    component={TextField}
                />
                <Field name="link" label="Link" type="url" component={TextField} />
            </div>
        );
    }
}

export default StepBase({
    noBack: true,
    validate(formData) {
        let errors = {};
        if (!formData.title) errors.title = "Required";
        if (!formData.description) errors.description = "Required";
        return errors;
    },
})(EditResonatorBasic);
