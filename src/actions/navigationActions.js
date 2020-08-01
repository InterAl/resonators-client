import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'NAVIGATE',
    'SHOW_MODAL',
    'HIDE_MODAL'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'NAVIGATION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'NAVIGATION_');
