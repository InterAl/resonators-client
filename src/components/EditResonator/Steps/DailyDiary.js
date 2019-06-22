import React, { Component } from 'react';
import { Field } from 'redux-form';
import TextField from '../../FormComponents/TextField';
import NavButtons from './navButtons';
import FlatButton from 'material-ui/FlatButton';

// import { gapi } from 'googleapis';

import StepBase from './stepBase';

class EditResonatorDailyDiary extends Component {

    constructor() {
        super();

        // this.gConfig =
        //     {
        //         // The Browser API key obtained from the Google API Console.
        //         // Replace with your own Browser API key, or your own key.
        //         developerKey: 'AIzaSyDYdelnaX1QXfl27FcLXn3R7gCU-sYZbaI',

        //         // The Client ID obtained from the Google API Console. Replace with your own Client ID.
        //         clientId: "716003394967-hekl8l5cerm7pdv8tomq1k7muvpu1i5f.apps.googleusercontent.com",

        //         // Replace with your own project number from console.developers.google.com.
        //         // See "Project number" under "IAM & Admin" > "Settings"
        //         appId: "716003394967",

        //         // Scope to use to access user's Drive items.
        //         scope: ['https://www.googleapis.com/auth/drive'],

        //         pickerApiLoaded: false,
        //         oauthToken: null
        //     }
    }


    handleInteractionTypeChange(value, onChange) {
        onChange(value);

        this.props.updateIntractionType(Number(value));
    }
    //======================================================================

    // // Use the Google API Loader script to load the google.picker script.
    // loadPicker() {
    //     gapi.load('auth', { 'callback': onAuthApiLoad });
    //     gapi.load('picker', { 'callback': onPickerApiLoad });
    // }

    // onAuthApiLoad() {
    //     window.gapi.auth.authorize(
    //         {
    //             'client_id': this.gConfig.clientId,
    //             'scope': this.gConfig.scope,
    //             'immediate': false
    //         },
    //         handleAuthResult);
    // }

    // onPickerApiLoad() {
    //     this.gConfig.pickerApiLoaded = true;
    //     createPicker();
    // }

    // handleAuthResult(authResult) {
    //     if (authResult && !authResult.error) {
    //         this.gConfig.oauthToken = authResult.access_token;
    //         createPicker();
    //     }
    // }

    // // Create and render a Picker object for searching images.
    // createPicker() {
    //     if (this.gConfig.pickerApiLoaded && this.gConfig.oauthToken) {
    //         var view = new google.picker.View(google.picker.ViewId.DOCS);
    //         view.setMimeTypes("image/png,image/jpeg,image/jpg");
    //         var picker = new google.picker.PickerBuilder()
    //             .enableFeature(google.picker.Feature.NAV_HIDDEN)
    //             .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    //             .setAppId(appId)
    //             .setOAuthToken(oauthToken)
    //             .addView(view)
    //             .addView(new google.picker.DocsUploadView())
    //             .setDeveloperKey(developerKey)
    //             .setCallback(pickerCallback)
    //             .build();
    //         picker.setVisible(true);
    //     }
    // }

    // // A simple callback implementation.
    // pickerCallback(data) {
    //     if (data.action == google.picker.Action.PICKED) {
    //         var fileId = data.docs[0].id;
    //         alert('The user selected: ' + fileId);
    //     }
    // }
    //======================================================================
    ChooseFile() {
        // loadPicker();
    }

    render() {
        return (
            <div className='resonator-criteria-selection col-xs-12'>

                <Field name='selectedQuestionnaire'
                    placeholder='DASS-21-ENG'
                    type='text'
                    component={TextField} />
                {!this.props.editMode &&
                    <FlatButton
                        label="Choose"
                        primary={true}
                        onTouchTap={this.ChooseFile}
                    />
                }

                <Field name='questionnaireDetails'
                    placeholder='Details:'
                    type='text'
                    component={TextField} />


                {!this.props.editMode && <NavButtons
                    onNext={this.props.onNext}
                    onBack={this.props.onBack}
                />}

            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator,
        editMode: state.resonatorCreation.editMode,
    }
}
export default StepBase({
    noBack: true,
    validate(formData) {
        let errors = {};

        return errors;
    }
})(EditResonatorDailyDiary);
