import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'SAVE',
    'UPDATE_FORM'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'CLINIC_SETTINGS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'CLINIC_SETTINGS_');
