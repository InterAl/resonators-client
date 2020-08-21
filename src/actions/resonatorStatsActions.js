import {ActionCreatorHelper} from '../saga-reducers-factory-patch';

const actionsList = [
    'FETCH_RESONATOR_STATS',
    'DOWNLOAD_RESONATOR_STATS',
];

export const types = ActionCreatorHelper.createTypes(actionsList, 'STATS_');
export const actions = ActionCreatorHelper.createActions(actionsList, 'STATS_');
