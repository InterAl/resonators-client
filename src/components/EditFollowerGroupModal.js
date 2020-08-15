import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../actions/followerGroupsActions";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import TextField from "./FormComponents/TextField";
import navigationInfoSelector from "../selectors/navigationSelector";


class EditFollowerGroupModal extends Component {
    static propTypes = {
        editMode: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        const editCfg = {
            title: 'Edit Follower Group',
            doneBtn: 'Update',
        };

        const newCfg = {
            title: 'Create Follower Group',
            doneBtn: 'Create',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.cfg = props.editMode ? editCfg : newCfg;
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(formData) {
        if (this.props.editMode)
            this.props.update({...formData, id: this.props.followerGroupId});
        else
            this.props.create(formData);

        this.props.onClose();
    }

    renderForm() {
        return (
            <form autoComplete="off">
                <Field type="text" placeholder="Name" name="group_name" component={TextField} />
            </form>
        );
    }

    render() {
        return (
            <Dialog open={this.props.open} className="edit-followerGroup-modal" onClose={this.props.onClose}>
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
                        className="create-followerGroup-btn"
                    >
                        {this.cfg.doneBtn}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const Form = reduxForm({
    form: "editFollowerGroup",
    validate: (formData) => {
        let errors = {};
        if (!formData.group_name) errors.group_name = "Required";
        return errors;
    },
})(EditFollowerGroupModal);

function mapStateToProps(state) {
    const {
        modalProps: { followerGroupId, editMode },
    } = navigationInfoSelector(state);
    const followerGroup = _.find(state.followerGroups.followerGroups, (fg) => fg.id === followerGroupId);
    const clinics = state.clinics.clinics;
    const current_clinic_id = state.leaders.leaders.current_clinic_id;

    const ret = {
        followerGroup,
        clinics,
        editMode,
    };

    if (followerGroup) {
        ret.initialValues = {
            group_name: followerGroup.group_name,
        };
    } else {
        ret.initialValues = {
            clinic: current_clinic_id,
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
