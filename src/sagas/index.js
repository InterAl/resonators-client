import { combineReducers } from 'redux';

const createRootSaga = (sagas, sagaParams) => function*() {
    yield sagas.map(saga => saga(sagaParams));
};

export const sagas = createRootSaga([
    require('./initSaga').default.saga,
    require('./sessionSaga').default.saga
], {});

export const reducers = combineReducers({
    session: require('../sagas/sessionSaga').default.reducer
});
