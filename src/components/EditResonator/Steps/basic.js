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
import * as utils from "../../utils";

import "./basic.scss";

class EditResonatorBasic extends Component {

    constructor(props) {
        super(props);

        this.bodyRich = props.description || "";
        this.state = {
            direction: props.description ? utils.getDir(props.description) : "ltr"
        }
        this.richChange = this.richChange.bind(this);
        this.descriptionRef = React.createRef();
    }

    richChange(state) {
        const bodyHTML = stateToHTML(state.getCurrentContent());
        const bodyPlain = state.getCurrentContent().getPlainText();

        if (this.bodyRich !== bodyHTML) {
            this.bodyRich = bodyHTML;
            this.props.formData.description = bodyHTML;
            const newDir = bodyHTML ? utils.getDir(bodyPlain) : false;
            if (newDir && this.state.direction !== newDir) {
                this.setState({direction: newDir}, () => {
                    this.descriptionRef.current?.focus()
                });
            }
        }
    }

    render() {
        return (
            <div>
                <Field name="title" label="Title" component={TextField} style={{ marginBottom:"25px" }}/>
                <div style={{ direction: this.state.direction, textAlign: this.state.direction === "rtl" ? "right" : "left"}}>
                    <Field type="text" placeholder="Description" label="Description" name="description" component={({ input: { onChange, value }, meta, ...custom }) => {
                        const contentHTML = convertFromHTML(value || this.bodyRich);
                        const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
                        const content = JSON.stringify(convertToRaw(state));

                        return (
                            <MuiThemeProvider theme={richEditorTheme}>
                                <MUIRichTextEditor
                                    ref={this.descriptionRef}
                                    defaultValue={content}
                                    controls={["title", "bold", "italic", "underline", "strikethrough", "link", "media", "numberList", "bulletList", "quote", "code", "clear"]}
                                    label="Description"
                                    onChange={this.richChange}
                                />
                            </MuiThemeProvider>
                        );
                    }} />
                </div>
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
        return errors;
    },
})(EditResonatorBasic));
