import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import {Field, reduxForm} from "redux-form";
import QRCode from "react-qr-code";
import { actions } from "../actions/clinicSettingsActions";

import "./ClinicSettings.scss";
import TextField from "components/FormComponents/TextField";

class ClinicSettings extends Component {

    constructor(props) {
        super(props);

        this.QRSize = 64;

        this.state = {
            open: false,
            logoPreview: null,
            therapistPreview: null,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleLogoChange = this.handleLogoChange.bind(this);
        this.handleTherapistPictureChange = this.handleTherapistPictureChange.bind(this);
        this.handleRemoveLogo = this.handleRemoveLogo.bind(this);
        this.handleRemoveTherapistPicture = this.handleRemoveTherapistPicture.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.updateQR = this.updateQR.bind(this);
    }

    handleOpen() {
        this.setState({open:true});
    }

    handleClose() {
        this.setState({open:false});
    }

    handleSave() {
        this.props.saveSettings();
        this.handleClose();
    }

    handleLogoChange(e) {
        const file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = (e) => {
            this.setState({
                logoPreview: e.target.result,
            });
            this.updateForm({logo: e.target.result});
        };
        reader.readAsDataURL(file);
    }

    handleTherapistPictureChange(e) {
        const file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = (e) => {
            this.setState({
                therapistPreview: e.target.result,
            });
            this.updateForm({therapistPicture: e.target.result});
        };
        reader.readAsDataURL(file);
    }

    handleRemoveLogo() {
        this.setState({logoPreview: null});
        this.updateForm({logo: null});
    }

    handleRemoveTherapistPicture() {
        this.setState({therapistPreview: null});
        this.updateForm({therapistPicture: null});
    }

    updateForm(payload) {
        this.props.updateForm(payload);
    }

    updateQR() {
        if (!this.props.formData.phone && !this.props.formData.website) {
            this.updateForm({QRImage: null});
        } else {
            const svg = document.getElementById("QRCode");
            if (!svg) {
                this.updateForm({QRImage: false});
                return false;
            }

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                this.updateForm({QRImage: pngFile});
            }

            img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
        }
    }

    renderForm() {
        const QRPhone = (this.props.formData.phone) ? "Phone: " + this.props.formData.phone : false;
        const QRWebsite = (this.props.formData.website) ? " Website: " + this.props.formData.website : false;
        const QRValue = [QRPhone, QRWebsite].filter(Boolean).join();
        this.updateQR();

        return (
            <div className="clinicSettings">
                <div className="clinicSettings_row">
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="logo-input"
                        type="file"
                        onChange={this.handleLogoChange}
                    />
                    <div className="select_image_wrapper">
                        <p className="select_image_text">Clinic Logo</p>
                        {(this.state.logoPreview || this.props.activeClinic?.logo) && <>
                            <img src={this.state.logoPreview || this.props.activeClinic?.logo} />
                            <Button onClick={this.handleRemoveLogo} style={{ color: "#ff4444" }}>Remove Image</Button>
                        </>}
                        <div className="select_image_buttonWrapper">
                            <label htmlFor="logo-input">
                                <Button variant="contained" color="primary" component="span">Upload</Button>
                            </label>
                        </div>
                    </div>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="therapist-input"
                        type="file"
                        onChange={this.handleTherapistPictureChange}
                    />
                    <div className="select_image_wrapper">
                        <p className="select_image_text">Leader's Picture</p>
                        {(this.state.therapistPreview || this.props.activeClinic?.therapistPicture) && <>
                            <img src={this.state.therapistPreview || this.props.activeClinic?.therapistPicture} />
                            <Button onClick={this.handleRemoveTherapistPicture} style={{ color: "#ff4444" }}>Remove Image</Button>
                        </>}
                        <div className="select_image_buttonWrapper">
                            <label htmlFor="therapist-input">
                                <Button variant="contained" color="primary" component="span">Upload</Button>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="clinicSettings_row">
                    <Field
                        name="name"
                        label="Clinic Name"
                        type="text"
                        component={TextField}
                        onChange={(e) => this.updateForm({name: e.target.value})}
                    />
                    <Field
                        name="therapistName"
                        label="Therapist Name"
                        type="text"
                        component={TextField}
                        onChange={(e) => this.updateForm({therapistName: e.target.value})}
                    />
                </div>
                <div className="clinicSettings_row">
                    <Field
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        component={TextField}
                        onChange={(e) => this.updateForm({phone: e.target.value})}
                    />
                    <Field
                        name="website"
                        label="Website"
                        type="url"
                        component={TextField}
                        onChange={(e) => this.updateForm({website: e.target.value})}
                    />
                </div>
                <div className="clinicSettings_row qr_wrapper">
                    {QRValue && <QRCode id="QRCode" value={QRValue} size={this.QRSize} />}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.clinicBrandingEnabled === false) return false;
        return (
            <>
                <Settings onClick={this.handleOpen} style={{cursor:"pointer"}}/>
                <Dialog open={this.state.open} className="clinic-settings-modal" onClose={this.handleClose}>
                    <DialogTitle>Clinic Settings</DialogTitle>
                    <DialogContent color="primary">{this.renderForm()}</DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Close</Button>
                        <Button onClick={this.handleSave} color="primary" variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const Form = reduxForm({
    form: "clinicSettings",
})(ClinicSettings);

function mapStateToProps(state) {
    const activeClinic = state.clinicSettings?.activeClinic;
    const formData = state.clinicSettings?.formData;
    const clinicBrandingEnabled = state.leaders.leaders.clinic_branding;
    formData.phone = activeClinic?.phone;
    formData.website = activeClinic?.website;
    formData.name = activeClinic?.name;
    formData.therapistName = activeClinic?.therapistName;

    return {
        formData,
        activeClinic,
        clinicBrandingEnabled,
        initialValues: {
            phone: activeClinic?.phone,
            website: activeClinic?.website,
            name: activeClinic?.name,
            therapistName: activeClinic?.therapistName,
        },
        enableReinitialize: true,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveSettings: actions.save,
        updateForm: actions.updateForm
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
