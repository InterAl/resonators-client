import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';

const createRootSaga = (sagas, sagaParams) => function*() {
    yield all(sagas.map(saga => saga(sagaParams)));
};

export const sagas = createRootSaga([
    require('./initSaga').default.saga,
    require('./sessionSaga').default.saga,
    require('./sideMenuSaga').default.saga,
    require('./clinicsSaga').default.saga,
    require('./leaderSaga').default.saga,
    require('./followersSaga').default.saga,
    require('./invitationsSaga').default.saga,
    require('./followerGroupsSaga').default.saga,
    require('./navigationSaga').default.saga,
    require('./resonatorCreation').default.saga,
    require('./criteriaSaga').default.saga,
    require('./resonatorStatsSaga').default.saga,
    require('./cardSaga').default.saga,
    require('./resonatorFeedbackSaga').default.saga,
    require('./pwaSaga').default.saga,
    require('./googleDataSaga').default.saga
], {});

export const createReducers = history => combineReducers({
    init: require('./initSaga').default.reducer,
    session: require('./sessionSaga').default.reducer,
    menu: require('./sideMenuSaga').default.reducer,
    clinics: require('./clinicsSaga').default.reducer,
    leaders: require('./leaderSaga').default.reducer,
    followers: require('./followersSaga').default.reducer,
    followerGroups: require('./followerGroupsSaga').default.reducer,
    invitations: require('./invitationsSaga').default.reducer,
    navigation: require('./navigationSaga').default.reducer,
    resonatorCreation: require('./resonatorCreation').default.reducer,
    criteria: require('./criteriaSaga').default.reducer,
    resonatorStats: require('./resonatorStatsSaga').default.reducer,
    cards: require('./cardSaga').default.reducer,
    form: formReducer,
    resonatorFeedback: require('./resonatorFeedbackSaga').default.reducer,
    pwa: require('./pwaSaga').default.reducer,
    googleData: require('./googleDataSaga').default.reducer,
    router: connectRouter(history)
});
