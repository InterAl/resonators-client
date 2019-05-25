import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

const createRootSaga = (sagas, sagaParams) => function*() {
    yield sagas.map(saga => saga(sagaParams));
};

export const sagas = createRootSaga([
    require('./initSaga').default.saga,
    require('./sessionSaga').default.saga,
    require('./sideMenuSaga').default.saga,
    require('./clinicsSaga').default.saga,
    require('./leaderSaga').default.saga,
    require('./followersSaga').default.saga,
    require('./navigationSaga').default.saga,
    require('./resonatorCreation').default.saga,
    require('./criteriaSaga').default.saga,
    require('./resonatorStatsSaga').default.saga,
    require('./cardSaga').default.saga,
    require('./resonatorFeedbackSaga').default.saga
], {});

export const reducers = combineReducers({
    init: require('./initSaga').default.reducer,
    session: require('../sagas/sessionSaga').default.reducer,
    menu: require('./sideMenuSaga').default.reducer,
    clinics: require('./clinicsSaga').default.reducer,
    leaders: require('./leaderSaga').default.reducer,
    followers: require('./followersSaga').default.reducer,
    navigation: require('./navigationSaga').default.reducer,
    resonatorCreation: require('./resonatorCreation').default.reducer,
    criteria: require('./criteriaSaga').default.reducer,
    resonatorStats: require('./resonatorStatsSaga').default.reducer,
    cards: require('./cardSaga').default.reducer,
    form: formReducer,
    resonatorFeedback: require('./resonatorFeedbackSaga').default.reducer,
    routing: routerReducer
});
