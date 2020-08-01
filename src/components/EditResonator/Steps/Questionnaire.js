import React, { Component } from 'react';
import { Field } from 'redux-form';
import TextField from '../../FormComponents/TextField';
import NavButtons from './navButtons';
import { Button } from '@material-ui/core';

import StepBase from './stepBase';
// import gapi from 'googleapis';

// let gConfig =
// {
//     // The Browser API key obtained from the Google API Console.
//     // Replace with your own Browser API key, or your own key.
//     developerKey: 'AIzaSyDYdelnaX1QXfl27FcLXn3R7gCU-sYZbaI',

//     // The Client ID obtained from the Google API Console. Replace with your own Client ID.
//     clientId: "716003394967-hekl8l5cerm7pdv8tomq1k7muvpu1i5f.apps.googleusercontent.com",

//     // Replace with your own project number from console.developers.google.com.
//     // See "Project number" under "IAM & Admin" > "Settings"
//     appId: "716003394967",

//     // Scope to use to access user's Drive items.
//     scope: ['https://www.googleapis.com/auth/drive'],

//     pickerApiLoaded: false,
//     oauthToken: null
// }

//     //======================================================================

//     // Use the Google API Loader script to load the google.picker script.
//     function   loadPicker() {
//         gapi.load('auth', { 'callback': onAuthApiLoad });
//         gapi.load('picker', { 'callback': onPickerApiLoad });
//     }

//     function onAuthApiLoad() {
//         window.gapi.auth.authorize(
//             {
//                 'client_id': gConfig.clientId,
//                 'scope': gConfig.scope,
//                 'immediate': false
//             },
//             handleAuthResult);
//     }

//     function  onPickerApiLoad() {
//         gConfig.pickerApiLoaded = true;
//         createPicker();
//     }

//     function handleAuthResult(authResult) {
//         if (authResult && !authResult.error) {
//             gConfig.oauthToken = authResult.access_token;
//             createPicker();
//         }
//     }

//     // Create and render a Picker object for searching images.
//     function createPicker() {
//         if (gConfig.pickerApiLoaded && gConfig.oauthToken) {
//             var view = new google.picker.View(google.picker.ViewId.DOCS);
//             view.setMimeTypes("image/png,image/jpeg,image/jpg");
//             var picker = new google.picker.PickerBuilder()
//                 .enableFeature(google.picker.Feature.NAV_HIDDEN)
//                 .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
//                 .setAppId(gConfig.appId)
//                 .setOAuthToken(gConfig.oauthToken)
//                 .addView(view)
//                 .addView(new google.picker.DocsUploadView())
//                 .setDeveloperKey(gConfig.developerKey)
//                 .setCallback(pickerCallback)
//                 .build();
//             picker.setVisible(true);
//         }
//     }

//     // A simple callback implementation.
//    function pickerCallback(data) {
//         if (data.action == google.picker.Action.PICKED) {
//             var fileId = data.docs[0].id;
//             alert('The user selected: ' + fileId);
//         }
//     }
//     //======================================================================


class EditResonatorQuestionnaire extends Component {

    constructor() {
        super();

    }
    ChooseFile() {
        // loadPicker();
        //!this.props.editMode &&
    }

    render() {
        return (
            <div className='resonator-criteria-selection col-xs-12'>

                <Field name='selectedQuestionnaire'
                    placeholder='DASS-21-ENG'
                    type='text'
                    component={TextField} />

                {
                    <Button
                        color="primary"
                        onClick={this.ChooseFile}>
                        Choose
                    </Button>
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
// function mapStateToProps(state) {
//     return {
//         resonator: state.resonatorCreation.resonator,
//         editMode: state.resonatorCreation.editMode,
//     }
// }
export default StepBase({
    noBack: true,
    validate(formData) {
        let errors = {};

        return errors;
    }
})(EditResonatorQuestionnaire);
