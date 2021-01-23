import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { actions } from "../actions/invitationsActions";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import TextField from "./FormComponents/TextField";
import MUIRichTextEditor from "mui-rte";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { richEditorTheme } from "./richEditorTheme";
import navigationInfoSelector from "../selectors/navigationSelector";

class EditInvitationModal extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        let editCfg = {
            title: "Edit Invitation",
            doneBtn: "Update",
        };

        let newCfg = {
            title: "Create Invitation",
            doneBtn: "Create",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.richChange = this.richChange.bind(this);
        this.cfg = props.editMode ? editCfg : newCfg;
        this.bodyRich = props.invitation ? props.invitation.body : "";
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(formData) {
        formData.body = this.bodyRich;
        if (this.props.editMode) this.props.update({ ...formData, id: this.props.invitationId });
        else this.props.create(formData);

        this.props.onClose();
    }

    richChange(state) {
        const bodyHTML = state.getCurrentContent().getPlainText();
        if (this.bodyRich !== bodyHTML) this.bodyRich = bodyHTML;
    }

    renderForm() {
        return (
            <form autoComplete="off" style={{ margin: "50px 0" }}>
                <Field type="text" placeholder="Subject" name="subject" style={{ marginBottom: "30px" }} component={TextField} />
                <Field type="text" placeholder="Body" name="body" component={({ input: { onChange, value }, meta, ...custom }) => {
                    const contentHTML = convertFromHTML(value);
                    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
                    const content = JSON.stringify(convertToRaw(state));

                    return (
                        <MuiThemeProvider theme={richEditorTheme}>
                            <MUIRichTextEditor
                                defaultValue={content}
                                controls={[]}
                                label="Body..."
                                onChange={this.richChange}
                                maxLength={1500}
                            />
                        </MuiThemeProvider>
                    );
                }} />
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className="edit-invitation-modal" onClose={this.props.onClose}>
                <DialogTitle>{this.cfg.title}</DialogTitle>
                <DialogContent>{this.renderForm()}</DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={this.props.handleSubmit(this.handleSubmit)}
                        color="primary"
                        variant="contained"
                        className="create-invitation-btn"
                    >
                        {this.cfg.doneBtn}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function validateInput(data) {
    let errors = {};

    if (!data.subject) errors.subject = "Required";

    return errors;
}

let Form = reduxForm({
    form: "editInvitation",
    validate: validateInput,
})(EditInvitationModal);

function mapStateToProps(state) {
    const {
        modalProps: { invitationId, editMode },
    } = navigationInfoSelector(state);
    const invitation = _.find(state.invitations.invitations, (i) => i.id === invitationId);

    const ret = {
        invitation,
        editMode,
    };

    if (invitation) {
        ret.initialValues = {
            subject: invitation.subject,
            body: invitation.body,
        };
    }

    return ret;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            update: actions.update,
            create: actions.create,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
