import React, { Component } from "react";
import { Field } from "redux-form";
import TextField from "../../FormComponents/TextField";
import StepBase from "./stepBase";
import MUIRichTextEditor from "mui-rte";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { richEditorTheme } from "../../richEditorTheme";
import {ContentState, convertFromHTML, convertToRaw} from "draft-js";
import {stateToHTML} from 'draft-js-export-html';
import { connect } from "react-redux";

class EditResonatorBasic extends Component {

    constructor(props) {
        super(props);

        this.bodyRich = props.description || "";
        this.richChange = this.richChange.bind(this);
    }

    richChange(state) {
        const bodyHTML = stateToHTML(state.getCurrentContent());
        if (this.bodyRich !== bodyHTML) {
            this.bodyRich = bodyHTML;
            this.props.formData.description = bodyHTML;
        }
    }

    render() {
        return (
            <div>
                <Field name="title" label="Title" component={TextField} style={{ marginBottom:"25px" }}/>
                <Field type="text" placeholder="Description" label="Description" name="description" component={({ input: { onChange, value }, meta, ...custom }) => {
                    const contentHTML = convertFromHTML(value);
                    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
                    const content = JSON.stringify(convertToRaw(state));

                    return (
                        <MuiThemeProvider theme={richEditorTheme}>
                            <MUIRichTextEditor
                                defaultValue={content}
                                controls={[]}
                                label="Description"
                                onChange={this.richChange}
                            />
                        </MuiThemeProvider>
                    );
                }} />
                <Field name="link" label="Link" type="url" component={TextField} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        formData: state.resonatorCreation?.formData,
    };
}

export default connect(mapStateToProps, null)(StepBase({
    noBack: true,
    validate(formData) {
        let errors = {};
        if (!formData.title) errors.title = "Required";
        if (!formData.description) errors.description = "Required";
        return errors;
    },
})(EditResonatorBasic));
