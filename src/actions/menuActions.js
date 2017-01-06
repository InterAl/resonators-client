import {ActionCreatorHelper} from 'saga-reducer-factory';

const actionsList = [
    'TOGGLE_MENU',
    'CLICK_MENU_ITEM'
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'MENU_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'MENU_');
