import {ActionCreatorHelper} from 'SagaReducerFactory';

const actionsList = [
    'EXPAND',
    'CONTRACT'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'CARD_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'CARD_');
