import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'RETRIEVE',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'GOOGLE_DATA_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'GOOGLE_DATA_');
