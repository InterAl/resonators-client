import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'CREATE_CRITERION',
    'UPDATE_CRITERION',
    'DELETE_CRITERION',
    'FREEZE',
    'UNFREEZE',
    'ALPHABET_SORT',
    'FILTER_TAGS',
    'FILTER_TAGS_ALL',
    'FILTER_TYPE',
    'FILTER_TYPE_ALL',
    'TOGGLE_DISPLAY_FROZEN',
    'EDIT',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'CRITERIA_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'CRITERIA_');
