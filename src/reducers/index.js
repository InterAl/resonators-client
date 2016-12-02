import { combineReducers } from 'redux';

const reducers = {
    session: require('../sagas/sessionSaga').default.reducer
};

const combined = combineReducers(reducers);

module.exports = combined;
