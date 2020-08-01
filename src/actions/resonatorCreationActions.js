import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'UPDATE_CREATION_STEP',
    'CREATE',
    'UPDATE_FINAL',
    'RESET'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'RESONATORCREATION_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'RESONATORCREATION_');
