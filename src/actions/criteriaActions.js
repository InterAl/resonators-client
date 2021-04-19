import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'CREATE_CRITERION',
    'UPDATE_CRITERION',
    'DELETE_CRITERION',
    'FREEZE',
    'UNFREEZE',
    'ALPHABET_SORT',
    'FILTER_TAGS',
    'FILTER_TYPE',
    'TOGGLE_DISPLAY_FROZEN',
    'EDIT',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'CRITERIA_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'CRITERIA_');
